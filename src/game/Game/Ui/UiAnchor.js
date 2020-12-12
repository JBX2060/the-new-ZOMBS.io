const UiAnchor = {
  "TOP_LEFT": 1,
  "TOP_CENTER": 2,
  "TOP_RIGHT": 3,
  "BOTTOM_LEFT": 4,
  "BOTTOM_CENTER": 5,
  "BOTTOM_RIGHT": 6,
  "CENTER_LEFT": 7,
  "CENTER_RIGHT": 8
}

Object.keys(UiAnchor).forEach(packet => {
  UiAnchor[UiAnchor[packet]] = packet;
});

export default UiAnchor;
