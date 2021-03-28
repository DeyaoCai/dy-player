export class GetType {
  static getType(item: any) {
    return Object.prototype.toString.call(item).slice(8, -1);
  }

  static isNumber(item: any) {
    return GetType.getType(item) === "Number"
  };

  static isString(item: any) {
    return GetType.getType(item) === "String"
  };

  static isArray(item: any) {
    return GetType.getType(item) === "Array"
  };

  static isObject(item: any) {
    return GetType.getType(item) === "Object"
  };

  static isBoolean(item: any) {
    return GetType.getType(item) === "Boolean"
  };

  static isNull(item: any) {
    return GetType.getType(item) === "Null"
  };

  static isUndefined(item: any) {
    return GetType.getType(item) === "Undefined"
  };

  static isFunction(item: any) {
    return GetType.getType(item) === "Function"
  };

  static isDate(item: any) {
    return GetType.getType(item) === "Date"
  };
}







