import { compileVars } from '../compiler/compileVarSection';
import javascriptGenerator from '../javascriptGenerator';
import registerBlock from '../register';

const categoryPrefix = 'control_';
const categoryColor = '#FFAB19';

function register() {
    // wait in milliseconds
    registerBlock(`${categoryPrefix}wait`, {
        message0: 'wait %1 (ms)',
        args0: [
            {
                "type": "input_value",
                "name": "MS",
                "check": "Number"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const MS = javascriptGenerator.valueToCode(block, 'MS', javascriptGenerator.ORDER_ATOMIC);
        const code = `await new Promise(resolve => setTimeout(resolve, ${MS}))`;
        return `${code}\n`;
    })

    // wait until
    registerBlock(`${categoryPrefix}waituntil`, {
        message0: 'wait until %1',
        args0: [
            {
                "type": "input_value",
                "name": "CONDITION",
                "check": "Boolean"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const CONDITION = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_ATOMIC);
        const code = `await new Promise(resolve => { let x = setInterval(() => { if (${CONDITION}) { clearInterval(x); resolve() } }, 50) })`;
        return `${code}\n`;
    })

    // repeat x amount of times
    registerBlock(`${categoryPrefix}repeat`, {
        message0: 'repeat %1 %2 %3 %4',
        implicitAlign0: "RIGHT",
        args0: [
            {
                "type": "input_value",
                "name": "TIMES",
                "check": "Number"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            },
            {
                "type": "field_image",
                "src": "/images/blockIcons/repeat.svg",
                "width": 24,
                "height": 24,
                "alt": "*"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TIMES = javascriptGenerator.valueToCode(block, 'TIMES', javascriptGenerator.ORDER_ATOMIC);
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const variable = compileVars.new()
        const code = `for (var ${variable} = 0; ${variable} < ${TIMES}; ${variable}++) { ${BLOCKS} }`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}forever`, {
        message0: 'forever %1 %2 %3',
        implicitAlign0: "RIGHT",
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            },
            {
                "type": "field_image",
                "src": "/images/blockIcons/repeat.svg",
                "width": 24,
                "height": 24,
                "alt": "*"
            }
        ],
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `while (true) {${BLOCKS}}`;
        return `${code}\n`;
    })

    // if <> then {}
    registerBlock(`${categoryPrefix}ifthen`, {
        message0: 'if %1 then %2 %3',
        args0: [
            {
                "type": "input_value",
                "name": "CONDITION",
                "check": "Boolean"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const CONDITION = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_ATOMIC);
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `if (${CONDITION ? `Boolean(${CONDITION})` : 'false'}) { ${BLOCKS} };`;
        return `${code}\n`;
    })

    // if <> then {} else {}
    registerBlock(`${categoryPrefix}ifthenelse`, {
        message0: 'if %1 then %2 %3 else %4 %5',
        args0: [
            {
                "type": "input_value",
                "name": "CONDITION",
                "check": "Boolean"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS2"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const CONDITION = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_ATOMIC);
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const BLOCKS2 = javascriptGenerator.statementToCode(block, 'BLOCKS2');
        const code = `if (${CONDITION ? `Boolean(${CONDITION})` : 'false'}) {
            ${BLOCKS}
        } else {
            ${BLOCKS2}
        };`;
        return `${code}\n`;
    })

    // if <> then () else ()
    registerBlock(`${categoryPrefix}ifthenreturn`, {
        message0: 'if %1 then %2 else %3',
        args0: [
            {
                "type": "input_value",
                "name": "CONDITION",
                "check": "Boolean"
            },
            {
                "type": "input_value",
                "name": "X",
            },
            {
                "type": "input_value",
                "name": "Y",
            },
        ],
        output: null,
        inputsInline: false,
        colour: categoryColor
    }, (block) => {
        const CONDITION = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_ATOMIC);
        const X = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC);
        const Y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC);
        return [`(${CONDITION || false} ? ${X} : ${Y})`, javascriptGenerator.ORDER_ATOMIC];
    })

    // switch statement
    registerBlock(`${categoryPrefix}switch`, {
        message0: 'switch %1 %2 %3',
        args0: [
            {
                "type": "input_value",
                "name": "VALUE"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS",
                "check": "Case"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC);
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `switch (${VALUE || "''"}) { ${BLOCKS} };`;
        return `${code}\n`;
    })

    // case
    registerBlock(`${categoryPrefix}case`, {
        message0: 'case %1 %2 %3',
        args0: [
            {
                "type": "input_value",
                "name": "VALUE"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        previousStatement: "Case",
        nextStatement: "Case",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC);
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `case (${VALUE || "''"}): ${BLOCKS}`;
        return `${code}\n`;
    })

    // default
    registerBlock(`${categoryPrefix}default`, {
        message0: 'default %1 %2',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        previousStatement: "Case",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `default: ${BLOCKS}`;
        return `${code}\n`;
    })

    // while statement
    registerBlock(`${categoryPrefix}while`, {
        message0: 'while %1 %2 %3',
        args0: [
            {
                "type": "input_value",
                "name": "CONDITION",
                "check": "Boolean"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS",
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const CONDITION = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_ATOMIC);
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `while (${CONDITION}) { ${BLOCKS} };`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}try_catch`, {
        message0: 'try %1 %2 catch %3 %4',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS2"
            },
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const BLOCKS2 = javascriptGenerator.statementToCode(block, 'BLOCKS2');
        const code = `try { ${BLOCKS} }\ncatch (err) { ${BLOCKS2} }`;
        return `${code}\n`;
    })

    // break
    registerBlock(`${categoryPrefix}break`, {
        message0: 'break',
        args0: [],
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `break;`;
        return `${code}\n`;
    })
    registerBlock(`${categoryPrefix}throwerror`, {
        message0: 'throw error %1',
        args0: [
            {
                "type": "input_value",
                "name": "VALUE",
                "check": "String"
            },
        ],
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC);
        const code = `throw new Error(${VALUE});`;
        return `${code}\n`;
    })
    registerBlock(`${categoryPrefix}error`, {
        message0: 'error',
        args0: [],
        output: "String",
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        return [`err`, javascriptGenerator.ORDER_ATOMIC];
    })
}

export default register;
