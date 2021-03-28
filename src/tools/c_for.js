const GetType =  require("../baseTools");
const getType = GetType.getType;

module.exports = function c_for(list, templateFn) {
  let realTemplateFn = () => '';
  getType.isFunction(templateFn) && (realTemplateFn = templateFn);
  getType.isString(templateFn) && (realTemplateFn = () => templateFn);

  if (getType.isArray(list)) {
    return list.map((item, index) => realTemplateFn(item, index)).join('');
  }
  if (getType.isNumber(list)) {
    return new Array(list).fill(0).map((item, index) => realTemplateFn(index, index)).join('');
  }
  if (getType.isObject(list)) {
    return Object.keys(list).map((index) =>
      realTemplateFn(list[index], index)
    ).join('');
  }
  return '';
}
