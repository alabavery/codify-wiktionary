import fs from 'fs';
import {getParamsFromCommandLine} from "../../../../utils/command-line";

if (require.main === module) {
    // const { args } = getParamsFromCommandLine();
    // if (args.length < 1) {
    //     console.log(`Must include argument for the directory to get verb data`);
    //     process.exit();
    // }
    findAndSave().then(() => console.log('Done!'))
}

export default function findAllErrors(verbData) {
    return verbData.reduce((allErrors, verb) => {
        if (verb.meanings.error) {
            allErrors.push({
                infinitive: verb.infinitive,
                type: 'meanings',
                ...verb.meanings,
            });
        }
        for (const conjugation of verb.conjugations) {
            if (conjugation.error) {
                allErrors.push({
                   infinitive: verb.infinitive,
                   type: 'conjugation',
                   ...conjugation,
                });
            }
        }
        return allErrors;
    }, []);
}

async function findAndSave() {
    return fs.readdir('extractors/verb/spanish-dict-api/data/words', async function(err, items) {
        const allErrors = [];
        for (const filePath of items) {
            const data = await fs.readFileSync(
                `extractors/verb/spanish-dict-api/data/words/${filePath}`,
                'utf8',
            );
            allErrors.push(...findAllErrors(JSON.parse(data)));
        }
        await fs.writeFileSync(
            `extractors/verb/spanish-dict-api/data/errors.json`,
            JSON.stringify(allErrors),
        );
    });
}