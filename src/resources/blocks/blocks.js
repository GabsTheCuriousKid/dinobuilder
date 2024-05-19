import javascriptGenerator from '../javascriptGenerator';
import registerBlock from '../register';
import Blockly from 'blockly/core'

const categoryPrefix = 'blocks_';
const categoryColor = '#FF6680';

function register() {
    // create dem blocks!!!
    registerBlock(`${categoryPrefix}create`, {
        message0: 'create block %1 id: %2 %3 text: %4 %5 type: %6 %7 hide from palette?: %8 %9 inputs: %10 %11 function: %12 %13',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "field_input",
                "name": "ID",
                "text": "id",
                "spellcheck": false
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "field_input",
                "name": "TEXT",
                "text": "text",
                "spellcheck": false
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "field_dropdown",
                "name": "TYPE",
                "options": [
                    [ "block", "COMMAND," ],
                    [ "reporter", "REPORTER," ],
                    [ "boolean", "BOOLEAN," ],
                    [ "hat", "EVENT," ],
                    [ "cap", "COMMAND,\nisTerminal: true," ],
                ]
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_value",
                "name": "CONDITION",
                "check": "Boolean"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "INPUTS",
                "check": "BlockInput"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "FUNC"
            }
        ],
        nextStatement: null,
        inputsInline: false,
        colour: categoryColor,
    }, (block) => {
        const ID = block.getFieldValue('ID')
        const TEXT = block.getFieldValue('TEXT')
        const TYPE = block.getFieldValue('TYPE')
        const CONDITION = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_ATOMIC);
        const INPUTS = javascriptGenerator.statementToCode(block, 'INPUTS');
        const FUNC = javascriptGenerator.statementToCode(block, 'FUNC');
        
        const code = `blocks.push({
            opcode: \`${ID}\`,
            blockType: Scratch.BlockType.${TYPE}
            hideFromPalette: ${CONDITION},
            text: \`${TEXT}\`,
            arguments: { ${INPUTS} },
            disableMonitor: true
        });
        Extension.prototype[\`${ID}\`] = async (args, util) => { ${FUNC} };`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}createcap`, {
        message0: 'create cap block %1 id: %2 %3 text: %4 %5 inputs: %6 %7 function: %8 %9',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "field_input",
                "name": "ID",
                "text": "id",
                "spellcheck": false
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "field_input",
                "name": "TEXT",
                "text": "text",
                "spellcheck": false
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "INPUTS",
                "check": "BlockInput"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "FUNC"
            }
        ],
        nextStatement: null,
        inputsInline: false,
        colour: categoryColor,
    }, (block) => {
        const ID = block.getFieldValue('ID')
        const TEXT = block.getFieldValue('TEXT')
        const INPUTS = javascriptGenerator.statementToCode(block, 'INPUTS');
        const FUNC = javascriptGenerator.statementToCode(block, 'FUNC');
        
        const code = `blocks.push({
            opcode: \`${ID}\`,
            blockType: Scratch.BlockType.COMMAND,
            text: \`${TEXT}\`,
            arguments: { ${INPUTS} },
            isTerminal: true,
            disableMonitor: true
        });
        Extension.prototype[\`${ID}\`] = async (args, util) => { ${FUNC} };`;
        return `${code}\n`;
    })

    // create dem inputss!!!
    registerBlock(`${categoryPrefix}input`, {
        message0: 'create input %1 id: %2 %3 type: %4 %5 default: %6',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "field_input",
                "name": "ID",
                "text": "ID",
                "spellcheck": false
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "field_dropdown",
                "name": "TYPE",
                "options": [
                    [ "string", "STRING" ],
                    [ "number", "NUMBER" ],
                    [ "boolean", "BOOLEAN" ],
                    [ "color", "COLOR" ],
                    [ "costume", "COSTUME" ],
                    [ "sound", "SOUND" ],
                    [ "angle", "ANGLE" ],
                    [ "matrix", "MATRIX" ],
                    [ "note", "NOTE" ],
                    [ "empty", "empty" ],
                ]
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_value",
                "name": "DEFAULT",
            }
        ],
        nextStatement: "BlockInput",
        previousStatement: "BlockInput",
        inputsInline: false,
        colour: categoryColor,
    }, (block) => {
        const ID = block.getFieldValue('ID')
        const TYPE = block.getFieldValue('TYPE')
        const DEFAULT = javascriptGenerator.valueToCode(block, 'DEFAULT', javascriptGenerator.ORDER_ATOMIC);
        
        const code = `"${ID}": {
            type: Scratch.ArgumentType.${TYPE}, ${DEFAULT ? `
            defaultValue: ${DEFAULT},`: ''}
        },`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}menu`, {
        message0: 'create menu input %1 id: %2 %3 menu: %4',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "field_input",
                "name": "ID",
                "text": "ID",
                "spellcheck": false
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "field_input",
                "name": "MENU",
                "text": "ID",
                "spellcheck": false
            },
        ],
        nextStatement: "BlockInput",
        previousStatement: "BlockInput",
        inputsInline: false,
        colour: categoryColor,
    }, (block) => {
        const ID = block.getFieldValue('ID')
        const MENU = block.getFieldValue('MENU')
        
        const code = `"${ID}": {
            type: Scratch.ArgumentType.STRING,
            menu: '${MENU}'
        },`;
        return `${code}\n`;
    })

    // get input
    registerBlock(`${categoryPrefix}get`, {
        message0: 'get %1',
        args0: [
            {
                "type": "field_input",
                "name": "NAME",
                "text": "INPUTID",
                "spellcheck": false
            }
        ],
        output: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = block.getFieldValue('NAME')
        return [`args["${NAME}"]`, javascriptGenerator.ORDER_ATOMIC];
    })

    // return
    registerBlock(`${categoryPrefix}return`, {
        message0: 'return %1',
        args0: [
            {
                "type": "input_value",
                "name": "VALUE",
            }
        ],
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC);
        const code = `return ${VALUE || ''}`;
        return `${code}\n`;
    })

    // return
    registerBlock(`${categoryPrefix}callhat`, {
        message0: 'call hat %1',
        args0: [
            {
                "type": "field_input",
                "name": "NAME",
                "text": "HATID",
                "spellcheck": false
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const NAME = block.getFieldValue('NAME')
        const code = `Scratch.vm.runtime.startHats(\`\${Extension.prototype.getInfo().id}_${NAME}\`)`;
        return `${code}\n`;
    })
    // create dem blocks!!!
    registerBlock(`${categoryPrefix}penguinmodcreate`, {
        message0: 'create block %1 id: %2 %3 text: %4 %5 type: %6 %7 hide from palette?: %8 %9 color1: %10 %11 color2: %12 %13 color3: %14 %15 inputs: %16 %17 function: %18 %19',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "field_input",
                "name": "ID",
                "text": "id",
                "spellcheck": false
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "field_input",
                "name": "TEXT",
                "text": "text",
                "spellcheck": false
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "field_dropdown",
                "name": "TYPE",
                "options": [
                    [ "block", "COMMAND," ],
                    [ "reporter", "REPORTER," ],
                    [ "boolean", "BOOLEAN," ],
                    [ "hat", "EVENT," ],
                    [ "cap", "COMMAND,\nisTerminal: true," ],
                ]
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_value",
                "name": "CONDITION",
                "check": "Boolean"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "field_colour_hsv_sliders",
                "name": "COLOR1",
                "colour": "#ff0000"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "field_colour_hsv_sliders",
                "name": "COLOR2",
                "colour": "#ff0000"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "field_colour_hsv_sliders",
                "name": "COLOR3",
                "colour": "#ff0000"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "INPUTS",
                "check": "BlockInput"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "FUNC"
            }
        ],
        nextStatement: null,
        inputsInline: false,
        colour: '#00C3FF',
    }, (block) => {
        const ID = block.getFieldValue('ID')
        const TEXT = block.getFieldValue('TEXT')
        const TYPE = block.getFieldValue('TYPE')
        const CONDITION = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_ATOMIC);
        const COLOR1 = block.getFieldValue('COLOR1')
        const COLOR2 = block.getFieldValue('COLOR2')
        const COLOR3 = block.getFieldValue('COLOR3')
        const INPUTS = javascriptGenerator.statementToCode(block, 'INPUTS');
        const FUNC = javascriptGenerator.statementToCode(block, 'FUNC');
        
        const code = `blocks.push({
            opcode: \`${ID}\`,
            blockType: Scratch.BlockType.${TYPE}
            hideFromPalette: ${CONDITION},
            color1: \`${COLOR1}\`,
            color2: \`${COLOR2}\`,
            color3: \`${COLOR3}\`,
            text: \`${TEXT}\`,
            arguments: { ${INPUTS} },
            disableMonitor: true
        });
        Extension.prototype[\`${ID}\`] = async (args, util) => { ${FUNC} };`;
        return `${code}\n`;
    })

    // return
    registerBlock(`${categoryPrefix}ispenguinmod`, {
        message0: 'is penguinmod?',
        args0: [],
        output: "Boolean",
        inputsInline: true,
        colour: '#00C3FF',
    }, (block) => {
        const code = `(Scratch.extensions.isPenguinMod)`;
        return `${code}\n`;
    })
}
export default register;
