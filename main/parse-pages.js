import {getParamsFromCommandLine} from "../utils/command-line";
import {getAllFileNamesFromDirectory, removeTrailingSlashFromDirectory, saveDataAsJson} from "../file-handling";
import {generateData} from '../data-structure-handling';
import parseSinglePage from './parse-single-page';
import {getPartsOfSpeechValues} from "../utils/parts-of-speech";
import getSpanishDictVerbData from '../extractors/verb/spanish-dict-api/read-data/get-verbs';

const validOptions = {
    // if any part of speech is passed as an option, only those that are passed will be parsed
    // e.g. babel-node index.js [page paths] --verb=true
    ...getPartsOfSpeechValues().reduce((acc, pos) => ({...acc, [pos]: [true]}), {}),
    spanishDictMethod: [false], // will use this method unless false flag passed
    sourceDirectory: null,
    save: [true], // will not save unless true flag passed
    targetDirectory: null,
};

if (require.main === module) {
    const {options, args} = getParamsFromCommandLine(validOptions);
    getFilePaths(options, args)
        .then(paths => parsePages(paths, options))
        .then(data => console.log(JSON.stringify(data)));
}

async function getFilePaths(options, args) {
    return options.sourceDirectory
        ? getAllFileNamesFromDirectory(options.sourceDirectory, true)
        : args;
}


/**
 *
 * @param pagePaths
 * @param options
 * @returns {Promise<void>}
 */
export async function parsePages(pagePaths, options = {}) {
    const finalOptions = await resolveOptions(options);

    const pathsByWord = pagePaths.reduce((acc, path) => {
        acc[getWordFromPagePath(path)] = path;
        return acc;
    }, {});
    const partsOfSpeechToParse = getPartsOfSpeechThatShouldParse(finalOptions);

    const allData = {};
    for (let i = 0; i < Object.keys(pathsByWord).length; i += 100) {
        const data = await generateData(
            Object.keys(pathsByWord).slice(i, i + 100),
            word => word,
            async word => parseSinglePage(
                word,
                pathsByWord[word],
                partsOfSpeechToParse,
                finalOptions,
            ),
        );
        Object.keys(data).forEach(word => allData[word] = data[word]);
        if (finalOptions.save) {
            await saveDataAsJson(data, `${finalOptions.targetDirectory}/${i}-${i + 100}.json`);
        }
    }
    return allData;
}

function getWordFromPagePath(pagePath) {
    const fileName = pagePath.split('/')[pagePath.split('/').length - 1];
    return fileName.split('_')[0];
};


function getPartsOfSpeechThatShouldParse(options = {}) {
    const partsOfSpeechInOptions = getPartsOfSpeechValues().filter(pos => {
        for (const optionName of Object.keys(options)) {
            if (optionName.toLowerCase() === pos.toLowerCase()) {
                return true;
            }
        }
        return false;
    });
    return partsOfSpeechInOptions.length > 0 ? partsOfSpeechInOptions : getPartsOfSpeechValues();
}

async function resolveOptions(passedOptions) {
    const finalOptions = {...passedOptions};
    finalOptions.save = passedOptions.save !== false;

    if (finalOptions.save) {
        if (!passedOptions.targetDirectory) {
            throw new Error(`Must include a targetDirectory to save files in!`);
        }
        finalOptions.targetDirectory = removeTrailingSlashFromDirectory(passedOptions.targetDirectory);
    }

    finalOptions.spanishDictMethod = passedOptions.spanishDictMethod !== false;
    if (finalOptions.spanishDictMethod) {
        finalOptions.spanishDictVerbData = await getSpanishDictVerbData();
    }

    return finalOptions;
}