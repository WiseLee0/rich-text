import PlayRegularURL from "../../assets/Play-Regular.ttf?url";
import AnonymousProRegularURL from "../../assets/Anonymous_Pro/AnonymousPro-Regular.ttf?url";
import AnonymousProBoldURL from "../../assets/Anonymous_Pro/AnonymousPro-Bold.ttf?url";
import AnonymousProItalicURL from "../../assets/Anonymous_Pro/AnonymousPro-Italic.ttf?url";
import OpenSansVariableFontURL from "../../assets/OpenSans/OpenSans-VariableFont_wdth,wght.ttf?url";

const familyList = ['Play', 'Anonymous Pro', 'Open Sans']
const styleList = {
    'Play': ['Regular'],
    'Anonymous Pro': ['Regular', 'Bold', 'Italic'],
    'Open Sans': ['Light', 'Regular', 'SemiBold', 'Bold', 'ExtraBold', 'Condensed Light', 'Condensed Regular', 'Condensed SemiBold', 'Condensed Bold', 'Condensed ExtraBold']
} as Record<string, string[]>
const postscriptList = {
    'Play#Regular': 'Play',
    'Anonymous Pro#Regular': 'AnonymousPro-Regular',
    'Anonymous Pro#Bold': 'AnonymousPro-Bold',
    'Anonymous Pro#Italic': 'AnonymousPro-Italic',
    'Open Sans#Light': 'OpenSans-Light',
    'Open Sans#Regular': 'OpenSans-Regular',
    'Open Sans#SemiBold': 'OpenSans-SemiBold',
    'Open Sans#Bold': 'OpenSans-Bold',
    'Open Sans#ExtraBold': 'OpenSans-ExtraBold',
    'Open Sans#Condensed Light': 'OpenSans-CondensedLight',
    'Open Sans#Condensed Regular': 'OpenSans-CondensedRegular',
    'Open Sans#Condensed SemiBold': 'OpenSans-CondensedSemiBold',
    'Open Sans#Condensed Bold': 'OpenSans-CondensedBold',
    'Open Sans#Condensed ExtraBold': 'OpenSans-CondensedExtraBold',
} as Record<string, string>
const variationAxesList = {
    'Open Sans#Light': [
        {
            "tag": "wght",
            "name": "Weight",
            "value": 300.0,
            "min": 300.0,
            "max": 800.0,
            "default": 400.0,
            "hidden": false
        },
        {
            "tag": "wdth",
            "name": "Width",
            "value": 100.0,
            "min": 75.0,
            "max": 100.0,
            "default": 100.0,
            "hidden": false
        }
    ],
    'Open Sans#Regular': [
        {
            "tag": "wght",
            "name": "Weight",
            "value": 400.0,
            "min": 300.0,
            "max": 800.0,
            "default": 400.0,
            "hidden": false
        },
        {
            "tag": "wdth",
            "name": "Width",
            "value": 100.0,
            "min": 75.0,
            "max": 100.0,
            "default": 100.0,
            "hidden": false
        }
    ],
    'Open Sans#SemiBold': [
        {
            "tag": "wght",
            "name": "Weight",
            "value": 600.0,
            "min": 300.0,
            "max": 800.0,
            "default": 400.0,
            "hidden": false
        },
        {
            "tag": "wdth",
            "name": "Width",
            "value": 100.0,
            "min": 75.0,
            "max": 100.0,
            "default": 100.0,
            "hidden": false
        }
    ],
    'Open Sans#Bold': [
        {
            "tag": "wght",
            "name": "Weight",
            "value": 700.0,
            "min": 300.0,
            "max": 800.0,
            "default": 400.0,
            "hidden": false
        },
        {
            "tag": "wdth",
            "name": "Width",
            "value": 100.0,
            "min": 75.0,
            "max": 100.0,
            "default": 100.0,
            "hidden": false
        }
    ],
    'Open Sans#ExtraBold': [
        {
            "tag": "wght",
            "name": "Weight",
            "value": 800.0,
            "min": 300.0,
            "max": 800.0,
            "default": 400.0,
            "hidden": false
        },
        {
            "tag": "wdth",
            "name": "Width",
            "value": 100.0,
            "min": 75.0,
            "max": 100.0,
            "default": 100.0,
            "hidden": false
        }
    ],
    'Open Sans#Condensed Light': [
        {
            "tag": "wght",
            "name": "Weight",
            "value": 300.0,
            "min": 300.0,
            "max": 800.0,
            "default": 400.0,
            "hidden": false
        },
        {
            "tag": "wdth",
            "name": "Width",
            "value": 75.0,
            "min": 75.0,
            "max": 100.0,
            "default": 100.0,
            "hidden": false
        }
    ],
    'Open Sans#Condensed Regular': [
        {
            "tag": "wght",
            "name": "Weight",
            "value": 400.0,
            "min": 300.0,
            "max": 800.0,
            "default": 400.0,
            "hidden": false
        },
        {
            "tag": "wdth",
            "name": "Width",
            "value": 75.0,
            "min": 75.0,
            "max": 100.0,
            "default": 100.0,
            "hidden": false
        }
    ],
    'Open Sans#Condensed SemiBold': [
        {
            "tag": "wght",
            "name": "Weight",
            "value": 600.0,
            "min": 300.0,
            "max": 800.0,
            "default": 400.0,
            "hidden": false
        },
        {
            "tag": "wdth",
            "name": "Width",
            "value": 75.0,
            "min": 75.0,
            "max": 100.0,
            "default": 100.0,
            "hidden": false
        }
    ],
    'Open Sans#Condensed Bold': [
        {
            "tag": "wght",
            "name": "Weight",
            "value": 700.0,
            "min": 300.0,
            "max": 800.0,
            "default": 400.0,
            "hidden": false
        },
        {
            "tag": "wdth",
            "name": "Width",
            "value": 75.0,
            "min": 75.0,
            "max": 100.0,
            "default": 100.0,
            "hidden": false
        }
    ],
    'Open Sans#Condensed ExtraBold': [
        {
            "tag": "wght",
            "name": "Weight",
            "value": 800.0,
            "min": 300.0,
            "max": 800.0,
            "default": 400.0,
            "hidden": false
        },
        {
            "tag": "wdth",
            "name": "Width",
            "value": 75.0,
            "min": 75.0,
            "max": 100.0,
            "default": 100.0,
            "hidden": false
        }
    ],
} as Record<string, {
    "tag": string,
    "name": string,
    "value": number,
    "min": number,
    "max": number,
    "default": number,
    "hidden": false
}[]>

const assetList = {
    'Play#Regular': PlayRegularURL,
    'Anonymous Pro#Regular': AnonymousProRegularURL,
    'Anonymous Pro#Bold': AnonymousProBoldURL,
    'Anonymous Pro#Italic': AnonymousProItalicURL,
    'Open Sans#Light': OpenSansVariableFontURL,
    'Open Sans#Regular': OpenSansVariableFontURL,
    'Open Sans#SemiBold': OpenSansVariableFontURL,
    'Open Sans#Bold': OpenSansVariableFontURL,
} as Record<string, string>

export const fontListData = {
    familyList,
    styleList,
    postscriptList,
    variationAxesList,
    assetList
}