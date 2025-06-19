import javascriptGenerator from '../../../javascriptGenerator';
import registerBlock from '../../../register';

function createExtensionInstance(extensionClass) {
    // eval(extensionClass)
    return extensionClass;
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

        if (type == "label" || type == "gap") {
            continue;
        }

        jsonData["message0"] = text;
        jsonData["args0"] = [];
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
    return defineXmlOfExtension(extensionClass)
}

export default registerCustomExtension