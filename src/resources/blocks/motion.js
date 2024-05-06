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
        const code = `const target = util.target;\nreturn target.setXY(${X}, ${Y});`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}getx`, {
        message0: 'get x position of target',
        args0: [],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `const target = util.target;\nMath.round(target.x);`;
        return `${code}\n`;
    })
    registerBlock(`${categoryPrefix}gety`, {
        message0: 'get y position of target',
        args0: [],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `const target = util.target;\nMath.round(target.y);`;
        return `${code}\n`;
    })
}

export default register;