/**
 * A utility class for performing calculations. Contains only static members.
 * This class is *not* exported with the package.
 * @module
 */
module.exports = class Util {
  /** @private */ constructor() {}

  // /**
  //  * Convert a decimal integer to a hexadecimal integer, as a string.
  //  * The given integer must be within 0–255.
  //  * The returned string is in lowercase.
  //  * @param  {number} n an integer in base 10
  //  * @return {string} an integer in base 16 as a string
  //  */
  // static toHex(n) {
  //   return '0123456789abcdef'.charAt((n - n % 16) / 16) + '0123456789abcdef'.charAt(n % 16)
  // }

  // /**
  //  * Convert a hexadecimal integer (as a string) to a decimal integer.
  //  * The hexadecimal integer must be a string of exactly 2 characters,
  //  * each of which is a digit `0–9`, `a–f`, or `A–F`.
  //  * @param  {string} s an integer in base 16 as a string
  //  * @return {number} a integer in base 10
  //  */
  // static toDec(s) {
  //   s = s.toLowerCase()
  //   let tens, ones
  //   for (let i = 0; i < 16; i++) {
  //     if ('0123456789abcdef'.charAt(i) === s.slice(0,1)) tens = i*16
  //     if ('0123456789abcdef'.charAt(i) === s.slice(1,2)) ones = i
  //   }
  //   return tens + ones
  // }

  // /**
  //  * Return an array of comma-separated numbers extracted from a string.
  //  * The string must be of the form `xxx(a, b, c, ...)` or `xxx(a,b,c,...)`, where
  //  * `a`, `b`, and `c`, etc. are numbers, and `xxx` is any `n-1` number of characters
  //  * (if n===4 then `xxx` must be 3 characters).
  //  * Any number of prefixed characters and comma-separated numbers may be given. Spaces are optional.
  //  * Examples:
  //  * ```
  //  * components(4, 'rgb(20, 32,044)') === [20, 32, 44]
  //  * components(5, 'hsva(310,0.7, .3, 1/2)') === [310, 0.7, 0.3, 0.5]
  //  * ```
  //  * @param  {number} n the starting point of extraction
  //  * @param  {string} s the string to dissect
  //  * @return {Array<number>} an array of numbers
  //  */
  // static components(n, s) {
  //   return s.slice(n, -1).split(',').map((el) => +el)
  // }

}
