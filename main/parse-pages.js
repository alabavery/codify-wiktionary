import {getParamsFromCommandLine} from "../utils";
import {PARTS_OF_SPEECH} from "../config";
import { generateData } from '../data-structure-handling';
import parseSinglePage from './parse-single-page';

// if any part of speech is passed as an option, only those that are passed will be parsed
// e.g. babel-node index.js [page paths] --verb=true
const validOptions = {
    ...Object.keys(PARTS_OF_SPEECH).reduce((acc, pos) => ({...acc, [pos]: [true]}), {}),
    spanishDictMethod: [true],
};

if (require.main === module) {
    const {options, args} = getParamsFromCommandLine(validOptions);
    console.log(options);
    console.log(args);
    parsePages(args, options);
}

/**
 *
 * @param pagePaths
 * @param options
 * @returns {Promise<void>}
 */
export async function parsePages(pagePaths, options = {}) {
    const pathsByWord = pagePaths.reduce((acc, path) => {
        acc[getWordFromPagePath(path)] = path;
    }, {});
    console.log(pathsByWord);
    return generateData(
        Object.keys(pathsByWord),
        word => word,
        async word => parseSinglePage(word, pathsByWord[word], options),
    );
}

const getWordFromPagePath = pagePath => {
    // do stuff
    // the path will be /path/to/<word>.txt
};