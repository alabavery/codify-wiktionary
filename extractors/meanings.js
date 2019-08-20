const exceptions = [
    // // [[Category:es:Occupations]] is commonly located at the bottom of the
    // page and can be confused for a meaning.
    'Category:',
];
/**
 * Return array of meanings
 */
export default function (word, textForPartOfSpeech) {
    const meanings = [];
    const pattern = /\s\[\[\w+ *\w*]]/g;
    let match = pattern.exec(textForPartOfSpeech);
    while (match) {
        meanings.push(match[0]);
        match = pattern.exec(textForPartOfSpeech)
    }
    return meanings.reduce((uniqueMeanings, meaning) => {
        // slice the "[[" and "]]" off the beginning and end
        const withBracketsSlicedOff = meaning.slice(3, meaning.length - 2);
        // don't include the weird exceptions that have square brackets but aren't meanings
        if (!exceptions.find(exception => found.indexOf(exception) === 0)) {
            if (!uniqueMeanings.includes(withBracketsSlicedOff)) {
                uniqueMeanings.push(withBracketsSlicedOff);
            }
        }
        return uniqueMeanings;
    }, []);
}