const GetType =  require("../baseTools");
module.exports = function appendNode(dom, temp, returnAllNodes) {
  if (GetType.isString(dom)) {
    returnAllNodes = temp;
    temp = dom;
    dom = undefined;
  }
  const div = dom || document.createElement('div');
  div.innerHTML = temp;
  return returnAllNodes ? div.children : div.children[0];
};
