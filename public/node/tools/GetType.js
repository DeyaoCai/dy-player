class GetType {
  static getType(item) {
    return Object.prototype.toString.call(item).slice(8, -1);
  }

  static isNumber(item) {
    return GetType.getType(item) === "Number"
  };

  static isString(item) {
    return GetType.getType(item) === "String"
  };

  static isArray(item) {
    return GetType.getType(item) === "Array"
  };

  static isObject(item) {
    return GetType.getType(item) === "Object"
  };

  static isBoolean(item) {
    return GetType.getType(item) === "Boolean"
  };

  static isNull(item) {
    return GetType.getType(item) === "Null"
  };

  static isUndefined(item) {
    return GetType.getType(item) === "Undefined"
  };

  static isFunction(item) {
    return GetType.getType(item) === "Function"
  };

  static isDate(item) {
    return GetType.getType(item) === "Date"
  };
}


module.exports = GetType;





