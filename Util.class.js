/**
 * A utility class for performing calculations. Contains only static members.
 * This class is *not* exported with the package.
 * @module
 */
module.exports = class Util {
  /** @private */ constructor() {}

  /**
   * Convert a decimal number to a hexadecimal number, as a string.
   * The given number must be an integer within 0–255.
   * The returned string is in lowercase.
   * @param  {number} n an integer in base 10
   * @return {string} an integer in base 16 as a string
   */
  static toHex(n) {
    return '0123456789abcdef'.charAt((n - n % 16) / 16) + '0123456789abcdef'.charAt(n % 16)
  }

  /**
   * Convert a hexadecimal number (as a string) to a decimal number.
   * The hexadecimal number must be a string of exactly 2 characters,
   * each of which is a digit `0–9` or `a–f`.
   * @param  {string} n a number in base 16 as a string
   * @return {number} a number in base 10
   */
  static toDec(n) {
    let tens, ones
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
  static components(n, s) {
    return s.slice(n, -1).split(',').map((el) => +el)
  }

  /**
   * Calculate the alpha of two or more overlapping translucent colors.
   * For two overlapping colors with respective alphas `a` and `b`, the compounded alpha
   * of an even mix will be `1 - (1-a)*(1-b)`.
   * For three, it would be `1 - (1-a)*(1-b)*(1-c)`.
   * An alpha is a number within the interval [0,1], and represents the opacity
   * of a translucent color. An alpha of 0 is completely transparent; an alpha
   * of 1 is completely opaque.
   * @param  {Array<number>} alphas an array of alphas
   * @return {number} the compounded alpha
   */
  static compoundOpacity(alphas) {
    return 1 - alphas.map((a) => 1-a).reduce((a,b) => a*b)
  }
}
