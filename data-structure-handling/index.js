export async function generateData(itemsToIterate, keyGetter, dataGetter) {
  const data = getDataStandardDataStructureForArray(itemsToIterate, keyGetter);
  for (const item of itemsToIterate) {
    try {
      data[keyGetter(item)].data = await dataGetter(item, data);
    } catch (e) {
      data[keyGetter(item)].error = e.message;
    }
  }
  return data;
}

function getDataStandardDataStructureForArray(itemsToIterate, keyGetter) {
  return itemsToIterate.reduce((acc, item) => {
    acc[keyGetter(item)] = { data: {}, error: null };
    return acc;
  }, {});
}