import fs from 'fs';

const PATH_TO_THIS_DIR = 'extractors/verb/spanish-dict-api';

if (require.main === module) {
    compile().then(() => console.log('Done!'));
}

async function compile() {
    return new Promise((resolve, reject) => {
        fs.readdir(`${PATH_TO_THIS_DIR}/data/words`, async function (err, items) {
            console.log(items);
            const all = [];
            for (let i = 0; i < items.length; i += 1) {
                const verbsInFile = await fs.readFileSync(`${PATH_TO_THIS_DIR}/data/words/${items[i]}`, 'utf8');
                all.push(...JSON.parse(verbsInFile));
            }
            await fs.writeFileSync(`${PATH_TO_THIS_DIR}/data/all-words.json`, JSON.stringify(all));
            resolve();
        });
    });
}