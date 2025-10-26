import { compileVars } from '../compiler/compileVarSection';
import javascriptGenerator from '../javascriptGenerator';
import registerBlock from '../register';
import Blockly from 'blockly/core';

const categoryPrefix = 'targets_';
const categoryColor = '#8a8a8a';

function register() {
    // This needs init so i don't use registerBlock
    Blockly.Blocks[`${categoryPrefix}forEach`] = {
        init: function () {
            this.jsonInit({
                message0: 'for each %1 of %2 %3 %4',
                args0: [
                    {
                        "type": "input_value",
                        "name": "TARGET",
                        "check": "Target_Sprite"
                    },
                    {
                        "type": "input_value",
                        "name": "TARGETS",
                        "check": "Targets"
                    },
                    {
                        "type": "input_dummy"
                    },
                    {
                        "type": "input_statement",
                        "name": "BLOCKS"
                    },
                ],
                previousStatement: null,
                nextStatement: null,
                inputsInline: true,
                colour: categoryColor
            })

            this.getVars = () => [compileVars.new()];

            this.ensureTargetReporter = () => {
                const targetInput = this.getInput('TARGET');
                if (!targetInput.connection.targetBlock()) {
                    const reporter = this.workspace.newBlock(`${categoryPrefix}forEach_target`);
                    reporter.initSvg();
                    reporter.render();

                    targetInput.connection.connect(reporter.outputConnection);
                }
            }

            setTimeout(() => {
                this.ensureTargetReporter();
            }, 1);

            this._workspaceChangeEvent = async (event) => {
                if (event.type === Blockly.Events.BLOCK_MOVE || event.type === Blockly.Events.BLOCK_DELETE) {
                    while (this.workspace && this.rendered && !this.isDisposed_ && (!this.getInput('TARGET') || !this.getInput('TARGET').connection)) {
                        await new Promise(resolve => setTimeout(resolve, 10))
                    }
                    const targetInput = this.getInput('TARGET');
                    if (!targetInput.connection.targetBlock()) {
                        this.ensureTargetReporter();
                    }
                }
                if (event.type === Blockly.Events.BLOCK_MOVE && event.newParentId === this.id && event.inputName === 'TARGET') {
                    while (this.workspace && this.rendered && !this.isDisposed_ && (!this.getInput('TARGET') || !this.getInput('TARGET').connection)) {
                        await new Promise(resolve => setTimeout(resolve, 10))
                    }
                    const connectedBlock = this.getInput('TARGET').connection.targetBlock();
                    if (connectedBlock && connectedBlock.type !== `${categoryPrefix}forEach_target`) {
                        connectedBlock.unplug();
                    }
                }
            }

            this.workspace.addChangeListener(this._workspaceChangeEvent);
        },
        dispose: function (healStack) {
            if (this._workspaceChangeEvent) {
                this.workspace.removeChangeListener(this._workspaceChangeEvent);
                this._workspaceChangeEvent = null;
            }
            const targetInput = this.getInput('TARGET');
            if (targetInput && targetInput.connection.targetBlock()) {
                targetInput.connection.targetBlock().dispose(healStack);
                Blockly.BlockSvg.prototype.dispose.call(this, targetInput);
                if (targetInput.connection?.shadowDom) {
                    const shadowBlock = targetInput.connection.targetBlock();
                    if (shadowBlock) {
                        shadowBlock.dispose(healStack);
                    }
                }
            }
            try {
                Blockly.BlockSvg.prototype.dispose.call(this, targetInput);
                this.removeInput('TARGET', true);
                this.workspace.resize();
                this.workspace.render();
            } catch {
                // do nothing
            }
            Blockly.BlockSvg.prototype.dispose.call(this, healStack);
            this.workspace.resize();
            this.workspace.render();
        }
    }
    javascriptGenerator.forBlock[`${categoryPrefix}forEach`] = function (block) {
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const TARGETS = javascriptGenerator.valueToCode(block, 'TARGETS', javascriptGenerator.ORDER_ATOMIC);
        const targetVar = block.getVars()[0];

        const code = `for (const ${targetVar} of ${TARGETS}) { ${BLOCKS} }`;
        return code;
    }

    registerBlock(`${categoryPrefix}forEach_target`, {
        message0: 'target',
        args0: [],
        output: ["Sprite", "Target_Sprite"],
        colour: categoryColor,
    }, (block) => {
        let parent = block.getSurroundParent();
        while (parent && parent.type !== `${categoryPrefix}forEach`) {
            parent = parent.getSurroundParent();
        }

        const errorVar = (parent && parent.getVars()[0]) || "Scratch.vm.editingTarget";

        return [errorVar, javascriptGenerator.ORDER_ATOMIC];
    });

    registerBlock(`${categoryPrefix}currentTarget`, {
        message0: 'currently selected target',
        output: ["Sprite"],
        colour: categoryColor,
    }, (block) => {
        return ["Scratch.vm.editingTarget", javascriptGenerator.ORDER_ATOMIC];
    });

    registerBlock(`${categoryPrefix}targets`, {
        message0: 'targets',
        output: ["Targets"],
        colour: categoryColor,
    }, (block) => {
        return ["Scratch.vm.runtime.targets", javascriptGenerator.ORDER_ATOMIC];
    });
}   

export default register;