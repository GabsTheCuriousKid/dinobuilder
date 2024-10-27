function AddXMLtoXML(sourceXML, targetXML, elementBetween, elementToInject) {
  const cleanSourceXML = sourceXML.replace(/<\/?xml[^>]*>/g, '');
  const parser = new DOMParser();
  const targetDoc = parser.parseFromString(targetXML, 'text/xml');
  let targetXMLString = new XMLSerializer().serializeToString(targetDoc);
  const escapedElementBetween = elementBetween.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedElementToInject = elementToInject.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(${escapedElementBetween})(\\s*${escapedElementToInject})`, 's');
  const updatedXMLString = targetXMLString.replace(pattern, `$1${cleanSourceXML}$2`);
  return updatedXMLString;
}

export default AddXMLtoXML;
