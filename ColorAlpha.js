var Color = require('./index.js')

/**
 * A 256-bit color that can be displayed in a pixel, given three primary color components
 * and a transparency component.
 * @type {ColorAlpha}
 */
module.exports = (function () {
  // CONSTRUCTOR
  /**
   * Construct a ColorAlpha object, given
   * four arguments (RGB & alpha),
   * three arguments (RGB),
   * two arguments (grayscale & alpha || a Color & alpha),
   * one argument (black w/ alpha || a Color), or
   * zero arguments (transparent)
   * @constructor
   * @param {(Color|number=0)} red an integer in [0, 255]; the red component of this color
   * @param {number=red} grn an integer in [0, 255]; the green component of this color
   * @param {number=red} blu an integer in [0, 255]; the blue component of this color
   * @param {number=0} alpha a number in [0, 1]; the alpha, or opacity, of this color
   */
  function ColorAlpha(red, grn, blu, alpha) {
    if (arguments.length >= 3) {
      Color.call(self, red, grn, blu)
      self._ALPHA = alpha || 0
    } else if (arguments.length === 2) {
      if (red instanceof Color) {
        Color.call(self, red.red(), red.green(), red.blue())
      } else {
        Color.call(self, red)
      }
      self._ALPHA = grn
    } else {
      if (red instanceof Color) {
        Color.call(self, red.red(), red.green(), red.blue())
        self._ALPHA = 0
      } else {
        Color.call(self)
        self._ALPHA = red || 0
      }
    }
  }
  ColorAlpha.prototype = Object.create(Color.prototype)
  ColorAlpha.prototype.constructor = ColorAlpha


  // ACCESSOR FUNCTIONS
  /**
   * Get the opaque base color of this color.
   * @return {Color} the base color
   */
  ColorAlpha.prototype.color = function color() { return new Color(this.red(), this.green(), this.blue()) }
  /**
   * Get the alpha (opacity) of this color.
   * @return {number} the alpha of this color
   */
  ColorAlpha.prototype.alpha = function alpha() { return this._ALPHA }


  // Convenience getter functions.
  /**
   * Return an array of RGBA components (in that order).
   * @return {Array<number>} an array of RGBA components
   */
  ColorAlpha.prototype.rgba = function rgba() { return this.rgb().concat(this.alpha()) }
  /**
   * Return an array of HSVA components (in that order).
   * @return {Array<number>} an array of HSVA components
   */
  ColorAlpha.prototype.hsva = function hsva() { return this.hsv().concat(this.alpha()) }
  /**
   * Return an array of HSLA components (in that order).
   * @return {Array<number>} an array of HSLA components
   */
  ColorAlpha.prototype.hsla = function hsla() { return this.hsl().concat(this.alpha()) }


  // METHODS

  /**
   * @override
   * @return {ColorAlpha} the complement of this color
   */
  ColorAlpha.prototype.complement = function complement() {
    return new ColorAlpha(Color.prototype.complement.call(this), this.alpha())
  }

  /**
   * @override
   * @param  {number} a the number of degrees to rotate
   * @return {ColorAlpha} a new color corresponding to this color rotated by `a` degrees
   */
  ColorAlpha.prototype.rotate = function rotate(a) {
    return new ColorAlpha(Color.prototype.rotate.call(this), this.alpha())
  }

  /**
   * @override
   * @param  {number} p must be between -1.0 and 1.0; the value by which to saturate this color
   * @param  {boolean=} relative true if the saturation added is relative
   * @return {ColorAlpha} a new ColorAlpha object that corresponds to this color saturated by `p`
   */
  ColorAlpha.prototype.saturate = function saturate(p, relative) {
    return new ColorAlpha(Color.prototype.saturate.call(this), this.alpha())
  }

  /**
   * @override
   * @param {number} p must be between -1.0 and 1.0; the amount by which to lighten this color
   * @param {boolean=} relative true if the luminosity added is relative
   * @return {ColorAlpha} a new ColorAlpha object that corresponds to this color brightened by `p`
   */
  ColorAlpha.prototype.brighten = function brighten(p, relative) {
    return new ColorAlpha(Color.prototype.brighten.call(this), this.alpha())
  }

  /**
   * Return a new color with the complemented alpha of this color.
   * An alpha of, for example, 0.7, complemented, is 0.3 (the complement with 1.0).
   * @return {ColorAlpha} a new ColorAlpha object with the same color but complemented alpha
   */
  Color.prototype.negative = function negative() {
    return new ColorAlpha(this.color(), 1 - this.alpha())
  }

  /**
   * @override
   * @param {Color} $colorAlpha the second color
   * @param {number=0.5} w between 0.0 and 1.0; the weight favoring the other color
   * @return {ColorAlpha} a mix of the two given colors
   */
  ColorAlpha.prototype.mix = function mix($colorAlpha, w) {
    var newColor = Color.prototype.mix.call(this, $colorAlpha.color())
    var newAlpha // TODO calculate this
    return new ColorAlpha(newColor, newAlpha)
  }

  /**
   * @override
   * @param  {ColorAlpha} $colorAlpha a ColorAlpha object
   * @return {boolean} true if the argument is the same color as this color
   */
  ColorAlpha.prototype.equals = function equals($colorAlpha) {
    return Color.prototype.equals.call(this)
      && this.alpha() === $color.alpha()
  }

  /**
   * Return a string representation of this color.
   * If `space === 'hsva'`, return `hsva(h, s, v, a)`
   * If `space === 'hsla'`, return `hsla(h, s, l, a)`
   * If `space === 'rgba'` (default), return `rgba(r, g, b, a)`
   * @override
   * @param {string='rgba'} space represents the space in which this color exists
   * @return {string} a string representing this color.
   */
  ColorAlpha.prototype.toString = function toString(space) {
    if (space === 'hsva') return 'hsva(' + this.hsvHue()  + ', ' + this.hsvSat() + ', ' + this.hsvVal() + ', ' + this.alpha() + ')'
    if (space === 'hsla') return 'hsla(' + this.hslHue()  + ', ' + this.hslSat() + ', ' + this.hslLum() + ', ' + this.alpha() + ')'
                          return 'rgba(' + this.red()     + ', ' + this.green()  + ', ' + this.blue()   + ', ' + this.alpha() + ')'
    // CHANGED ES6
    // if (space === 'hsva') return `hsva(${this.hsvHue()}, ${this.hsvSat()}, ${this.hsvVal()}, ${this.alpha()})`
    // if (space === 'hsla') return `hsla(${this.hslHue()}, ${this.hslSat()}, ${this.hslLum()}, ${this.alpha()})`
    //                       return `rgba(${this.red()   }, ${this.green() }, ${this.blue()  }, ${this.alpha()})`
  }


  // STATIC MEMBERS
  /**
   * Return a new ColorAlpha object, given a string of the form `rgba(r,g,b,a)` or `rgba(r, g, b, a)`,
   * where `r`, `g`, and `b` are decimal RGB components (in base 10, out of 255),
   * and `a` is the alpha component (a base 10 decimal between 0.0 and 1.0).
   * @param {string} rgba_string a string of the form `rgba(r,g,b,a)` or `rgba(r, g, b, a)`
   * @return {ColorAlpha} a new ColorAlpha object constructed from the given rgba string
   */
  ColorAlpha.fromRGBA = function fromRGBA(rgba_string) {
    var splitted = rgba_string.slice(5, -1).split(',')
    return new ColorAlpha(+splitted[0], +splitted[1], +splitted[2], +splitted[3])
  }

  /**
   * Return a new ColorAlpha object, given hue, saturation, and value in HSV-space,
   * and an alpha channel.
   * @param {number} hue must be between 0 and 360; hue in HSV-space
   * @param {number} sat must be between 0.0 and 1.0; saturation in HSV-space
   * @param {number} val must be between 0.0 and 1.0; brightness in HSV-space
   * @param {number} alpha must be between 0.0 and 1.0; alpha (opacity)
   * @return {ColorAlpha} a new ColorAlpha object with hsva(hue, sat, val, alpha)
   */
  ColorAlpha.fromHSVA = function fromHSVA(hue, sat, val, alpha) {
    return new ColorAlpha(Color.fromHSV(hue, sat, val), alpha)
  }

  /**
   * Return a new Color object, given hue, saturation, and luminosity in HSL-space,
   * and an alpha channel.
   * @param {number} hue must be between 0 and 360; hue in HSL-space (same as hue in HSV-space)
   * @param {number} sat must be between 0.0 and 1.0; saturation in HSL-space
   * @param {number} lum must be between 0.0 and 1.0; luminosity in HSL-space
   * @param {number} alpha must be between 0.0 and 1.0; alpha (opacity)
   * @return {ColorAlpha} a new ColorAlpha object with hsla(hue, sat, lum, alpha)
   */
  ColorAlpha.fromHSLA = function fromHSLA(hue, sat, lum, alpha) {
    return new ColorAlpha(Color.fromHSL(hue, sat, lum), alpha)
  }

  return Color
})()
