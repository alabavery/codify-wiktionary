// takes only the spanish part of the page (i.e., should pass it the return of getSpanishPart(wholePage)
import {PARTS_OF_SPEECH} from "../config";

export default function (languageText, partsOfSpeechToGet) {
    // note that we want to find all labels and not just those specified
    // by partsOfSpeechToGet, since finding the end of the sections for
    // partsOfSpeechToGet depends on knowing all the labels.
    const startsByPos = Object.values(PARTS_OF_SPEECH)
        .reduce((acc, pos) => {
            const start = languageText.indexOf(`====${pos.wiktionaryLabel}====`);
            if (start >= 0) {
                acc.push({ start, pos: pos.value });
            }
            return acc;
        }, [])
        .sort((a, b) => a.start - b.start);

    return startsByPos.reduce((acc, posAndStart, i, all) => {
        if (!partsOfSpeechToGet.includes(posAndStart.pos)) {
            return acc;
        }
        // if this is the last part of speech in the language's section, the end of it
        // is the end of the section (undefined).  Otherwise, it ends where the next
        // part of speech starts.
        const end = i === all.length - 1 ? undefined : all[i + 1].start;
        acc[posAndStart.pos] = languageText.slice(posAndStart.start, end);
        return acc;
    }, {});
}