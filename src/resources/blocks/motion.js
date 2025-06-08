import javascriptGenerator from '../javascriptGenerator';
import registerBlock from '../register';

const categoryPrefix = 'motion_';
const categoryColor = '#4C97FF';

function register() {
    registerBlock(`${categoryPrefix}goto_position`, {
        message0: 'go to x\: %1 y\: %2',
        args0: [
            {
                "type": "input_value",
                "name": "X",
                "check": "Number"
            },
            {
                "type": "input_value",
                "name": "Y",
                "check": "Number"
            },
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC);
        const Y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC);
        const code = `util.target.setXY(${X}, ${Y});`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}getx`, {
        message0: 'get x position',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        return [`Math.round(util.target.x)`, javascriptGenerator.ORDER_ATOMIC];
    })
    registerBlock(`${categoryPrefix}gety`, {
        message0: 'get y position',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        return [`Math.round(util.target.y)`, javascriptGenerator.ORDER_ATOMIC];
    })

    registerBlock(`${categoryPrefix}setdirection`, {
        message0: 'point in direction %1',
        args0: [
            {
                "type": "input_value",
                "name": "DIR",
                "check": "Number"
            },
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const DIR = javascriptGenerator.valueToCode(block, 'DIR', javascriptGenerator.ORDER_ATOMIC);
        const code = `util.target.setDirection(${DIR});`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}getdir`, {
        message0: 'get direction',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        return [`Math.round(util.target.direction)`, javascriptGenerator.ORDER_ATOMIC];
    })

    registerBlock(`${categoryPrefix}stage`, {
        message0: 'stage',
        args0: [],
        output: "Sprite",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        return [`Scratch.vm.runtime._stageTarget`, javascriptGenerator.ORDER_ATOMIC];
    })

    registerBlock(`${categoryPrefix}isstage`, {
        message0: 'is %1 stage',
        args0: [
            {
                "type": "input_value",
                "name": "SPRITE",
                "check": "Sprite"
            },
        ],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const SPRITE = javascriptGenerator.valueToCode(block, 'SPRITE', javascriptGenerator.ORDER_ATOMIC);
        return [`(${SPRITE || "undefined"} !== undefined ? ${SPRITE}.isStage : false)`, javascriptGenerator.ORDER_ATOMIC]
    })

    registerBlock(`${categoryPrefix}getsprite`, {
        message0: 'get sprite named %1',
        args0: [
            {
                "type": "input_value",
                "name": "SPRITE",
                "check": "String"
            },
        ],
        output: "Sprite",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const SPRITE = javascriptGenerator.valueToCode(block, 'SPRITE', javascriptGenerator.ORDER_ATOMIC);
        return [`Scratch.vm.runtime.getSpriteTargetByName(${SPRITE})`, javascriptGenerator.ORDER_ATOMIC];
    })

    registerBlock(`${categoryPrefix}getxof`, {
        message0: 'x of %1',
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
        return [`(${SPRITE || "undefined"} !== undefined ? ${SPRITE}.x : 0)`, javascriptGenerator.ORDER_ATOMIC]
    })

    registerBlock(`${categoryPrefix}getyof`, {
        message0: 'y of %1',
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
        return [`(${SPRITE || "undefined"} !== undefined ? ${SPRITE}.y : 0)`, javascriptGenerator.ORDER_ATOMIC]
    })

    registerBlock(`${categoryPrefix}getdirof`, {
        message0: 'direction of %1',
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
        return [`(${SPRITE || "undefined"} !== undefined ? ${SPRITE}.direction : 0)`, javascriptGenerator.ORDER_ATOMIC]
    })
}

export default register;