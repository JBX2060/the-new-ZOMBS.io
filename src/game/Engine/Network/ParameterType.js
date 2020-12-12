const ParameterType = {
  "Uint32": 0,
  "Int32": 1,
  "Float": 2,
  "String": 3,
  "Uint64": 4,
  "Int64": 5
}

Object.keys(ParameterType).forEach(packet => {
  ParameterType[ParameterType[packet]] = packet;
});

export default ParameterType;
