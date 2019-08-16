import { getParamsFromCommandLine } from "../utils";
import {PARTS_OF_SPEECH} from "../config";
import { generateData } from '../data-structure-handling';
import parseSinglePage from 'parse-single-page';

// if any part of speech is passed as an option, only those that are passed will be parsed
// e.g. babel-node index.js [page paths] --verb=true
const validOptions = [ ...Object.keys(PARTS_OF_SPEECH) ];

if (require.main === module) {
    const { options, args } = getParamsFromCommandLine(validOptions);
    parsePages(args, options);
}

/**
 *
 * @param pagePaths
 * @param options
 * @returns {Promise<void>}
 */
export async function parsePages(pagePaths, options = {}) {
    return generateData(pagePaths, parseSinglePage, [], options);
}