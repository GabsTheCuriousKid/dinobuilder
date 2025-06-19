class Extension {
    getInfo() {
        return {
            "name": "Example", // The Name of the Extension
            "id": "ExampleID", // The Id of the Extension
            "colour": "#0FBD8C", // The Colour/Color of the blocks
            "blocks": [
                {
                    "opcode": "block", // The Id of the block
                    "text": "example block", // The Text of the block
                    "type": "block", // This determines the type of the block (e.x.: "Block" is the regular command block)
                    "returns": (block, javascriptGenerator) => { // This determines what the code returns
                        return `console.log("Hello World!")`;
                    }
                },
                {
                    "opcode": "reporter",
                    "text": "example reporter",
                    "type": "reporter", // "Reporter" is the rounded block you can put in inputs
                    "output": "number", // This determines which inputs you can put the reporter in (e.x.: "number" lets you put the reporter in number inputs, but "none" or null lets you put the reporter block in every input)
                    "returns": (block, javascriptGenerator) => {
                        return [`1234`, javascriptGenerator.ORDER_ATOMIC]; // Reporter and boolean blocks use a different method of returning the code
                    }
                },
                {
                    "opcode": "boolean", // "Reporter" is the condition block you can put in boolean inputs
                    "text": "example boolean",
                    "type": "boolean",
                    "returns": (block, javascriptGenerator) => {
                        return [`Boolean(Math.round(Math.random()))`, javascriptGenerator.ORDER_ATOMIC];
                    }
                },
                {
                    "type": "gap", // "Gap" is a gap
                    "gap": "36" // this determines how big the gap is
                },
                {
                    "type": "label", // "label" is a label
                    "text": "This is a label" // you can use this to determine what the label says
                },
                {
                    "opcode": "cap",
                    "text": "example cap",
                    "type": "block",
                    "isTerminal": true, // This determines whether the block is a cap block or not (true is yes, false is no)
                    "returns": (block, javascriptGenerator) => {
                        return `console.log("The End")`;
                    }
                }
            ]
        }
    }
}