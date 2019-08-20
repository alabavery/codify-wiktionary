import {generateData} from "../index";

describe('generateData', () => {
    describe('without async data getter', () => {
        const keyGetter = item => item.key;
        const dataGetter = item => item.contents;
        const itemsToIterate = [
            {key: 'a', contents: '1'},
            {key: 'b', contents: '2'},
            {key: 'c', contents: '3'},
        ];

        describe('when there are no errors', () => {
            it ('sets keys properly', async () => {
                const data = await generateData(itemsToIterate, keyGetter, dataGetter);
                expect(Object.keys(data).sort()).toEqual(['a', 'b', 'c']);
            });
            it ('sets values properly', async () => {
                const data = await generateData(itemsToIterate, keyGetter, dataGetter);
                expect(data.a.data).toEqual('1');
                expect(data.b.data).toEqual('2');
                expect(data.c.data).toEqual('3');
            });
            it ('sets errors to null', async () => {
                const data = await generateData(itemsToIterate, keyGetter, dataGetter);
                expect(data.a.error).toEqual(null);
                expect(data.b.error).toEqual(null);
                expect(data.c.error).toEqual(null);
            });
            it ('uses data obtained so far properly', async () => {
               const dataGetterThatUsesDataObtainedSoFar = (item, dataSoFar) => {
                 if (item.key === 'b') {
                     // the second item's data depends on receiving data set from the first item
                     return dataSoFar.a.data;
                 }
                 return item.contents;
               };
                const data = await generateData(itemsToIterate, keyGetter, dataGetterThatUsesDataObtainedSoFar);
                expect(data.a.data).toEqual('1');
                expect(data.b.data).toEqual('1');
                expect(data.c.data).toEqual('3');
            });
        });

        describe('when there are errors', () => {
            const dataGetterWithError = item => {
                if (item.key === 'b') {
                    throw new Error('Here is the error');
                }
                return item.contents;
            };

            it ('sets keys properly', async () => {
                const data = await generateData(itemsToIterate, keyGetter, dataGetterWithError);
                expect(Object.keys(data).sort()).toEqual(['a', 'b', 'c']);
            });
            it ('sets values properly', async () => {
                const data = await generateData(itemsToIterate, keyGetter, dataGetterWithError);
                expect(data.a.data).toEqual('1');
                expect(data.b.data).toEqual({});
                expect(data.c.data).toEqual('3');
            });
            it ('sets error properly', async () => {
                const data = await generateData(itemsToIterate, keyGetter, dataGetterWithError);
                expect(data.b.error).toEqual('Here is the error');
            });
            it ('sets other errors to null', async () => {
                const data = await generateData(itemsToIterate, keyGetter, dataGetterWithError);
                expect(data.a.error).toEqual(null);
                expect(data.c.error).toEqual(null);
            });
            it ('uses data obtained so far properly', async () => {
                const dataGetterThatUsesDataObtainedSoFar = (item, dataSoFar) => {
                    // throw an error for a
                    if (item.key === 'a') {
                        throw new Error('throw error for a');
                    }
                    // operate normally for b
                    if (item.key === 'b') {
                        return item.contents;
                    }
                    // use b's data for c
                    return dataSoFar.b.data;
                };
                const data = await generateData(itemsToIterate, keyGetter, dataGetterThatUsesDataObtainedSoFar);
                expect(data.a.data).toEqual({});
                expect(data.b.data).toEqual('2');
                expect(data.c.data).toEqual('2');
            });
        });
    });

    describe('WITH async data getter', () => {
        const keyGetter = item => item.key;
        const dataGetter = async item => item.contents;
        const itemsToIterate = [
            {key: 'a', contents: '1'},
            {key: 'b', contents: '2'},
            {key: 'c', contents: '3'},
        ];

        describe('when there are no errors', () => {
            it ('sets keys properly', async () => {
                const data = await generateData(itemsToIterate, keyGetter, dataGetter);
                expect(Object.keys(data).sort()).toEqual(['a', 'b', 'c']);
            });
            it ('sets values properly', async () => {
                const data = await generateData(itemsToIterate, keyGetter, dataGetter);
                expect(data.a.data).toEqual('1');
                expect(data.b.data).toEqual('2');
                expect(data.c.data).toEqual('3');
            });
            it ('sets errors to null', async () => {
                const data = await generateData(itemsToIterate, keyGetter, dataGetter);
                expect(data.a.error).toEqual(null);
                expect(data.b.error).toEqual(null);
                expect(data.c.error).toEqual(null);
            });
            it ('uses data obtained so far properly', async () => {
                const dataGetterThatUsesDataObtainedSoFar = async (item, dataSoFar) => {
                    if (item.key === 'b') {
                        // the second item's data depends on receiving data set from the first item
                        return dataSoFar.a.data;
                    }
                    return item.contents;
                };
                const data = await generateData(itemsToIterate, keyGetter, dataGetterThatUsesDataObtainedSoFar);
                expect(data.a.data).toEqual('1');
                expect(data.b.data).toEqual('1');
                expect(data.c.data).toEqual('3');
            });
        });

        describe('when there are errors', () => {
            const dataGetterWithError = async item => {
                if (item.key === 'b') {
                    throw new Error('Here is the error');
                }
                return item.contents;
            };

            it ('sets keys properly', async () => {
                const data = await generateData(itemsToIterate, keyGetter, dataGetterWithError);
                expect(Object.keys(data).sort()).toEqual(['a', 'b', 'c']);
            });
            it ('sets values properly', async () => {
                const data = await generateData(itemsToIterate, keyGetter, dataGetterWithError);
                expect(data.a.data).toEqual('1');
                expect(data.b.data).toEqual({});
                expect(data.c.data).toEqual('3');
            });
            it ('sets error properly', async () => {
                const data = await generateData(itemsToIterate, keyGetter, dataGetterWithError);
                expect(data.b.error).toEqual('Here is the error');
            });
            it ('sets other errors to null', async () => {
                const data = await generateData(itemsToIterate, keyGetter, dataGetterWithError);
                expect(data.a.error).toEqual(null);
                expect(data.c.error).toEqual(null);
            });
            it ('uses data obtained so far properly', async () => {
                const dataGetterThatUsesDataObtainedSoFar = async (item, dataSoFar) => {
                    // throw an error for a
                    if (item.key === 'a') {
                        throw new Error('throw error for a');
                    }
                    // operate normally for b
                    if (item.key === 'b') {
                        return item.contents;
                    }
                    // use b's data for c
                    return dataSoFar.b.data;
                };
                const data = await generateData(itemsToIterate, keyGetter, dataGetterThatUsesDataObtainedSoFar);
                expect(data.a.data).toEqual({});
                expect(data.b.data).toEqual('2');
                expect(data.c.data).toEqual('2');
            });
        });
    });
});