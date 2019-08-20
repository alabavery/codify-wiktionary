import getByPartOfSpeech from '../get-by-part-of-speech';
import {getPartsOfSpeechValues} from "../../utils/parts-of-speech";

const byPartOfSpeech = {
  adjective: `====Adjective====
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


=====Derived terms=====
* {{l|es|agua dura}}

=====Related terms=====
* {{l|es|dureza}}
* {{l|es|durar}}
* {{l|es|endurecer}}

`,
    noun: `====Noun====
{{es-noun|m}}

# {{lb|es|Spain|colloquial}} a coin worth 5 [[peseta]]s

=====Derived terms=====
* {{l|es|importar un duro}}
* {{l|es|nadie da duros a pesetas}}

===Etymology 2===
{{nonlemma}}

`,
    verb: `====Verb====

{{head|es|verb form}}


# {{es-verb form of|ending=ar|mood=indicative|tense=present|pers=1|number=singular|durar|nodot=y}}

===Anagrams===
* {{anagrams|es|rudo|urdo}}

===Further reading===
* {{R:DRAE}}
`,
};


const SPANISH_PART_OF_PAGE = `
==Spanish==

===Pronunciation===
* {{es-IPA}}

===Etymology 1===
From {{inh|es|osp|duro}}, from {{inh|es|la|dūrus}}, from {{inh|es|itc-pro|*dūros}}, from {{inh|es|ine-pro||*duh₂-ró-s|long}}, from {{m|ine-pro|*dweh₂-||far, long}}. Cognate with {{cog|grc|δηρός||long}},  {{cog|sa|दूर|tr=dūrá||distant, far, long}}.
${byPartOfSpeech.adjective}${byPartOfSpeech.noun}${byPartOfSpeech.verb}`;

describe('getByPartOfSpeech', () => {
   it ('works', () => {
        const received = getByPartOfSpeech(
            SPANISH_PART_OF_PAGE,
            getPartsOfSpeechValues(['verb', 'noun', 'adjective']),
        );
        expect(received.verb).toEqual(byPartOfSpeech.verb);
        expect(received.noun).toEqual(byPartOfSpeech.noun);
        expect(received.adjective).toEqual(byPartOfSpeech.adjective);
   });
});