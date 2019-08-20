const HABER_FORMS = {
    presentPerfect: ['he', 'has', 'ha', 'hemos', 'habéis', 'han'],
    preteritePerfect: ['hube', 'hubiste', 'hubo', 'hubimos', 'hubisteis', 'hubieron'],
    pastPerfect: ['había', 'habías', 'había', 'habíamos', 'habíais', 'habían'],
    conditionalPerfect: ['habría', 'habrías', 'habría', 'habríamos', 'habríais', 'habrían'],
    futurePerfect: ['habré', 'habrás', 'habrá', 'habremos', 'habréis', 'habrán'],
};

export default function(verbData) {
    for (const word of verbData) {
        word.conjugations.push(...getPerfectForms(word.conjugations));
    }
}

const getPerfectForms = conjugationsForSingleVerb => {
  const pastParticipleObject = conjugationsForSingleVerb.find(conjugation => conjugation.tense === 'pastParticiple');
  let error = null;
  if (!pastParticipleObject || !!pastParticipleObject.error) {
      error = `Must have valid past participle`;
  }
  const pastParticipleString = pastParticipleObject.data;
  return Object.keys(HABER_FORMS).reduce((acc, tense) => {
      acc.push(
          ...HABER_FORMS[tense]
              .map(
                  (haberForm, index) => ({
                      tense,
                      person: index,
                      data: error ? null : `${haberForm} ${pastParticipleString}`,
                      error,
                  }),
              ),
      );
      return acc;
  }, []);
};