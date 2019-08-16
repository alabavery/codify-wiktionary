import parsePage from '../../main/parse-single-page';
import {getParamsFromCommandLine} from "../../utils";

const validOptionsForParseVerb = {
  useSpanishDictMethod: [true],
};

if (require.main === module) {
    const { options, args } = getParamsFromCommandLine(validOptionsForParseVerb);
    // console.log("Parse data:");
    console.log(parsePage(args[0], { ...options, verb: true }));
}
