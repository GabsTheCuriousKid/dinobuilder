import javascriptGenerator from '../javascriptGenerator';
import registerBlock from '../register';
// import { compileVars } from '../compiler/compileVarSection';

const categoryPrefix = 'looks_';
const categoryColor = '#9966FF';

function register() {
    // say
    registerBlock(`${categoryPrefix}say`, {
        message0: 'say %1',
        args0: [
            {
                "type": "input_value",
                "check": "String",
                "name": "TEXT"
            },
        ],
        nextStatement: null,
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TEXT = javascriptGenerator.valueToCode(block, 'TEXT', javascriptGenerator.ORDER_ATOMIC);
        const code = `Scratch.vm.runtime.emit('SAY', util.target, 'say', ${TEXT});`;
        return `${code}\n`;
    })

    // say
    registerBlock(`${categoryPrefix}think`, {
        message0: 'think %1',
        args0: [
            {
                "type": "input_value",
                "check": "String",
                "name": "TEXT"
            },
        ],
        nextStatement: null,
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TEXT = javascriptGenerator.valueToCode(block, 'TEXT', javascriptGenerator.ORDER_ATOMIC);
        const code = `Scratch.vm.runtime.emit('SAY', util.target, 'think', ${TEXT});`;
        return `${code}\n`;
    })

    // say
    registerBlock(`${categoryPrefix}seteffect`, {
        message0: 'set %1 to %2',
        args0: [
            {
                "type": "field_dropdown",
                "name": "EFFECTS",
                "options": [
                    [ "color", "COLOR" ],
                    [ "fisheye", "FISHEYE" ],
                    [ "whirl", "WHIRL" ],
                    [ "pixelate", "PIXELATE" ],
                    [ "mosaic", "MOSAIC" ],
                    [ "brightness", "BRIGHTNESS" ],
                    [ "ghost", "GHOST" ],
                ]
            },
            {
                "type": "input_value",
                "check": "VALUE",
                "name": "TEXT"
            },
        ],
        nextStatement: null,
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const EFFECTS = block.getFieldValue('EFFECTS')
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC);
        const code = `const effect = Scratch.Cast.toString(${EFFECTS}).toLowerCase();\nlet value = Scratch.Cast.toNumber(${VALUE});\nutil.target.setEffect(effect, value);`;
        return `${code}\n`;
    })

    // say
    registerBlock(`${categoryPrefix}geteffect`, {
        message0: 'get %1',
        args0: [
            {
                "type": "field_dropdown",
                "name": "EFFECTS",
                "options": [
                    [ "color", "COLOR" ],
                    [ "fisheye", "FISHEYE" ],
                    [ "whirl", "WHIRL" ],
                    [ "pixelate", "PIXELATE" ],
                    [ "mosaic", "MOSAIC" ],
                    [ "brightness", "BRIGHTNESS" ],
                    [ "ghost", "GHOST" ],
                ]
            },
        ],
        nextStatement: null,
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const EFFECTS = block.getFieldValue('EFFECTS')
        const code = `const effects = util.target.effects;\nconst name = Scratch.Cast.toString(${EFFECTS});\nif (Object.prototype.hasOwnProperty.call(effects, name)) {\nreturn effects[name];\n};`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}gettintcolor`, {
        message0: 'get tint color',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        return [`const effects = util.target.effects;\nif (typeof effects.tintColor !== 'number') return '#ffffff';\nreturn Scratch.Color.decimalToHex(effects.tintColor - 1);`, javascriptGenerator.ORDER_ATOMIC];
    })
}

export default register