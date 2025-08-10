import Blockly from 'blockly/core';

Blockly.Colours.textField = '#fff'

function register() {
    Blockly.Blocks['text'] = {
        /**
         * Block for text value.
         * @this Blockly.Block
         */
        init: function() {
            this.jsonInit({
                "message0": "%1",
                "args0": [
                    {
                        "type": "field_input",
                        "name": "TEXT"
                    }
                ],
                "output": "String",
                "colour": Blockly.Colours.textField,
                "colourSecondary": Blockly.Colours.textField,
                "colourTertiary": Blockly.Colours.textField
            });
        }
    };
}

export default register;
