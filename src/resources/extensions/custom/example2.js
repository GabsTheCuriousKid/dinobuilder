(function (dinoBuilder) {
    class Extension { // In this case it's okay to rename the class
        getInfo() {
            return {
                "name": "Example", // The Name of the Extension
                "id": "ExampleID", // The Id of the Extension
                "colour": "#0FBD8C", // The Colour/Color of the blocks
                "blocks": [
                    {
                        "opcode": "block", // The Id of the block
                        "text": "example block", // The Text of the block
                        "type": dinoBuilder.BlockType.BLOCK, // This determines the type of the block (e.x.: "Block" is the regular command block)
                        "returns": (block, javascriptGenerator) => { // This determines what the code returns
                            return `console.log("Hello World!")`;
                        }
                    },
                    {
                        "opcode": "reporter",
                        "text": "example reporter",
                        "type": dinoBuilder.BlockType.REPORTER, // "Reporter" is the rounded block you can put in inputs
                        "output": "number", // This determines which inputs you can put the reporter in (e.x.: "number" lets you put the reporter in number inputs, but "none" or null lets you put the reporter block in every input)
                        "returns": (block, javascriptGenerator) => {
                            return [`1234`, javascriptGenerator.ORDER_ATOMIC]; // Reporter and boolean blocks use a different method of returning the code
                        }
                    },
                    {
                        "opcode": "boolean", // "Boolean" is the condition block you can put in boolean inputs
                        "text": "example boolean",
                        "type": dinoBuilder.BlockType.BOOLEAN,
                        "returns": (block, javascriptGenerator) => {
                            return [`Boolean(Math.round(Math.random()))`, javascriptGenerator.ORDER_ATOMIC];
                        }
                    },
                    {
                        "type": dinoBuilder.BlockType.GAP, // "Gap" is a gap
                        "gap": "48" // this determines how big the gap is
                    },
                    {
                        "opcode": "block2",
                        "text": "example inputs [arg1] [arg2] [arg3] [arg4]",
                        "type": dinoBuilder.BlockType.BLOCK,
                        "arguments": { // This defines the arguments
                            "arg1": {
                                "type": dinoBuilder.ArgumentType.EMPTY, // This determines the type of the input ("EMPTY" is the empty slot)
                                "check": "String" // This checks which type of reporter blocks are allowed to be put in the input. (e.x.: String allows string reporter blocks)
                            },
                            "arg2": {
                                "type": dinoBuilder.ArgumentType.STRING,
                                "acceptReporters": false // false means that this is a Field input. Field inputs don't have a check attribute and don't support putting blocks in them.
                            },
                            "arg3": {
                                "type": dinoBuilder.ArgumentType.COLOR,
                                "acceptReporters": true // true means that this is a input where reporter blocks are allowed to be put in there. Therefore, this can have a check attribute.
                            },
                            "arg4": {
                                "type": dinoBuilder.ArgumentType.BOOLEAN, // Booleans are the only inputs who don't have the acceptreporters nor the check attribute.
                            },
                        },
                        "returns": (block, javascriptGenerator) => {
                            const arg1 = javascriptGenerator.valueToCode(block, "arg1", javascriptGenerator.ORDER_ATOMIC);
                            const arg2 = block.getFieldValue("arg2");
                            const arg3 = block.getInputTargetBlock('arg3').getFieldValue("COLOR");
                            const arg4 = javascriptGenerator.valueToCode(block, "arg4", javascriptGenerator.ORDER_ATOMIC);
                            return `console.log(${arg1 ?? "'hello '"}, "${arg2 ?? " there"}", "${arg3 ?? "#ff00ff"}", ${arg4 ?? false})`;
                        }
                    },
                    {
                        "type": dinoBuilder.BlockType.LABEL, // "label" is a label
                        "text": "This is a label" // you can use this to determine what the label says
                    },
                    {
                        "opcode": "cap",
                        "text": "example cap",
                        "type": dinoBuilder.BlockType.BLOCK,
                        "isTerminal": true, // This determines whether the block is a cap block or not (true is yes, false is no)
                        "returns": (block, javascriptGenerator) => {
                            return `console.log("The End")`;
                        }
                    },
                    {
                        "opcode": "block3",
                        "text": "example hidden block",
                        "type": dinoBuilder.BlockType.BLOCK,
                        "hideFromPalette": true, // this determines whether the block will appear in the palette or not
                        "returns": (block, javascriptGenerator) => {
                            return `console.log("Hidden Block")`;
                        }
                    },
                ]
            }
        }
    }
    dinoBuilder.extensions.register(new Extension)
})(dinoBuilder)