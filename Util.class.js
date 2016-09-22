/**
 * A utility class for performing calculations. Contains only static members.
 * This class is *not* exported with the package.
 * @type {Util}
 */
module.exports = (function () {
  // CONSTRUCTOR
  function Util() {}


  // ACCESSOR FUNCTIONS

  // METHODS

  // STATIC MEMBERS
  /**
   * Convert a decimal number to a hexadecimal number, as a string.
   * The number must be within 0–255.
   * The returned string is in lowercase.
   * @param  {number} n a number in base 10
   * @return {string} a number in base 16 as a string
   */
  Util.toHex = function toHex(n) {
    return '0123456789abcdef'.charAt((n - n % 16) / 16) + '0123456789abcdef'.charAt(n % 16)
  }

  /**
   * Convert a hexadecimal number (as a string) to a decimal number.
   * The hexadecimal number must be a string of exactly 2 characters,
   * each of which is a digit `0–9` or `a–f`.
   * @param  {string} n a number in base 16 as a string
   * @return {number} a number in base 10
   */
  Util.toDec = function toDec(n) {
    var tens, ones
    for (var i = 0; i < 16; i++) {
      if ('0123456789abcdef'.charAt(i) === n.slice(0,1)) tens = i*16
      if ('0123456789abcdef'.charAt(i) === n.slice(1,2)) ones = i
    }
    return tens + ones
  }

  /**
   * Return an array of comma-separated numbers extracted from a string.
   * The string must be of the form `xxx(a, b, c, ...)` or `xxx(a,b,c,...)`, where
   * `a`, `b`, and `c`, etc. are numbers, and `xxx` is any `n-1` number of characters
   * (if n===4 then `xxx` must be 3 characters).
   * Any number of prefixed characters and comma-separated numbers may be given. Spaces are optional.
   * Examples:
   * ```
   * components(4, 'rgb(20, 32,044)') === [20, 32, 44]
   * components(5, 'hsva(310,0.7, .3, 1/2)') === [310, 0.7, 0.3, 0.5]
   * ```
   * @param  {number} n the starting point of extraction
   * @param  {string} s the string to dissect
   * @return {Array<number>} an array of numbers
   */
  Util.components = function components(n, s) {
    return s.slice(n, -1).split(',').map(function (el) { return +el })
  }

  return Util
})()
