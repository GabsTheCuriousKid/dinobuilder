async function injectXML(sourceData, targetData, elementToInject) {
  try {
    const parsedSource = new DOMParser().parseFromString(sourceData, 'text/xml');
    const element = parsedSource.querySelector(elementToInject);
    const serializedElement = new XMLSerializer().serializeToString(element);

    const targetWithoutClosingTag = targetData.split('</xml>');
    const finalXML = `${targetWithoutClosingTag[0]}${serializedElement}</xml>`;

    return finalXML; // Return the modified XML instead of writing it
  } catch (error) {
    console.error('Error injecting XML:', error);
  }
}

export default injectXML;
