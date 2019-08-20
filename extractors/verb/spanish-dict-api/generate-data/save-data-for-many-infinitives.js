import fs from 'fs';
import { getData } from "./get-data-for-single-infinitive";
import {getParamsFromCommandLine} from "../../../../utils/command-line";
import {TENSES_TO_USE} from "../config";

if (require.main === module) {
    const { args } = getParamsFromCommandLine();
    if (args.length < 2) {
        console.log("Must include arguments for infinitives file and target directory!");
        process.exit();
    }
    console.log("beginning");
    run(args[0], args[1]).then(() => {
       console.log("Done!"); 
    });
}

async function run(filePathForInfinitives, targetDirectoryPath) {
    const fileContents = await fs.readFileSync(filePathForInfinitives, 'utf8');
    const infinitives = getInfinitivesFromFileContents(fileContents);
    // save 25 at a time
    for (let i = 0; i < infinitives.length; i += 25) {
        const data = await Promise.all(
            infinitives.slice(i, i + 25)
                .map(async infinitive => getData(infinitive, TENSES_TO_USE)),
        );
        await fs.writeFileSync(
            `${targetDirectoryPath}/${i}-${i+25}.json`,
            JSON.stringify(data),
        );
        console.log(`Finished obtaining ${i}-${i+25}`);
    }
}

function getInfinitivesFromFileContents(fileContents) {
    let list = fileContents.split(',');
    if (list.length < 2) {
        list = fileContents.split('\n');
    }
    const invalid = [];
    for (const word of list) {
        if (word.slice(word.length - 1).toLowerCase() !== 'r') {
            invalid.push(word);
        }
    }
    if (invalid.length > 0) {
        console.log('Invalid items in list of infinitives.  The following items are nto infinitives:');
        console.log(JSON.stringify(invalid));
        process.exit();
    }
    return list;
}