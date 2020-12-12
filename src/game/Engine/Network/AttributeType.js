const AttributeType = {
  "Uninitialized": 0,
  "Uint32": 1,
  "Int32": 2,
  "Float": 3,
  "String": 4,
  "Vector2": 5,
  "EntityType": 6,
  "ArrayVector2": 7,
  "ArrayUint32": 8,
  "Uint16": 9,
  "Uint8": 10,
  "Int16": 11,
  "Int8": 12,
  "Uint64": 13,
  "Int64": 14,
  "Double": 15
}

Object.keys(AttributeType).forEach(packet => {
  AttributeType[AttributeType[packet]] = packet;
});

export default AttributeType;
