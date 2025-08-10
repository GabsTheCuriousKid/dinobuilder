import Blockly from 'blockly/core';
import 'blockly/core/colours';

import registerMath from './math'
import registerText from './text'

export default function() {
    console.log(Blockly.Colours)
    registerMath()
    registerText()
}