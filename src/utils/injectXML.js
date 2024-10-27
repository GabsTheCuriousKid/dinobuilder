async function injectXML(sourceData, targetData, elementToInject) {
  try {
    const parsedSource = new DOMParser().parseFromString(sourceData, 'text/xml');
    const element = parsedSource.querySelector(elementToInject);
    if (!element) {
      throw new Error(`Element ${elementToInject} not found in source data.`);
    }
    const serializedElement = new XMLSerializer().serializeToString(element);
    const closingTagIndex = targetData.indexOf('</xml>');
    if (closingTagIndex === -1) {
      throw new Error('Closing </xml> tag not found in target data.');
    }
    const finalXML = `${targetData.slice(0, closingTagIndex)}${serializedElement}${targetData.slice(closingTagIndex)}`;
    return finalXML;
  } catch (error) {
    console.error('Error injecting XML:', error);
    return null;
  }
}

export default injectXML;
