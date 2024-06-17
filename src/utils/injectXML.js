import fs from 'fs/promises';

async function injectXML(sourceXML, targetXML, elementToInject) {
  try {
    const sourceData = await fs.readFile(sourceXML, 'utf-8');
    const targetData = await fs.readFile(targetXML, 'utf-8');

    const parsedSource = new DOMParser().parseFromString(sourceData, 'text/xml');
    const element = parsedSource.querySelector(elementToInject);
    const serializedElement = new XMLSerializer().serializeToString(element);

    const targetWithoutClosingTag = targetData.split('</toolbox>');
    const finalXML = `${targetWithoutClosingTag[0]}${serializedElement}</toolbox>`;

    await fs.writeFile(targetXML, finalXML);
    console.log('XML injection successful!');
  } catch (error) {
    console.error('Error injecting XML:', error);
  }
}

export default injectXML;
