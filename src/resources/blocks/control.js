import { compileVars } from '../compiler/compileVarSection';
import javascriptGenerator from '../javascriptGenerator';
import registerBlock from '../register';
import Blockly from 'blockly/core';

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
    registerBlock(`${categoryPrefix}if`, {
        message0: 'if %1 then %2 %3',
        args0: [
            {
                "type": "input_value",
                "name": "BOOL0",
                "check": "Boolean"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS0"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
        mutator: `${categoryPrefix}if_mutator`
    }, (block) => {
        const BOOL0 = javascriptGenerator.valueToCode(block, 'BOOL0', javascriptGenerator.ORDER_ATOMIC) || "false";
        const BLOCKS0 = javascriptGenerator.statementToCode(block, 'BLOCKS0');

        let code = `if (${BOOL0}) { ${BLOCKS0} }`;

        for (let i = 1; block.getInput(`BOOL${i}`); i++) {
            const BOOLx = javascriptGenerator.valueToCode(block, `BOOL${i}`, javascriptGenerator.ORDER_ATOMIC) || "false";
            const BLOCKSx = javascriptGenerator.statementToCode(block, `BLOCKS${i}`);

            code += ` else if (${BOOLx}) { ${BLOCKSx} }`;
        }

        if (block.getInput('ELSE')) {
            const ELSE = javascriptGenerator.statementToCode(block, 'ELSE');
            code += ` else { ${ELSE} }`;
        }

        code += ";"
        return `${code}\n`;
    })
    registerBlock(`${categoryPrefix}if_mutator_if`, {
        message0: 'if',
        args0: [],
        nextStatement: null,
        inputsInline: true,
        enableContextMenu: false,
        colour: categoryColor,
    }, (block) => {})
    registerBlock(`${categoryPrefix}if_mutator_elseif`, {
        message0: 'else if',
        args0: [],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {})
    registerBlock(`${categoryPrefix}if_mutator_else`, {
        message0: 'else',
        args0: [],
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {})

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

    registerBlock(`${categoryPrefix}try_catch2`, {
        message0: 'try %1 %2 catch %3 %4',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "TRY_BLOCKS"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "CATCH_BLOCKS"
            },
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
        mutator: `${categoryPrefix}try_catch_mutator`,
        errorVarName_: compileVars.new(),
        getVars: function() {
            return [this.errorVarName_];
        },
    }, (block) => {
        const BLOCKS = javascriptGenerator.statementToCode(block, 'TRY_BLOCKS');
        const BLOCKS2 = javascriptGenerator.statementToCode(block, 'CATCH_BLOCKS');

        let errorArgs = [];
        for (let i = 0; ; i++) {
            const inputName = 'ERROR_REPORTER' + i;
            if (!block.getInput(inputName)) break;
            const val = javascriptGenerator.valueToCode(block, inputName, javascriptGenerator.ORDER_ATOMIC) || "'error'";
            errorArgs.push(val);
        }

        // const errorReportersCode = errorArgs.join(', ');

        const code = `try {\n${BLOCKS}} catch (${block.getVars()[0]}) {\n${BLOCKS2}}\n`;

        return code;
    });

    registerBlock(`${categoryPrefix}error_reporter`, {
        message0: 'error',
        args0: [],
        output: "String",
        colour: categoryColor,
    }, (block) => {
        let parent = block.getSurroundParent();
        while (parent && parent.type !== `${categoryPrefix}try_catch2`) {
            parent = parent.getSurroundParent();
        }

        const errorVar = (parent && parent.getVars()[0]) || "err";

        return [errorVar, javascriptGenerator.ORDER_ATOMIC];
    });

    const control_if_mutator = {
        elseifCount_: 0,
        elseCount_: 0,

        mutationToDom: function () {
            if (!this.elseifCount_ && !this.elseCount_) {
                return null;
            }

            const container = Blockly.utils.xml.createElement('mutation');
            if (this.elseifCount_) {
              container.setAttribute('elseif', String(this.elseifCount_));
            }
            if (this.elseCount_) {
              container.setAttribute('else', '1');
            }
            return container;
        },

        domToMutation: function (xmlElement) {
            this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'));
            this.elseCount_ = parseInt(xmlElement.getAttribute('else'));
            this.rebuildShape_()
        },

        decompose: function (workspace) {
            const containerBlock = workspace.newBlock(`${categoryPrefix}if_mutator_if`);
            containerBlock.initSvg();
            let connection = containerBlock.nextConnection;

            for (let i = 1; i <= this.elseifCount_; i++) {
                const elseifBlock = workspace.newBlock(`${categoryPrefix}if_mutator_elseif`);
                elseifBlock.initSvg()
                connection.connect(elseifBlock.previousConnection);
                connection = elseifBlock.nextConnection;
            }

            if (this.elseCount_) {
                const elseBlock = workspace.newBlock(`${categoryPrefix}if_mutator_else`);
                elseBlock.initSvg()
                connection.connect(elseBlock.previousConnection);
            }

            return containerBlock
        },

        compose: function (containerBlock) {
            let clauseBlock = containerBlock.nextConnection.targetBlock();

            this.elseifCount_ = 0;
            this.elseCount_ = 0;

            const valueConnections = [null]
            const statementConnections = [null]
            let elseStatementConnection = null

            while (clauseBlock) {
                if (clauseBlock.isInsertionMarker()) {
                    clauseBlock = clauseBlock.getNextBlock()
                    continue;
                }

                switch (clauseBlock.type) {
                    case `${categoryPrefix}if_mutator_elseif`:
                        this.elseifCount_++;
                        valueConnections.push(clauseBlock.valueConnection_);
                        statementConnections.push(clauseBlock.statementConnection_);
                        break;
                    case `${categoryPrefix}if_mutator_else`:
                        this.elseCount_++;
                        elseStatementConnection = clauseBlock.statementConnection_;
                        break;
                }

                clauseBlock = clauseBlock.getNextBlock();
            }

            this.updateShape_()

            this.reconnectChildBlocks_(valueConnections, statementConnections, elseStatementConnection)
        },

        saveConnections: function (containerBlock) {
            let clauseBlock = containerBlock.nextConnection.targetBlock();
            let i = 1;
            while (clauseBlock) {
                if (clauseBlock.isInsertionMarker()) {
                    clauseBlock = clauseBlock.getNextBlock()
                    continue;
                }

                switch (clauseBlock.type) {
                    case `${categoryPrefix}if_mutator_elseif`:
                        const inputBool = this.getInput(`BOOL${i}`);
                        const inputStatement = this.getInput(`BLOCKS${i}`);
                        clauseBlock.valueConnection_ = inputBool && inputBool.connection.targetConnection;
                        clauseBlock.statementConnection_ = inputStatement && inputStatement.connection.targetConnection;
                        i++;
                        break;
                    case `${categoryPrefix}if_mutator_else`:
                        const elseStatement = this.getInput('ELSE');
                        clauseBlock.statementConnection_ = elseStatement && elseStatement.connection.targetConnection;
                        break;
                }

                clauseBlock = clauseBlock.getNextBlock();
            }
        },

        rebuildShape_: function () {
            const valueConnections = [null]
            const statementConnections = [null]
            let elseStatementConnection = null

            if (this.getInput('ELSE')) {
                elseStatementConnection = this.getInput('ELSE').connection.targetConnection;
            }

            for (let i = 1; this.getInput(`BOOL${i}`); i++) {
                valueConnections.push(this.getInput(`BOOL${i}`).connection.targetConnection);
                statementConnections.push(this.getInput(`BLOCKS${i}`).connection.targetConnection);
            }

            this.updateShape_()
            this.reconnectChildBlocks_(
                valueConnections,
                statementConnections,
                elseStatementConnection,
            );
        },

        updateShape_: function () {
            //remove all
            if (this.getInput('ELSE')) {
                this.removeInput('ELSE')
                this.removeInput('DUMMYELSE')
            }
            for (let i = 1; this.getInput(`BOOL${i}`); i++) {
                this.removeInput(`BOOL${i}`)
                this.removeInput(`BLOCKS${i}`)
                this.removeInput(`DUMMY${i}`)
            }

            //rebuild
            for (let i = 1; i <= this.elseifCount_; i++) {
                this.appendValueInput(`BOOL${i}`)
                    .setCheck('Boolean')
                    .appendField("else if")
                this.appendDummyInput(`DUMMY${i}`)
                    .appendField("then")
                this.appendStatementInput(`BLOCKS${i}`)
            }
            if (this.elseCount_) {
                this.appendDummyInput('DUMMYELSE')
                    .appendField("else")
                this.appendStatementInput('ELSE')
            }
        },
        reconnectChildBlocks_: function (
            valueConnections,
            statementConnections,
            elseStatementConnection,
        ) {
            for (let i = 1; i <= this.elseifCount_; i++) {
                Blockly.Mutator.reconnect(valueConnections[i], this, `BOOL${i}`)
                Blockly.Mutator.reconnect(statementConnections[i], this, `BLOCKS${i}`)
            }
            if (elseStatementConnection) {
                Blockly.Mutator.reconnect(elseStatementConnection, this, `ELSE`)
            }
        }
    }

    Blockly.Extensions.unregister(`${categoryPrefix}if_mutator`)
    Blockly.Extensions.registerMutator(
        `${categoryPrefix}if_mutator`,
        control_if_mutator,
        null,
        [`${categoryPrefix}if_mutator_elseif`, `${categoryPrefix}if_mutator_else`],
    );

    const control_try_catch_mutator = {
        errorReporterCount_: 0,

        mutationToDom: function() {
            const container = document.createElement('mutation');
            container.setAttribute('error_reporter_count', this.errorReporterCount_);
            return container;
        },

        domToMutation: function(xmlElement) {
            this.errorReporterCount_ = parseInt(xmlElement.getAttribute('error_reporter_count'), 10) || 0;
            this.updateErrorReporters_();
        },

        updateErrorReporters_: function() {
            let i = 0;
            while (this.getInput('ERROR_REPORTER' + i)) {
                this.removeInput('ERROR_REPORTER' + i);
                i++;
            }

            for (let j = 0; j <= this.errorReporterCount_; j++) {
            const inputName = 'ERROR_REPORTER' + j;
            this.appendValueInput(inputName)
                .setCheck('String')
                .appendField('error')
                .setAlign(Blockly.ALIGN_RIGHT);
            }
        },

        addReporter: function() {
            this.errorReporterCount_++;
            this.updateErrorReporters_();
        },
    };

    Blockly.Extensions.unregister(`${categoryPrefix}try_catch_mutator`);
    Blockly.Extensions.registerMutator(
        `${categoryPrefix}try_catch_mutator`,
        control_try_catch_mutator,
        null,
        []
    );
}

export default register;
