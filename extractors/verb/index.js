import getLemma from './lemma';
import getTense from './tense';

export default [
    {
      key: 'lemma',
      get: getLemma,
    },
    {
        key: 'tense',
        get: getTense,
    },
    // {
    //   key: 'person',
    //   get: getPerson,
    // },
];