import registerMath from './math'
import registerText from './text'
import registerColor from './color'
import registerAny from './any'

export default function() {
    registerMath()
    registerText()
    registerColor()
    registerAny()
}