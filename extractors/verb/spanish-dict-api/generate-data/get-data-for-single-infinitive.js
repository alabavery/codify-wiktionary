import dict from 'spanish-dict-client';
import {getParamsFromCommandLine} from "../../../../utils/command-line";
import { TENSES_TO_USE } from "../config";

if (require.main === module) {
    const { args } = getParamsFromCommandLine();
    getData(args[0], TENSES_TO_USE).then((data, err) => {
        console.log({ data: JSON.stringify(data) });
        console.log({ err });
    });
}

/**
 * return
 * {
 *     infinitive: String,
 *     meanings: {
 *       data: String[],
 *       error: String,
 *     },
 *     conjugations: [
 *       {
 *         tense: String,
 *         person: String,
 *         data: String,
 *         error: String,
 *       },
 *     ],
 * }
 */
export async function getData(infinitive, tenses) {
    const meanings = await getMeanings(infinitive);
    const conjugations = await getConjugations(infinitive, tenses);
    return { infinitive, meanings, conjugations };
}

/**
 * return
 * [
 *       {
 *         tense: String,
 *         person: String,
 *         data: String,
 *         error: String,
 *       },
 * ]
 */
export async function getConjugations(infinitive, tenses) {
    const conjugations = [];
    for (const tense of tenses) {
        const resWords = await dict.conjugate({
            word: infinitive,
            tense,
            person: '6',
        });
        if (resWords.length !== 6) {
            for (let i = 0; i < 6; i += 1) {
                conjugations.push({
                   tense,
                   person: i,
                   error: `Unable to determine cognate - wrong number of words returned for request`,
                });
            }
        } else {
            conjugations.push(...resWords.map((word, i) => ({
                data: word,
                person: i,
                tense,
            })))
        }
    }
    try {
        conjugations.push({
           data: await getPresentParticiple(infinitive),
           tense: 'presentParticiple',
        });
    } catch (e) {
        conjugations.push({
            error: e.message,
            tense: 'presentParticiple',
        });
    }
    try {
        conjugations.push({
            data: await getPastParticiple(infinitive),
            tense: 'pastParticiple',
        });
    } catch (e) {
        conjugations.push({
            error: e.message,
            tense: 'pastParticiple',
        });
    }
    return conjugations;
}

async function getMeanings(word) {
    const meanings = { data: [], error: null };
    try {
        meanings.data = await dict.translate(word);
    } catch (e) {
        meanings.error = `Could not get meanings for ${word}: ${e.message}`;
        return meanings;
    }
    if (!meanings.data.length) {
        meanings.error = `No meanings returned for ${word}`;
    }
    return meanings;
}

async function getPastParticiple(infinitive) {
    const presentPerfectFirstPerson = await dict.conjugate({
        word: infinitive,
        person: '0',
        tense: 'presentPerfect',
    });
    const presentPerfectSubjunctiveFourthPerson = await dict.conjugate({
        word: infinitive,
        person: '3',
        tense: 'presentPerfectSubjunctive',
    });
    if (!(presentPerfectFirstPerson.length === 1 && presentPerfectSubjunctiveFourthPerson.length === 1)) {
        throw new Error(`Unexpected response getting past participle for ${infinitive}`);
    }
    const usingPresentPerfect = presentPerfectFirstPerson[0].split(' ')[1];
    const usingPerfectSubjunctive = presentPerfectSubjunctiveFourthPerson[0].split(' ')[1];
    if (!usingPresentPerfect || !usingPerfectSubjunctive || usingPresentPerfect !== usingPerfectSubjunctive) {
        throw new Error(`Unexpected response getting past participle for ${infinitive}: undefined tense or unmatching tenses`);
    }
    return usingPerfectSubjunctive;
}

async function getPresentParticiple(infinitive) {
    const presentContinuousFirstPerson = await dict.conjugate({
        word: infinitive,
        person: '0',
        tense: 'presentContinuous',
    });
    const imperfectContinuousFourthPerson = await dict.conjugate({
        word: infinitive,
        person: '3',
        tense: 'imperfectContinuous',
    });
    if (!(presentContinuousFirstPerson.length === 1 && imperfectContinuousFourthPerson.length === 1)) {
        throw new Error(`Unexpected response getting present participle for ${infinitive}`);
    }
    const usingPresentContinuous = presentContinuousFirstPerson[0].split(' ')[1];
    const usingImperfectContinuous = imperfectContinuousFourthPerson[0].split(' ')[1];
    if (!usingPresentContinuous || !usingImperfectContinuous || usingPresentContinuous !== usingImperfectContinuous) {
        throw new Error(`Unexpected response getting present participle for ${infinitive}: undefined tense or unmatching tenses`);
    }
    return usingPresentContinuous;
}