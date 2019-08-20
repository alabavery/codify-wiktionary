import {PARTS_OF_SPEECH} from "../config";


export const getPartsOfSpeechValues = (partsOfSpeech) => {
    if (!partsOfSpeech) {
        return Object.values(PARTS_OF_SPEECH).map(obj => obj.value);
    }
    return Object.keys(PARTS_OF_SPEECH).reduce((acc, pos) => {
        if (partsOfSpeech.includes(pos)) {
            acc.push(PARTS_OF_SPEECH[pos].value);
        }
        return acc;
    }, []);
};

export const getPartsOfSpeechLabels = (partsOfSpeech) => {
    if (!partsOfSpeech) {
        return Object.values(PARTS_OF_SPEECH).map(obj => obj.wiktionaryLabel);
    }
    return Object.keys(PARTS_OF_SPEECH).reduce((acc, pos) => {
        if (partsOfSpeech.includes(pos)) {
            acc.push(PARTS_OF_SPEECH[pos].wiktionaryLabel);
        }
        return acc;
    }, []);
};