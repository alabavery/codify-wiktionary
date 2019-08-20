import fs from 'fs';
import getSpanishPart from '../divisors/get-spanish-part';
import getTextByPartofSpeech from '../divisors/get-by-part-of-speech';
import extractors from '../extractors/index';
import {generateData} from '../data-structure-handling';

export default async function (word, pagePath, partsOfSpeechToParse, options = {}) {
    const fileContents = await fs.readFileSync(pagePath, 'utf8');
    return parsePageText(word, fileContents, partsOfSpeechToParse, extractors, options);
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
export async function parsePageText(word, pageText, partsOfSpeechToParse, extractors, options) {
    let spanishPart;
    try {
        spanishPart = getSpanishPart(pageText);
    } catch (e) {
        throw new Error(`Problem getting Spanish part of page: ${e.message}`);
    }
    let byPartOfSpeech;
    try {
        byPartOfSpeech = getTextByPartofSpeech(spanishPart, partsOfSpeechToParse);
    } catch (e) {
        throw new Error(`Problem dividing by part of speech: ${e.message}`);
    }
    const dataGetter = async (partOfSpeech, extractedSoFar) => {
        const extractorsToUse = extractors.filter(extractor => extractor.partsOfSpeech.includes(partOfSpeech));
        return handleSinglePartOfSpeech(
            word,
            partOfSpeech,
            byPartOfSpeech[partOfSpeech],
            extractorsToUse,
            extractedSoFar,
            options,
        );
    };

    return generateData(
        partsOfSpeechToParse,
        partOfSpeech => partOfSpeech,
        dataGetter,
    );
}

async function handleSinglePartOfSpeech(
    word,
    partOfSpeech,
    textForPartOfSpeech,
    extractorsForPartOfSpeech,
    extractedSoFar,
    options = {},
) {
    return generateData(
        extractorsForPartOfSpeech,
        extractor => extractor.key,
        async (extractor, extractedSoFar) => extractor.get({
            word,
            text: textForPartOfSpeech,
            extracted: extractedSoFar,
            options,
        }),
    );
}
