import yargs from 'yargs';

export function getParamsFromCommandLine(validOptions) {
    const passedOptions = Object.keys(yargs.argv).filter(key => key !== '$0' && key !== '_');
    const options = {};
    
    for (const optionName of passedOptions) {
        if (!Object.keys(validOptions).includes(optionName)) {
            console.log(`Option ${optionName} is not a valid option`);
            process.exit();
        }
        const finalOptionValue = convertCommandLineStringBooleanToBoolean(yargs.argv[optionName]);
        if (!validOptions[optionName].includes(finalOptionValue)) {
            console.log(`Option ${optionName} must have one of values ${JSON.stringify(validOptions[optionName])}`);
            process.exit();
        }
        options[optionName] = finalOptionValue;
    }
    return {
      options: passedOptions.reduce((acc, optionKey) => ({ ...acc, [optionKey]: yargs.argv[optionKey]}), {}),
      args: yargs.argv._,
    };
}

function convertCommandLineStringBooleanToBoolean(string) {
    if (string === 'true') {
        return true;
    }
    if (string === 'false') {
        return false;
    }
    return string;
};