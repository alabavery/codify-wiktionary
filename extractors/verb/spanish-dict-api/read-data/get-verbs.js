import fs from 'fs';

export default async function () {
    return JSON.parse(
      await fs.readFileSync('extractors/verb/spanish-dict-api/data/all-words.json'),
    );
}