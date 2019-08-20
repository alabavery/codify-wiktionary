import fs from 'fs';
import {getParamsFromCommandLine} from "../../../../utils/command-line";
import augmentInfinitives from './infinitives';

if (require.main === module) {
    const { args } = getParamsFromCommandLine();
    augment(args[0]).then(() => console.log("Done!"));
}

async function augment(pathToVerbData) {
    const data = JSON.parse(await fs.readFileSync(pathToVerbData, 'utf8'));
    augmentInfinitives(data); // mutate the object... no need to return
    await fs.writeFileSync(pathToVerbData, JSON.stringify(data));
}


