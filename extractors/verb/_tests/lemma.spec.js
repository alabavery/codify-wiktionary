import {genericGetLemma, getLemmaForCompound, getLemmaForPastParticiple} from "../lemma";

const REGULAR_TEXT = `===Verb===
{{head|es|verb form}}

# {{es-verb form of|person=third-person|number=plural|tense=present|mood=subjunctive|ending=ir|abrir}}
# {{lb|es|uds.}} {{es-verb form of|formal=yes|person=second-person|number=plural|sense=affirmative|mood=imperative|ending=ir|abrir}}
# {{lb|es|uds.}} {{es-verb form of|person=second-person|number=plural|tense=present|mood=subjunctive|ending=ir|abrir}}`;

const COMPOUND_TEXT = `===Verb===
{{head|es|verb form}}

# {{es-compound of|dec|ir|di|me|mood=imp|person=tú}}
#: '''''Dime'''!''
#:: Tell me!

===See also===
* {{l|es|dinos}}
* {{l|es|diles}}`;

const PAST_PARTICIPLE1 = `{{es-past participle|abogad}}

# {{es-verb form of|mood=participle|tense=past|gen=m|num=s|ending=ar|abogar}}`;
const PAST_PARTICIPLE2 = `{{es-past participle|abiert}}

# {{past participle of|abrir|lang=es|nocat=1}}
`;

describe('genericGetLemma', () => {
    it ('works on regular verb', () => {
        expect(genericGetLemma(REGULAR_TEXT)).toEqual('abrir');
    });
});

describe('getLemmaForCompound', () => {
   it ('works', () => {
       expect(getLemmaForCompound(COMPOUND_TEXT)).toEqual('decir');
   });
});

describe('getLemmaForPastParticiple', () => {
    it ('works in case 1', () => {
        expect(getLemmaForPastParticiple(PAST_PARTICIPLE1)).toEqual('abogar');
    });
    it ('works in case 2', () => {
        expect(getLemmaForPastParticiple(PAST_PARTICIPLE2)).toEqual('abrir');
    });
});