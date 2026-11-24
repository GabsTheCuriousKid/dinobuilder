import hiddenblocksExtension from "../resources/extensions/hiddenblocks/hiddenblocks.xml?raw";
import webExtensionExtension from "../resources/extensions/webextension/webextension.xml?raw";
import effectsExtension from "../resources/extensions/effects/effects.xml?raw";
import javascriptExtension from "../resources/extensions/javascript/javascript.xml?raw";
import timersExtension from "../resources/extensions/dm_timers/timers.xml?raw";

const extensionItems = [
    {
        name: 'Hidden Blocks',
        id: 'hiddenblocksExt',
        xml: hiddenblocksExtension,
        img: {
            alt: 'HiddenBlocksPNG',
            src: 'images/extensionIcons/HiddenBlocksIcon.png'
        }
    },
    {
        name: 'Effects',
        id: 'effectsExt',
        xml: effectsExtension,
        img: {
            alt: 'EffectsPNG',
            src: 'images/extensionIcons/looks-expansion.png'
        }
    },
    {
        name: 'Timers (DinosaurMod Only)',
        id: 'hiddenblocksExt',
        xml: timersExtension,
        img: {
            alt: 'TimersExtensionPNG',
            src: 'images/extensionIcons/NoIcon.png'
        }
    },
    {
        name: 'Site Runtime',
        id: 'webextensionExt',
        xml: webExtensionExtension,
        img: {
            alt: 'WebExtensionPNG',
            src: 'images/extensionIcons/NoIcon.png'
        }
    },
    {
        name: 'Javascript',
        id: 'jsextensionExt',
        xml: javascriptExtension,
        img: {
            alt: 'JSExtensionPNG',
            src: 'images/extensionIcons/NoIcon.png'
        }
    },
]

export default extensionItems;