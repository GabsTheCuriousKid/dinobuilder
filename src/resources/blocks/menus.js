import javascriptGenerator from '../javascriptGenerator';
import registerBlock from '../register';
import { compileVars } from '../compiler/compileVarSection';

const categoryPrefix = 'menus_';
const categoryColor = '#CB48E8';

function register() {
    // make item
    registerBlock(`${categoryPrefix}itemtextvalue`, {
        message0: 'item: text %1 value %2',
        args0: [
            {
                "type": "field_input",
                "name": "TEXT",
                "spellcheck": false
            },
            {
                "type": "field_input",
                "name": "VALUE",
                "spellcheck": false
            },
        ],
        output: "JSONArray",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TEXT = block.getFieldValue('TEXT');
        const VALUE = block.getFieldValue('VALUE');
        return [`{ text: "${TEXT}", value: "${VALUE}" }`, javascriptGenerator.ORDER_ATOMIC];
    })

    // make item
    registerBlock(`${categoryPrefix}joinarrays`, {
        message0: 'join %1 %2 %3 %4 %5 %6',
        args0: [
            {
                "type": "field_input",
                "name": "A",
                "check": "JSONArray"
            },
            {
                "type": "field_input",
                "name": "B",
                "check": "JSONArray"
            },
            {
                "type": "field_input",
                "name": "C",
                "check": "JSONArray"
            },
            {
                "type": "field_input",
                "name": "D",
                "check": "JSONArray"
            },
            {
                "type": "field_input",
                "name": "E",
                "check": "JSONArray"
            },
            {
                "type": "field_input",
                "name": "F",
                "check": "JSONArray"
            },
        ],
        output: "JSONArray",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TEXT = block.getFieldValue('TEXT');
        const VALUE = block.getFieldValue('VALUE');
        return [`{ text: "${TEXT}", value: "${VALUE}" }`, javascriptGenerator.ORDER_ATOMIC];
    })

    // create ze menu
    registerBlock(`${categoryPrefix}create`, {
        message0: 'create menu %1 id: %2 %3 values: %4 allow inputs: %5',
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
                "type": "input_value",
                "name": "VALUES",
                "check": "JSONArray"
            },
            {
                "type": "field_dropdown",
                "name": "REPORTERS",
                "options": [
                    ["true", "true"],
                    ["false", "false"]
                ]
            }
        ],
        inputsInline: false,
        colour: categoryColor,
    }, (block) => {
        const ID = block.getFieldValue('ID')
        const VALUES = javascriptGenerator.valueToCode(block, 'VALUES', javascriptGenerator.ORDER_ATOMIC)
        const REPORTERS = block.getFieldValue('REPORTERS')
        
        const code = `menus["${ID}"] = {
            acceptReporters: ${REPORTERS},
            items: ['${VALUES}']
        }`
        return `${code}\n`;
    })
}

export default register