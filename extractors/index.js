import VerbExtractors from './verb';

export default [
    ...VerbExtractors.map(extractor => ({ ...extractor, partsOfSpeech: ['Verb'] })),
];