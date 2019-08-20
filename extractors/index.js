import VerbExtractors from './verb';
import getMeanings from './meanings';
import {getPartsOfSpeechValues} from "../utils/parts-of-speech";

const VERB = getPartsOfSpeechValues(['verb'])[0];
/**
 * The objects in the array below are "extractors".
 * Extractors should have:
 * - a 'key' property, a string that is what their data is stored under
 * - a 'get' property, a method used to get their data. 'get' should take
 *      and object with the following possible properties:
 *          - word: a string of the word itself
 *          - text: the text on the word's page specific to the part of speech
 *                  the get method is operating on
 *          - extracted: the object of the extracted data so far
 *          - options: a configurable object that may affect the method's operation
 * - a 'partsOfSpeech' property, an array of strings that are the parts of speech on which
 *     the extractor should operate
 */
export default [
    {
        key: 'meanings',
        partsOfSpeech: getPartsOfSpeechValues(),
        get: getMeanings,
    },
    // add partsOfSpeech verb to all the imported verb extractors
    ...VerbExtractors.map(extractor => ({ ...extractor, partsOfSpeech: [VERB] })),
];