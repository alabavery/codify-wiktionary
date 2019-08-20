import SpanishDictExtractors from './spanish-dict-api/read-data/spanish-dict-extractors';

export default ({ word, extracted, options }) => {
    if (options.spanishDictMethod) {
        console.log(extracted);
        // return SpanishDictExtractors.getTense(
        //     word,
        //     extracted.lemma,
        //     { data: options.spanishDictVerbData },
        // );
    } else {
        throw new Error(`spanishDictMethod is only implemented way of getting tense!`)
    }
}