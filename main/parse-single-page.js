import fs from 'fs';

export default async function (pagePath, options = {}) {
    const fileContents = await fs.readFileSync(pagePath);
    console.log(fileContents);
    return parsePageText(fileContents, options);
}

function parsePageText(pageText, options) {

}