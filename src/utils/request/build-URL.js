import dataType from "@/utils/data-type/data-type"
// import { forEach } from "@/utils/forEachUtil"
import objectForEach from "@/utils/object-for-each/object-for-each"

function encode(val) {
  return encodeURIComponent(val)
    .replace(/%40/gi, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",")
    .replace(/%20/g, "+")
    .replace(/%5B/gi, "[")
    .replace(/%5D/gi, "]")
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
export default function buildURL(url, params) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url
  }

  var serializedParams
  if (dataType.isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    var parts = []

    objectForEach(params, function serialize(val, key) {
      if (val === null || typeof val === "undefined") {
        return
      }

      if (dataType.isArray(val)) {
        key = key + "[]"
      } else {
        val = [val]
      }

      objectForEach(val, function parseValue(v) {
        if (dataType.isDate(v)) {
          v = v.toISOString()
        } else if (dataType.isObject(v)) {
          v = JSON.stringify(v)
        }
        parts.push(encode(key) + "=" + encode(v))
      })
    })

    serializedParams = parts.join("&")
  }

  if (serializedParams) {
    var hashMarkIndex = url.indexOf("#")
    if (hashMarkIndex !== -1) {
      url = url.slice(0, hashMarkIndex)
    }

    url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams
  }

  return url
}
