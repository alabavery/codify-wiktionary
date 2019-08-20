export default function(verbData) {
    for (const word of verbData) {
        word.conjugations.push(...getDirectObjectForms(word.infinitive));
        word.conjugations.push(...getIndirectObjectForms(word.infinitive));
    }
}

const DIRECT_OBJECT_PRONOUNS = [
    ['me'],
    ['te'],
    ['lo', 'la'],
    ['nos'],
    ['os'],
    ['los', 'las'],
];

const INDIRECT_OBJECT_PRONOUNS = [
    ['me'],
    ['te'],
    ['le'],
    ['nos'],
    ['os'],
    ['les'],
];

const genericAddEndingsToInfinitive = (infinitive, pronouns, tense) => {
    return pronouns.reduce((acc, pronounsForPerson, index) => {
        acc.push(
            ...pronounsForPerson
                .map(pronoun => ({
                        data: infinitive + pronoun,
                        person: index,
                        tense,
                    }),
                ),
        );
        return acc;
    }, []);
};

const getDirectObjectForms = infinitive =>
    genericAddEndingsToInfinitive(infinitive, DIRECT_OBJECT_PRONOUNS, 'directObjectInfinitive');
const getIndirectObjectForms = infinitive =>
    genericAddEndingsToInfinitive(infinitive, INDIRECT_OBJECT_PRONOUNS, 'indirectObjectInfinitive');
