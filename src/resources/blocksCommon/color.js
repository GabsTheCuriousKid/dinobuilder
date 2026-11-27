import Blockly from 'blockly/core';

const textFieldColor = '#fff'

function register() {
    Blockly.Blocks['color'] = {
        /**
         * Block for text value.
         * @this Blockly.Block
         */
        init: function() {
            this.jsonInit({
                "message0": "%1",
                "args0": [
                    {
                        "type": "field_colour_hsv_sliders",
                        "name": "COLOR"
                    }
                ],
                "output": "Color",
                "colour": textFieldColor
            });
        }
    };
}

export default register;
