import fs from 'fs';
import {PARTS_OF_SPEECH} from "../config";
import getSpanishPart from '../divisors/get-spanish-part';
import getByPartOfSpeech from '../divisors/get-by-part-of-speech';
import extractors from '../extractors/index';
import { generateData } from '../data-structure-handling';

export default async function (word, pagePath, options = {}) {
    const fileContents = await fs.readFileSync(pagePath, 'utf8');
    return parsePageText(word, fileContents, extractors, options);
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
async function parsePageText(word, pageText, extractors, options) {
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
    const dataGetter = async partOfSpeech => {
        const extractorsToUse = extractors.filter(extractor => extractor.partsOfSpeech.includes(partOfSpeech));
        return handleSinglePartOfSpeech(word, partOfSpeech, byPartOfSpeech[partOfSpeech], extractorsToUse, options);
    };

    return generateData(
        getPartsOfSpeechThatShouldParse(options),
        partOfSpeech => partOfSpeech,
        dataGetter,
    );
}

async function handleSinglePartOfSpeech(word, partOfSpeech, textForPartOfSpeech, extractorsForPartOfSpeech, options = {}) {
    return generateData(
        extractorsForPartOfSpeech,
        extractor => extractor.key,
        async extractor => extractor.get(word, textForPartOfSpeech, options),
    );
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