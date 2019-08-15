import parsePage from '../../main/parse-single-page';
import {getParamsFromCommandLine} from "../../utils";

const validOptionsForParseVerb = {
  useSpanishDictMethod: [true],
};

if (require.main === module) {
    const { options, args } = getParamsFromCommandLine(validOptionsForParseVerb);
    // console.log("Parse data:");
    parsePage(args[0], { ...options, verb: true })
}


/**
 * Should return
 * {
 *     data: {
 *         meanings
 *         lemma
 *         ...
 *     },
 *     errors: [],
 * }
 * @param verbText
 * @param options
 */
async function parseVerb(verbText, options = {}) {

}