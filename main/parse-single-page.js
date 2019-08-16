import fs from 'fs';
import {PARTS_OF_SPEECH} from "../config";
import getSpanishPart from '../divisors/get-spanish-part';
import getByPartOfSpeech from '../divisors/get-by-part-of-speech';
import extractors from '../extractors/index';
import spanishDictApi from '../parts-of-speech/verb/spanish-dict-api';

export default async function (pagePath, options = {}) {
    const fileContents = await fs.readFileSync(pagePath, 'utf8');
    return parsePageText(fileContents, extractors, options);
}

// final page should look like:
// {
//     data: {
//         Verb: {
//             data: {
//                 lemma: {
//                     data: 'abajar',
//                     error: null,
//                 },
//                 tense: {
//                     data: {},
//                     error: `cannot get index '0' of undefined`,
//                 }
//             },
//             error: null,
//         },
//         Noun: {
//             data: {},
//             error: `Blah blah blah`
//         }
//     }
//     error: null,
// }
async function parsePageText(pageText, extractors, options) {
    let spanishPart;
    try {
        spanishPart = getSpanishPart(pageText);
    } catch (e) {
        throw new Error(`Problem getting Spanish part of page: ${e.message}`);
    }
    let byPartOfSpeech;
    try {
        byPartOfSpeech = getByPartOfSpeech(spanishPart, PARTS_OF_SPEECH);
    } catch (e) {
        throw new Error(`Problem dividing by part of speech: ${e.message}`);
    }
    const partsOfSpeechToParse = getPartsOfSpeechThatShouldParse(options);
    const data = partsOfSpeechToParse.reduce((acc, pos) => ({ ...acc, [pos]: { data: {}, error: null } }), {});
    for (const pos of partsOfSpeechToParse) {
        const extractorsToUse = extractors.filter(extractor => extractor.partsOfSpeech.includes(pos));
        try {
            data[pos].data = await handleSinglePartOfSpeech(pos, byPartOfSpeech[pos], extractorsToUse, options);
        } catch (e) {
            data[pos].error = e.message;
        }
    }
    return data;
}

async function handleSinglePartOfSpeech(partOfSpeech, textForPartOfSpeech, extractorsForPartOfSpeech, options = {}) {
    if (options.useSpanishDictMethod && partOfSpeech === 'Verb') {
        return spanishDictApi(textForPartOfSpeech, extractorsForPartOfSpeech);
    }

    const data = {};
    for (const extractor of extractorsForPartOfSpeech) {
        try {
            data[extractor.key] = await extractor.get(textForPartOfSpeech);
        } catch (e) {
            data[extractor.key] = e.message;
        }
    }
    return data;
}

function getPartsOfSpeechThatShouldParse(options = {}) {
    const partsOfSpeechInOptions = PARTS_OF_SPEECH.filter(pos => {
        for (const optionName of Object.keys(options)) {
            if (optionName.toLowerCase() === pos.toLowerCase()) {
                return true;
            }
        }
        return false;
    });
    return partsOfSpeechInOptions.length > 0 ? partsOfSpeechInOptions : PARTS_OF_SPEECH;
}