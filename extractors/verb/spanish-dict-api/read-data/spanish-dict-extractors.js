import getSavedData from './get-verbs';

const getLemma = async (verb, { path, data }) => {
    return (await getSpanishDictEntryForWord(verb, path, data)).infinitive;
};

const getTense = async (verb, lemma, { path, data }) => {
    const baseEntry = await getSpanishDictEntryForWord(verb, path, data, lemma);
    const conjugationEntry = getConjugationEntryFromBaseEntry(baseEntry, verb);
    if (!conjugationEntry) {
        throw new Error(`spanishDictMethod error: No conjugation ${verb} found under entry found for lemma/infinitive ${lemma}`);
    }
    return conjugationEntry.tense;
};

const getPerson = async (verb, lemma, { path, data }) => {
    const baseEntry = await getSpanishDictEntryForWord(verb, path, data, lemma);
    const conjugationEntry = getConjugationEntryFromBaseEntry(baseEntry, verb);
    if (!conjugationEntry) {
        throw new Error(`spanishDictMethod error: No conjugation ${verb} found under entry found for lemma/infinitive ${lemma}`);
    }
    return conjugationEntry.person;
};

export default { getLemma, getTense, getPerson };

async function getSpanishDictEntryForWord(word, pathToSpanishDictDataFile, data, lemma) {
    if (data) {
        return getEntryFromSpanishDictData(word, data, lemma);
    }
    if (!path) {
        throw new Error(`spanishDictMethod error: Must pass either data for spanish dict verbs or path to file containing data`);
    }
    return getEntryFromSpanishDictData(word, await getSavedData(), lemma);
}

/**
 * get the higher level object... i.e.
 * {
 *  infinitive,
 *  conjugations,
 * }
 */
function getEntryFromSpanishDictData(word, data, lemma) {
    if (lemma) {
        const baseEntry = data.find(item => item.infinitive === lemma);
        if (!baseEntry) {
            throw new Error(`spanishDictMethod error: No item found for infinitive ${lemma}`);
        }
        return baseEntry;
    }
    for (let i = 0; i < data.length; i += 1) {
        const found = getConjugationEntryFromBaseEntry(data[i], word);
        if (found) {
            console.log({found});
            return data[i];
        }
    }
    throw new Error(`spanishDictMethod error: No item found for cognate ${word}`);
}

function getConjugationEntryFromBaseEntry(baseEntry, word) {
    return baseEntry.conjugations.find(c => c.data === word);
}
