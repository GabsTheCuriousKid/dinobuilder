import javascriptGenerator from '../javascriptGenerator';
import registerBlock from '../register';

const categoryPrefix = 'functions_';
const categoryColor = '#5531D6';

function register() {
    // function
    registerBlock(`${categoryPrefix}create`, {
        message0: 'function %1 %2 %3',
        args0: [
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
                "type": "input_statement",
                "name": "FUNC"
            }
        ],
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const ID = block.getFieldValue('ID')
        const FUNC = javascriptGenerator.statementToCode(block, 'FUNC');
        
        const code = `async function ${ID}() { ${FUNC} }`;
        return `${code}\n`;
    })

    // inline function
    registerBlock(`${categoryPrefix}inline`, {
        message0: 'inline function %1 %2',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "FUNC"
            }
        ],
        output: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const FUNC = javascriptGenerator.statementToCode(block, 'FUNC');
        return [`await (async () => { ${FUNC} })()`, javascriptGenerator.ORDER_ATOMIC];
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

    // call
    registerBlock(`${categoryPrefix}call`, {
        message0: 'call %1',
        args0: [
            {
                "type": "field_input",
                "name": "ID",
                "text": "id",
                "spellcheck": false
            },
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const ID = block.getFieldValue('ID')
        const code = `${ID}()`;
        return `${code}\n`;
    })

    // call
    registerBlock(`${categoryPrefix}callreporter`, {
        message0: 'call %1',
        args0: [
            {
                "type": "field_input",
                "name": "ID",
                "text": "id",
                "spellcheck": false
            },
        ],
        output: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const ID = block.getFieldValue('ID')
        return [`${ID}()\n`, javascriptGenerator.ORDER_ATOMIC];
    })

    registerBlock(`${categoryPrefix}getsprites`, {
        message0: 'get Sprites function',
        args0: [],
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const code = `getSprites() {
            const spriteNames = [];
            const targets = Scratch.vm.runtime.targets;
            const myself = Scratch.vm.runtime.getEditingTarget().getName();
            for (let index = 1; index < targets.length; index++) {
              const target = targets[index];
              if (target.isOriginal) {
                const targetName = target.getName();
                if (targetName === myself) {
                  spriteNames.unshift({
                    text: "this sprite",
                    value: targetName,
                  });
                } else {
                  spriteNames.push({
                    text: targetName,
                    value: targetName,
                  });
                }
              }
            }
            if (spriteNames.length > 0) {
              return spriteNames;
            } else {
              return [{ text: "", value: 0 }];
            }
          }`;
        return `${code}\n`;
    })
}
export default register;
