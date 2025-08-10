import * as Blockly from 'blockly';

import registerMath from './math'
import registerText from './text'

export default function() {
    console.log(Blockly.Colours)
    registerMath()
    registerText()
}