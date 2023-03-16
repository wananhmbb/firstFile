export default class dataType {
  static _toString = Object.prototype.toString

  /**
   * Determine if a value is an Array
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an Array, otherwise false
   */
  static isArray(val) {
    return dataType._toString.call(val) === "[object Array]"
  }

  /**
   * Determine if a value is an Object
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an Object, otherwise false
   */
  static isObject(val) {
    return val !== null && typeof val === "object"
  }

  /**
   * Determine if a value is a Date
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Date, otherwise false
   */
  static isDate(val) {
    return dataType._toString.call(val) === "[object Date]"
  }

  /**
   * Determine if a value is a URLSearchParams object
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a URLSearchParams object, otherwise false
   */
  static isURLSearchParams(val) {
    return (
      typeof URLSearchParams !== "undefined" && val instanceof URLSearchParams
    )
  }

  static isBoolean(val) {
    return typeof val === "boolean"
  }
}
