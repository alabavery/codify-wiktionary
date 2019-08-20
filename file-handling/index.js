import fs from 'fs';

/**
 * Get array of file names for target directory.
 * Pass true for getFullPath to return the full file paths rather than just the names.
 */
export async function getAllFileNamesFromDirectory(targetDirectory, getFullPath = false) {
    return new Promise(resolve => {
        fs.readdir(targetDirectory, (err, files) => {
            if (err) {
                resolve(err)
            } else {
                const filePaths = getFullPath
                    ? files.map(
                        fileName => `${removeTrailingSlashFromDirectory(targetDirectory)}/${fileName}`,
                    ) : files;

                resolve(filePaths);
            }
        })
    });
}

export async function saveDataAsJson(data, targetFilePath) {
    return fs.writeFileSync(targetFilePath, JSON.stringify(data));
}

// remove the trailing slash, if there is one
export function removeTrailingSlashFromDirectory(directoryPath) {
    const endsInSlash = directoryPath.slice(directoryPath.length - 1) === '/';
    return endsInSlash ? directoryPath.slice(0, directoryPath.length - 1) : directoryPath;
}
