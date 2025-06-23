import javascriptGenerator from '../../javascriptGenerator';
import registerBlock from '../../register';

function createExtensionInstance(extensionClass) {
    if (typeof window !== 'undefined') {
        let registered = false;

        if (typeof extensionClass === "function") {
            try {
                extensionClass(dinoBuilder);
                registered = true;
            } catch (_) {}
        }

        if (!registered && typeof extensionClass === "string" && extensionClass.includes("class")) {
            try {
                const wrappedCode = `
                    ${extensionClass}
                    return Extension;
                `;
                const ConvertedClass = new Function(wrappedCode)();
                return new ConvertedClass();
                registered = true;
            } catch (_) {}
        }
    } else {
        throw new Error("This code must run in the browser.");
    }
}

function checkForErrors(extensionClass) {
    const extension = createExtensionInstance(extensionClass);

    const name = extension.getInfo()["name"];
    const blocks = extension.getInfo()["blocks"];
    const colour = extension.getInfo()["colour"];

    if (!name) {
        console.warn("This Extension doesn't have a name. While it's not required, it's still recommended to add them")
    }

    function isABoolean(value) {
        return (typeof value === "boolean")
    }
    function isValidXML(xml) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, "text/xml");
        return !doc.querySelector("parsererror");
    }

    for (const block of blocks) {
        switch (block["type"]) {
            case 'xml':
                const xml = block["xml"]
                if (typeof xml !== 'string' || xml.trim() === '') {
                    console.error("XML block must have a non-empty 'xml' attribute.")
                } else if (!isValidXML(xml)) {
                    console.error("Parse Error: Invalid XML in 'xml' block.")
                }
                if (block["opcode"]) {
                    console.warn("Opcodes are not needed in xml, labels and gaps")
                }
                break;
            case 'gap':
                if (block["opcode"]) {
                    console.warn("Opcodes are not needed in xml, labels and gaps")
                }
                if (!("gap" in block)) {
                    console.warn("Gaps should have a 'gap' attribute")
                }
                break;
            case 'label':
                if (block["opcode"]) {
                    console.warn("Opcodes are not needed in xml, labels and gaps")
                }
                if (!("text" in block)) {
                    console.warn("Labels should have a 'text' attribute")
                }
                break;
            case 'boolean':
            case 'reporter':
            case 'block':
                if (!block["opcode"]) {
                    console.error("Opcodes are required in Blocks, Reporters and Booleans")
                }
                if (!block["returns"]) {
                    console.warn("Blocks, Reporters and Booleans should return something.")
                }
                if (block["type"] == 'block') {
                    if (block["isTerminal"]) {
                        if (!isABoolean(block["isTerminal"])) {
                            console.error("isTerminal attribute must be a Boolean")
                        }
                    }
                }
                break;
            case undefined:
            case null:
                console.error("Block Type is required.")
                break;
            default:
                console.error("Unknown Block Type")
                break;
        }
    }
}

function defineXmlOfExtension(extensionClass) {
    const extension = createExtensionInstance(extensionClass);

    const id = extension.getInfo()["id"];
    const name = extension.getInfo()["name"];
    const blocks = extension.getInfo()["blocks"];
    const colour = extension.getInfo()["colour"];
    const headerCode = `<xml>`;
    const footerCode = `</xml>`;
    const registryCode = {
        "categoryTop": `<category name="${name}" colour="${colour}" data-extension="true">`,
        "categoryBottom": `</category>`
    }
    let xmlblocks = ``
    for (const block of blocks) {
        const blockid = block["opcode"];
        const type = block["type"];
        if (blockid) {
            const editedid = id + '_' + blockid;
            xmlblocks += `<block type="${editedid}" data-extension="true" />`
        }
        if (type == 'xml') {
            const xml = block["xml"];
            xmlblocks += `${xml}`
        }
        if (type == 'gap') {
            const gap = block["gap"];
            xmlblocks += `<sep gap="${gap}" />`
        }
        if (type == 'label') {
            const text = block["text"];
            xmlblocks += `<label text="${text}" />`
        }
    }
    return (headerCode + registryCode["categoryTop"] + xmlblocks + registryCode["categoryBottom"] + footerCode)
}

function registerCustomExtension(extensionClass) {
    const extension = createExtensionInstance(extensionClass);

    const name = extension.getInfo()["name"];
    const id = extension.getInfo()["id"];
    const blocks = extension.getInfo()["blocks"];
    const colour = extension.getInfo()["colour"];
    for (const block of blocks) {
        const blockid = block["opcode"];
        const text = block["text"];
        const type = block["type"];
        const returns = block["returns"];
        const jsonData = {};
        function defineOutput(output) {
            switch (output) {
                default:
                case 'none':
                    return null;
                case 'text':
                case 'string':
                    return 'String'
                case 'number':
                    return 'Number'
                case 'boolean':
                    return 'Boolean'
            }
        }

        if (type == "label" || type == "gap" || type == "xml") {
            continue;
        }

        let argIndex = 1;
        jsonData["message0"] = text.replace(/\[([^\]]+)\]/g, () => `%${argIndex++}`);
        
        const args = [];
        const argMap = block["arguments"] || {};
        for (const [argName, argDef] of Object.entries(argMap)) {
            const argType = argDef["type"];
            const arg = {
                type: argType,
                name: argName
            };

            if (argType === "input_value" || argType === "input_statement") {
                if (argDef["check"]) {
                    arg.check = argDef["check"];
                }
            } else if (argType.startsWith("field_")) {
                if (argType === "field_input") {
                    arg.text = "";
                } else if (argType === "field_number") {
                    arg.value = 0;
                }
            }

            args.push(arg);
        }
        jsonData["args0"] = args;
        jsonData["inputsInline"] = true;
        switch (type) {
            case 'block':
                const isCap = block["isTerminal"];
                jsonData["previousStatement"] = null;
                if (!isCap) {
                    jsonData["nextStatement"] = null;
                }
                break;
            case 'reporter':
                const output = block["output"];
                jsonData["output"] = defineOutput(output);
                break;
            case 'boolean':
                jsonData["output"] = "Boolean";
                break;
        }
        jsonData["colour"] = colour;
        
        registerBlock(id + '_' + blockid, jsonData, (block) => {
            const code = returns(block, javascriptGenerator)
            return code;
        })
    }
    checkForErrors(extensionClass)
    return { xml: defineXmlOfExtension(extensionClass), name: name }
}

export default registerCustomExtension