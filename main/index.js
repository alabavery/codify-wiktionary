import fs from 'fs';
import {getParamsFromCommandLine} from "../utils";
import {getAllFileNamesFromDirectory} from "../file-handling";
import {OUTPUT_FILE_PATH, WIKTIONARY_PAGES_PATH} from "../config";

if (require.main === module) {
    parseAll();
}

async function parseAll() {
    const paths = await getAllFileNamesFromDirectory(WIKTIONARY_PAGES_PATH);
    const parsed = await parsePages(paths);
    await fs.writeFileSync(OUTPUT_FILE_PATH, JSON.stringify(parsed));
    console.log("\nDone!\n");
}
