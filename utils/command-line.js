import yargs from 'yargs';

/**
 * Get the arguments and flags passed from the command line.
 *
 * @param validOptions - Optional, restricts the keys/values that can be passed for flags.  In
 * the example below, only flags with keys foo, bar, and baz can be passed.  The value for foo
 * can be true or false, bar can be 'a', 'b', or 'c', and baz can be anything.
 * {
 *     foo: [true, false],
 *     bar: ['a', 'b', 'c'],
 *     baz: null,
 * }
 * @returns {{args: string[], options: {}}}
 */
export function getParamsFromCommandLine(validOptions) {
    const passedOptions = Object.keys(yargs.argv).filter(key => key !== '$0' && key !== '_');
    const options = {};

    for (const optionName of passedOptions) {
        // the keys passed in validOptions restrict the flags that can be passed through terminal
        if (!Object.keys(validOptions).includes(optionName)) {
            console.log(`Option ${optionName} is not a valid option`);
            process.exit();
        }
        const finalOptionValue = convertCommandLineStringBooleanToBoolean(yargs.argv[optionName]);
        // the array passed for the validOption's key restricts the values that can be passed from the terminal
        // pass null for a valid option's value to allow any value to be passed from the terminal
        if (validOptions[optionName] !== null && !validOptions[optionName].includes(finalOptionValue)) {
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