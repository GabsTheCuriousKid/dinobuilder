import Blockly from 'blockly/core';

function register() {
    Blockly.Blocks['math_number'] = {
        /**
         * Block for generic numeric value.
         * @this Blockly.Block
         */
        init: function() {
            this.jsonInit({
                "message0": "%1",
                "args0": [
                    {
                        "type": "field_number",
                        "name": "NUM",
                        "value": "0"
                    }
                ],
                "output": "Number",
                "colour": Blockly.Colours.textField,
                "colourSecondary": Blockly.Colours.textField,
                "colourTertiary": Blockly.Colours.textField
            });
        }
    };

    Blockly.Blocks['math_integer'] = {
        /**
         * Block for integer value (no decimal, + or -).
         * @this Blockly.Block
         */
        init: function() {
            this.jsonInit({
                "message0": "%1",
                "args0": [
                    {
                        "type": "field_number",
                        "name": "NUM",
                        "precision": 1
                    }
                ],
                "output": "Number",
                "colour": Blockly.Colours.textField,
                "colourSecondary": Blockly.Colours.textField,
                "colourTertiary": Blockly.Colours.textField
            });
        }
    };

    Blockly.Blocks['math_whole_number'] = {
    /**
     * Block for whole number value, no negatives or decimals.
     * @this Blockly.Block
     */
    init: function() {
        this.jsonInit({
            "message0": "%1",
            "args0": [
                {
                    "type": "field_number",
                    "name": "NUM",
                    "min": 0,
                    "precision": 1
                }
            ],
            "output": "Number",
            "colour": Blockly.Colours.textField,
            "colourSecondary": Blockly.Colours.textField,
            "colourTertiary": Blockly.Colours.textField
        });
    }
    };

    Blockly.Blocks['math_positive_number'] = {
        /**
         * Block for positive number value, with decimal.
         * @this Blockly.Block
         */
        init: function() {
            this.jsonInit({
                "message0": "%1",
                "args0": [
                    {
                        "type": "field_number",
                        "name": "NUM",
                        "min": 0
                    }
                ],
                "output": "Number",
                "colour": Blockly.Colours.textField,
                "colourSecondary": Blockly.Colours.textField,
                "colourTertiary": Blockly.Colours.textField
            });
        }
    };

    Blockly.Blocks['math_angle'] = {
        /**
         * Block for angle picker.
         * @this Blockly.Block
         */
        init: function() {
            this.jsonInit({
                "message0": "%1",
                "args0": [
                    {
                        "type": "field_angle",
                        "name": "NUM",
                        "value": 90
                    }
                ],
                "output": "Number",
                "colour": Blockly.Colours.textField,
                "colourSecondary": Blockly.Colours.textField,
                "colourTertiary": Blockly.Colours.textField
            });
        }
    };
}

export default register;
