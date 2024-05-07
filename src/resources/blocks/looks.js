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
                "type": "field_input",
                "name": "TEXT",
                "text": "Hello, World",
                "spellcheck": false
            },
        ],
        nextStatement: null,
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TEXT = block.getFieldValue('TEXT');
        return [`Scratch.vm.runtime.emit('SAY', util.target, 'say', ${TEXT});`, javascriptGenerator.ORDER_ATOMIC];
    })

    // say
    registerBlock(`${categoryPrefix}think`, {
        message0: 'think %1',
        args0: [
            {
                "type": "field_input",
                "name": "TEXT",
                "text": "Hello, World",
                "spellcheck": false
            },
        ],
        nextStatement: null,
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TEXT = block.getFieldValue('TEXT');
        return [`Scratch.vm.runtime.emit('SAY', util.target, 'say', ${TEXT});`, javascriptGenerator.ORDER_ATOMIC];
    })
}

export default register