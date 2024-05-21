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

    // think
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

    // set effect
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
                "check": "Number",
                "name": "VALUE"
            },
        ],
        nextStatement: null,
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const EFFECTS = block.getFieldValue('EFFECTS')
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC);
        const code = `const effect = Scratch.Cast.toString('${EFFECTS}').toLowerCase();\nlet value = Scratch.Cast.toNumber(${VALUE});\nutil.target.setEffect(effect, value);`;
        return `${code}\n`;
    })

    // change effect by
    registerBlock(`${categoryPrefix}changeeffectby`, {
        message0: 'change %1 by %2',
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
                "check": "Number",
                "name": "VALUE"
            },
        ],
        nextStatement: null,
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const EFFECTS = block.getFieldValue('EFFECTS')
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC);
        const code = `const effect = Scratch.Cast.toString(${EFFECTS}).toLowerCase();\nconst change = Scratch.Cast.toNumber(${VALUE});\nif (!util.target.effects.hasOwnProperty(effect)) return;\nlet newValue = change + util.target.effects[effect];\nutil.target.setEffect(effect, newValue);`;
        return `${code}\n`;
    })

    // clear effects
    registerBlock(`${categoryPrefix}cleareffects`, {
        message0: 'clear effects',
        args0: [],
        nextStatement: null,
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `util.target.clearEffects();`;
        return `${code}\n`;
    })

    // get effect
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
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const EFFECTS = block.getFieldValue('EFFECTS')
        return [`util.target.effects[Scratch.Cast.toString('${EFFECTS}')]`, javascriptGenerator.ORDER_ATOMIC]
    })

    // set effect 2
    registerBlock(`${categoryPrefix}setpenguinmodeffect`, {
        message0: 'set %1 to %2',
        args0: [
            {
                "type": "field_dropdown",
                "name": "EFFECTS",
                "options": [
                    [ "saturation", "SATURATION" ],
                    [ "red", "RED" ],
                    [ "green", "GREEN" ],
                    [ "blue", "BLUE" ],
                    [ "opaque", "OPAQUE" ],
                ]
            },
            {
                "type": "input_value",
                "check": "Number",
                "name": "VALUE"
            },
        ],
        nextStatement: null,
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const EFFECTS = block.getFieldValue('EFFECTS')
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC);
        const code = `const effect = Scratch.Cast.toString('${EFFECTS}').toLowerCase();\nlet value = Scratch.Cast.toNumber(${VALUE});\nutil.target.setEffect(effect, value);`;
        return `${code}\n`;
    })

    // get effect 2
    registerBlock(`${categoryPrefix}getpenguinmodeffect`, {
        message0: 'get %1',
        args0: [
            {
                "type": "field_dropdown",
                "name": "EFFECTS",
                "options": [
                    [ "saturation", "SATURATION" ],
                    [ "red", "RED" ],
                    [ "green", "GREEN" ],
                    [ "blue", "BLUE" ],
                    [ "opaque", "OPAQUE" ],
                ]
            },
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const EFFECTS = block.getFieldValue('EFFECTS')
        return [`(const effects = util.target.effects;\nconst name = Scratch.Cast.toString('${EFFECTS}');\nif (Object.prototype.hasOwnProperty.call(effects, name)) {\neffects[name]\n})`, javascriptGenerator.ORDER_ATOMIC]
    })

    registerBlock(`${categoryPrefix}gettintcolor`, {
        message0: 'get tint color',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        return [`(const effects = util.target.effects;\nif (typeof effects.tintColor !== 'number') '#ffffff';\n Scratch.Color.decimalToHex(effects.tintColor - 1))`, javascriptGenerator.ORDER_ATOMIC];
    })

    // set layer
    registerBlock(`${categoryPrefix}setlayer`, {
        message0: 'go to layer %1',
        args0: [
            {
                "type": "input_value",
                "check": "Number",
                "name": "VALUE"
            },
        ],
        nextStatement: null,
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC);
        const code = `const target = util.target;\nconst layerOrder = target.getLayerOrder();\nconst newLayer = ${VALUE} - layerOrder;\ntarget.renderer.setDrawableOrder(target.drawableID, newLayer, "sprite", true);`;
        return `${code}\n`;
    })

    // set layer
    registerBlock(`${categoryPrefix}golayer`, {
        message0: 'go %1 %2 layers',
        args0: [
            {
                "type": "field_dropdown",
                "name": "MENU",
                "options": [
                    [ "forward", "" ],
                    [ "backward", "-" ],
                ]
            },
            {
                "type": "input_value",
                "check": "Number",
                "name": "VALUE"
            },
        ],
        nextStatement: null,
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const MENU = block.getFieldValue('MENU')
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC);
        const code = `const target = util.target;\nconst layerOrder = target.getLayerOrder();\nconst newLayer = ((${VALUE} * ${MENU}1) + layerOrder) - layerOrder;\ntarget.renderer.setDrawableOrder(target.drawableID, newLayer, "sprite", true);`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}getlayer`, {
        message0: 'get layer',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        return [`util.target.getLayerOrder()`, javascriptGenerator.ORDER_ATOMIC];
    })

    registerBlock(`${categoryPrefix}getlayerof`, {
        message0: 'get layer of %1',
        args0: [
            {
                "type": "input_value",
                "name": "SPRITE",
                "check": "Sprite"
            },
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const SPRITE = javascriptGenerator.valueToCode(block, 'SPRITE', javascriptGenerator.ORDER_ATOMIC);
        return [`(${SPRITE || "undefined"} !== undefined ? ${SPRITE}.getLayerOrder() : 0)`, javascriptGenerator.ORDER_ATOMIC];
    })
}

export default register