const getCrossProduct = (tenses, persons) => tenses.reduce(
    (acc, tense) =>
        acc.concat(persons.map(person => ({ person, tense }))),
    [],
);

export const TENSES = [
    'presentIndicative',
    'preteritIndicative',
    'imperfectIndicative',
    'conditionalIndicative',
    'futureIndicative',
    'presentSubjunctive',
    'imperfectSubjunctive',
    'imperfectSubjunctive2',
    'futureSubjunctive',
    'imperative',
    'negativeImperative',
    'presentContinuous',
    'preteritContinuous',
    'imperfectContinuous',
    'conditionalContinuous',
    'futureContinuous',
    'presentPerfect',
    'preteritPerfect',
    'pastPerfect',
    'conditionalPerfect',
    'futurePerfect',
    'presentPerfectSubjunctive',
    'pastPerfectSubjunctive',
    'futurePerfectSubjunctive',
];

export const PERSONS = ['0', '1', '2', '3', '4', '5'];

const INDICATIVES = [
    'presentIndicative',
    'preteritIndicative',
    'imperfectIndicative',
    'conditionalIndicative',
    'futureIndicative',
];

const SUBJUNCTIVES = [
    'imperfectSubjunctive',
    'imperfectSubjunctive2',
    'futureSubjunctive',
];

export const TENSES_TO_USE = [...INDICATIVES, ...SUBJUNCTIVES];
