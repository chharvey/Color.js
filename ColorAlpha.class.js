var Color = require('./Color.class.js')

/**
 * A 32-bit color that can be displayed in a pixel, given three primary color components
 * and a transparency component.
 * @type {ColorAlpha}
 * @extends Color
 */
module.exports = (function () {
  // CONSTRUCTOR
  /**
   * Construct a ColorAlpha object.
   * Valid parameters:
   * - new ColorAlpha([60, 120, 240], 0.7) // [red, green, blue], alpha (translucent, rgba(r, g, b, alpha))
   * - new ColorAlpha([192], 0.7)          // [grayscale], alpha        (translucent, rgba(r, r, r, alpha))
   * - new ColorAlpha([60, 120, 240])      // [red, green, blue]        (opaque, rgba(r, g, b, 1.0))
   * - new ColorAlpha([192])               // [grayscale]               (opaque, rgba(r, r, r, 1.0))
   * - new ColorAlpha(0.7)                 // alpha                     (rgba(0, 0, 0, alpha), translucent black)
   * - new ColorAlpha()                    //                           (rgba(0, 0, 0, 0.0), transparent)
   * You may pass both an RGB array and an alpha, or either one, or neither.
   * See {@see Color} for specs on the RGB array. The alpha must be a (decimal) number 0–1.
   * If RGB is given, alpha defaults to 1.0 (opaque).
   * If no RGB is given, alpha defaults to 0.0 (transparent).
   * @constructor
   * @param {Array<number>=[0]} $rgb an array of 1 or 3 integers in [0,255]
   * @param {number=(1|0)} alpha a number in [0,1]; the alpha, or opacity, of this color
   */
  function ColorAlpha($rgb, alpha) {
    var self = this
    if (arguments.length >= 2) {
      if ($rgb && $rgb.length >= 3) {
        if (alpha !== 0) { Color.call(self, $rgb) }
        else             { Color.call(self) }
        self._ALPHA = alpha
      } else if ($rgb && $rgb.length >= 1) {
        ColorAlpha.call(self, [$rgb[0], $rgb[0], $rgb[0]], alpha); return
      } else {
        ColorAlpha.call(self, [0], alpha); return
      }
    } else if (arguments.length >= 1) {
      if ($rgb instanceof Array) {
        ColorAlpha.call(self, $rgb, 1); return
      } else {
        ColorAlpha.call(self, [0], $rgb); return
      }
    } else {
      ColorAlpha.call(self, 0); return
    }
  }
  ColorAlpha.prototype = Object.create(Color.prototype)
  ColorAlpha.prototype.constructor = ColorAlpha


  // ACCESSOR FUNCTIONS
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
    return new ColorAlpha(Color.prototype.complement.call(this).rgb(), this.alpha())
  }

  /**
   * @override
   * @param  {number} a the number of degrees to rotate
   * @return {ColorAlpha} a new color corresponding to this color rotated by `a` degrees
   */
  ColorAlpha.prototype.rotate = function rotate(a) {
    return new ColorAlpha(Color.prototype.rotate.call(this).rgb(), this.alpha())
  }

  /**
   * @override
   * @param  {number} p must be between -1.0 and 1.0; the value by which to saturate this color
   * @param  {boolean=} relative true if the saturation added is relative
   * @return {ColorAlpha} a new ColorAlpha object that corresponds to this color saturated by `p`
   */
  ColorAlpha.prototype.saturate = function saturate(p, relative) {
    return new ColorAlpha(Color.prototype.saturate.call(this).rgb(), this.alpha())
  }

  /**
   * @override
   * @param {number} p must be between -1.0 and 1.0; the amount by which to lighten this color
   * @param {boolean=} relative true if the luminosity added is relative
   * @return {ColorAlpha} a new ColorAlpha object that corresponds to this color brightened by `p`
   */
  ColorAlpha.prototype.brighten = function brighten(p, relative) {
    return new ColorAlpha(Color.prototype.brighten.call(this).rgb(), this.alpha())
  }

  /**
   * Return a new color with the complemented alpha of this color.
   * An alpha of, for example, 0.7, complemented, is 0.3 (the complement with 1.0).
   * @return {ColorAlpha} a new ColorAlpha object with the same color but complemented alpha
   */
  Color.prototype.negative = function negative() {
    return new ColorAlpha(this.rgb(), 1 - this.alpha())
  }

  /**
   * @override
   * @param {Color} $colorAlpha the second color
   * @param {number=0.5} w between 0.0 and 1.0; the weight favoring the other color
   * @return {ColorAlpha} a mix of the two given colors
   */
  ColorAlpha.prototype.mix = function mix($colorAlpha, w) {
    var newColor = Color.prototype.mix.call(this, $colorAlpha, w)
    var newAlpha = (function compoundOpacity(a, b) {
      return 1 - ( (1-a) * (1-b) )
    })(this.alpha(), $colorAlpha.alpha())
    return new ColorAlpha(newColor.rgb(), newAlpha)
  }

  /**
   * @override
   * @param  {ColorAlpha} $colorAlpha a ColorAlpha object
   * @return {boolean} true if the argument is the same color as this color
   */
  ColorAlpha.prototype.equals = function equals($colorAlpha) {
    var sameAlphas = (this.alpha() === $color.alpha()) // NOTE speedy
    return sameAlphas && (this.isTransparent() || Color.prototype.equals.call(this, $colorAlpha))
  }

  /**
   * Tests whether this color is transparent.
   * A color is transparent if and only if its alpha is zero.
   * @return {boolean} true if this color’s alpha equals 0
   */
  ColorAlpha.prototype.isTransparent = function isTransparent() {
    return this.alpha() === 0
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
    var splitted = rgba_string.slice(5, -1).split(',').map(function (el) { return +el })
    return new ColorAlpha(new Color(splitted).rgb(), splitted[3])
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
    return new ColorAlpha(Color.fromHSV(hue, sat, val).rgb(), alpha)
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
    return new ColorAlpha(Color.fromHSL(hue, sat, lum).rgb(), alpha)
  }

  return Color
})()
