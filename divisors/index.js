import getSpanishPart from "./get-spanish-part";
import getByPartOfSpeech from "./get-by-part-of-speech";
import {PARTS_OF_SPEECH} from "../config";

export default function (pageText) {
    return getByPartOfSpeech(getSpanishPart(pageText), PARTS_OF_SPEECH);
}
