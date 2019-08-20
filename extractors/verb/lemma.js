import SpanishDictExtractors from './spanish-dict-api/read-data/spanish-dict-extractors';
import { getBroadType } from './type';

export default ({ word, text, options }) => {
    if (options.spanishDictMethod) {
        return SpanishDictExtractors.getLemma(
            word,
            { data: options.spanishDictVerbData },
        );
    }

    const type = getBroadType({ text });
    if (!type || !type.length) {
        throw new Error(`Unable to get type`);
    }
    switch (type) {
        case 'compound':
            return getLemmaForCompound(text);
        case 'infinitive':
            return null;
        case 'pastParticiple':
            return getLemmaForPastParticiple(text);
        case 'regular':
            return genericGetLemma(text, 'regular');
        default:
            throw new Error(`Unexpected type ${type}`);
    }
};


const getTextAfterPreceder = (text, preceder, type) => {
    const precederStart = text.indexOf(preceder);
    if (precederStart < 0) {
        throw new Error(`No preceder of '${preceder}' found for type ${type}`);
    }
    return text.slice(precederStart + preceder.length);
};

export function genericGetLemma(text, type) {
    const textAfterPreceder = getTextAfterPreceder(text, '{{es-verb form of|', 'regular');
    // return the first match of |word}} e.g. abajar}}
    const matched = /\|[^\s|]*}}/.exec(textAfterPreceder);
    if (!matched) {
        throw new Error('Lemma pattern not found for non-compound');
    }
    return matched[0].slice(1, matched[0].length - 2);
}

export function getLemmaForCompound(text) {
    const textAfterPreceder = getTextAfterPreceder(text, '{{es-compound of|', 'compound');
    const splits = textAfterPreceder.split('|');
    if (splits.length < 3) {
        throw new Error(`Too few '|' found for compound`);
    }
    return splits[0] + splits[1];
}

export function getLemmaForPastParticiple(text) {
    const possiblePreceder = '{{past participle of|';
    if (text.indexOf(possiblePreceder) > 0) {
        const textAfter = getTextAfterPreceder(text, possiblePreceder, 'pastParticiple');
        const splits = textAfter.split('|');
        if (splits.length < 2) {
            throw new Error(`No '|' found for pastParticiple`);
        }
        return splits[0];
    } else {
        return genericGetLemma(text, 'pastParticiple');
    }
}
