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
}

export default register