import {parsePageText} from "../parse-single-page";
import {getPartsOfSpeechValues} from "../../utils/parts-of-speech";

const INSERT_PRECEDER = 'INSERT_PRECEDER';
const VERB_SPECIFIC_INSERT_PRECEDER = 'VERB_SPECIFIC_INSERT_PRECEDER';

const PAGE = `
==Portuguese==

===Adjective===
{{pt-adj|dur|o}}

====Inflection====
{{pt-adj-infl|dur|o}}

====Quotations====
{{seeCites}}

====Related terms====
* {{l|pt|durar}}
* {{l|pt|dureza}}

===Adverb===
{{pt-adv}}

# {{l|en|hard}}
#: {{ux|pt|Ele trabalha '''duro'''.|He works '''hard'''.}}

===Verb===
{{head|pt|verb form}}

# {{pt-verb form of|durar|ar|indicative|present|singular|first}}

----

==Spanish==

===Pronunciation===
* {{es-IPA}}

===Etymology 1===
From {{inh|es|osp|duro}}, from {{inh|es|la|dūrus}}, from {{inh|es|itc-pro|*dūros}}, from {{inh|es|ine-pro||*duh₂-ró-s|long}}, from {{m|ine-pro|*dweh₂-||far, long}}. Cognate with {{cog|grc|δηρός||long}},  {{cog|sa|दूर|tr=dūrá||distant, far, long}}.

====Adjective====
{{es-adj|f=dura}} (''superlative'' '''[[durísimo]]''')

# [[hard]]
#: {{ant|es|blando}}
# [[firm]], [[solid]]
# [[tough]], [[resilient]], [[strong]]
# [[cruel]], [[severe]], [[harsh]]
# [[unbearable]], [[offensive]]
# [[mean]], [[stingy]], [[ungenerous]]
# [[rough]], [[uncouth]]
# {{lb|es|Mexico}} [[drunk]], [[tipsy]]

${INSERT_PRECEDER}5555

=====Derived terms=====
* {{l|es|agua dura}}

=====Related terms=====
* {{l|es|dureza}}
* {{l|es|durar}}
* {{l|es|endurecer}}

====Noun====
{{es-noun|m}}

${INSERT_PRECEDER}1414

# {{lb|es|Spain|colloquial}} a coin worth 5 [[peseta]]s

=====Derived terms=====
* {{l|es|importar un duro}}
* {{l|es|nadie da duros a pesetas}}

===Etymology 2===
{{nonlemma}}

====Verb====

{{head|es|verb form}}

${INSERT_PRECEDER}2121

# {{es-verb form of|ending=ar|mood=indicative|tense=present|pers=1|number=singular|durar|nodot=y}}

${VERB_SPECIFIC_INSERT_PRECEDER}4444

===Anagrams===
* {{anagrams|es|rudo|urdo}}

===Further reading===
* {{R:DRAE}}

[[Category:Spanish basic words]]`;


const getInsert = (text, insertPreceder) => {
    const insertStarts = text.indexOf(insertPreceder) + insertPreceder.length;
    return text.slice(insertStarts, insertStarts + 4);
};



const extractors = [
    {
        key: 'insertExtraction',
        partsOfSpeech: getPartsOfSpeechValues(['verb', 'adjective', 'noun']),
        get: ({ text }) => getInsert(text, INSERT_PRECEDER),
    },
    {
        key: 'verbSpecificInsertExtraction',
        partsOfSpeech: getPartsOfSpeechValues(['verb']),
        get: ({ text }) => getInsert(text, VERB_SPECIFIC_INSERT_PRECEDER),
    },
];

describe('parsePageText', () => {
    it ('works with extractors that operate on multiple parts of speech', async () => {
        const received = await parsePageText('duro', PAGE, getPartsOfSpeechValues(), extractors, {});
        expect(received.verb.data.insertExtraction.data).toEqual('2121');
        expect(received.adjective.data.insertExtraction.data).toEqual('5555');
        expect(received.noun.data.insertExtraction.data).toEqual('1414');
    });
    it ('works with extractors that operate on single part of speech', async () => {
        const received = await parsePageText('duro', PAGE, getPartsOfSpeechValues(), extractors, {});
        expect(received.verb.data.verbSpecificInsertExtraction.data).toEqual('4444');
        expect(received.adjective.data.verbSpecificInsertExtraction).toEqual(undefined);
        expect(received.noun.data.verbSpecificInsertExtraction).toEqual(undefined);
    });
});