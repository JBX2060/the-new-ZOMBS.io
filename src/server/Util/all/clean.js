function clean(entity) {
  try {
    const map = entity.getAttributeMap();
    const cleanedEntity = {};

    Object.keys(entity).forEach(attr => {
      const attribute = entity[attr];
      const attributeData = map.find(data => data.name == attr);

      if (attributeData && attributeData.send !== false) {
        cleanedEntity[attr] = attribute;
      }
    });

    return cleanedEntity;
  } catch {
    return entity;
  }
}

export default clean;
