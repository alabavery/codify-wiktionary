export async function generateData(itemsToIterateThrough, method, otherParams, options = {}) {
  const data = getDataStandardDataStructureForArray(itemsToIterateThrough);
  for (const item of itemsToIterateThrough) {
    try {
      data[item].data = await method(item, ...otherParams, options);
    } catch (e) {
      data[item].error = e.message;
    }
  }
}

function getDataStandardDataStructureForArray(arr) {
  return arr.reduce((acc, item) => {
    acc[item] = { data: {}, error: null };
    return acc;
  }, {});
}
