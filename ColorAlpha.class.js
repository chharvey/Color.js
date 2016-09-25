var Util = require('./Util.class.js')
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
    if (arguments.length >= 2 && $rgb.length >= 3) {
      ;
    } else if (arguments.length >= 2) {
        return ColorAlpha.call(self, [$rgb[0], $rgb[0], $rgb[0]], alpha)
    } else if (arguments.length >= 1 && $rgb instanceof Array) {
        return ColorAlpha.call(self, $rgb, 1)
    } else if (arguments.length >= 1) {
        return ColorAlpha.call(self, [0], $rgb)
    } else /* if (arguments.length < 1) */ {
      return ColorAlpha.call(self, 0)
    }

    // call the super. if alpha===0 then this color’s rgb will be [0,0,0].
    if (alpha !== 0) { Color.call(self, $rgb) }
    else             { Color.call(self) }
    /**
     * The alpha component of this color. An number in [0,1].
     * @type {number}
     */
    self._ALPHA = alpha
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
    return new ColorAlpha(Color.prototype.rotate.call(this, a).rgb(), this.alpha())
  }

  /**
   * @override
   * @param  {number} p must be between -1.0 and 1.0; the value by which to saturate this color
   * @param  {boolean=} relative true if the saturation added is relative
   * @return {ColorAlpha} a new ColorAlpha object that corresponds to this color saturated by `p`
   */
  ColorAlpha.prototype.saturate = function saturate(p, relative) {
    return new ColorAlpha(Color.prototype.saturate.call(this, p, relative).rgb(), this.alpha())
  }

  /**
   * @override
   * @param {number} p must be between -1.0 and 1.0; the amount by which to lighten this color
   * @param {boolean=} relative true if the luminosity added is relative
   * @return {ColorAlpha} a new ColorAlpha object that corresponds to this color lightened by `p`
   */
  // CHANGED DEPRECATED v2 remove
  ColorAlpha.prototype.brighten = function brighten(p, relative) {
    return this.lighten(p, relative)
  }
  ColorAlpha.prototype.lighten = function lighten(p, relative) {
    return new ColorAlpha(Color.prototype.lighten.call(this, p, relative).rgb(), this.alpha())
  }

  /**
   * Return a new color with the complemented alpha of this color.
   * An alpha of, for example, 0.7, complemented, is 0.3 (the complement with 1.0).
   * @return {ColorAlpha} a new ColorAlpha object with the same color but complemented alpha
   */
  ColorAlpha.prototype.negative = function negative() {
    return new ColorAlpha(this.rgb(), 1 - this.alpha())
  }

  /**
   * @override
   * @param {Color} $color the second color; may also be an instance of ColorAlpha
   * @param {number=0.5} w between 0.0 and 1.0; the weight favoring the other color
   * @return {ColorAlpha} a mix of the two given colors
   */
  ColorAlpha.prototype.mix = function mix($color, w) {
    var newColor = Color.prototype.mix.call(this, $color, w)
    var newAlpha = (function compoundOpacity(a, b) {
      return 1 - ( (1-a) * (1-b) )
    })(this.alpha(), ($color instanceof ColorAlpha) ? $color.alpha() : 1)
    return new ColorAlpha(newColor.rgb(), newAlpha)
  }

  /**
   * @override
   * @param  {ColorAlpha} $colorAlpha a ColorAlpha object
   * @return {boolean} true if the argument is the same color as this color
   */
  ColorAlpha.prototype.equals = function equals($colorAlpha) {
    var sameAlphas = (this.alpha() === $color.alpha()) // NOTE speedy
    return sameAlphas && (this.alpha()===0 || Color.prototype.equals.call(this, $colorAlpha))
  }

  /**
   * Return a string representation of this color.
   * If `space === 'hex'`,  return `#rrggbbaa`
   * If `space === 'hsva'`, return `hsva(h, s, v, a)`
   * If `space === 'hsla'`, return `hsla(h, s, l, a)`
   * If `space === 'rgba'` (default), return `rgba(r, g, b, a)`
   * The format of the numbers returned will be as follows:
   * - all HEX values for RGB, and hue/sat/val/lum will be of the same format as described in
   *   {@link Color#toString}
   * - all alpha values will be base 10 decimals in [0,1], rounded to the nearest 0.001
   * IDEA may change the default to 'hex' instead of 'rgba', once browsers support ColorAlpha hex (#rrggbbaa)
   * https://drafts.csswg.org/css-color/#hex-notation
   * @override
   * @param {string='rgba'} space represents the space in which this color exists
   * @return {string} a string representing this color.
   */
  ColorAlpha.prototype.toString = function toString(space) {
    var a = Math.round(this.alpha() * 1000) / 1000
    // CHANGED v2 remove 'hexa'
    if (space === 'hex' || space==='hexa') {
      return Color.prototype.toString.call(this, 'hex') + Util.toHex(this.alpha()*255)
    }
    if (space === 'hsva') {
      return Color.prototype.toString.call(this,' hsv').slice(0, -1) + ', ' + a + ')'
      // return `${Color.prototype.toString.call(this, 'hsv').slice(0, -1)}, ${a})` // CHANGED ES6
    }
    if (space === 'hsla') {
      return Color.prototype.toString.call(this, 'hsl').slice(0, -1) + ', ' + a + ')'
      // return `${Color.prototype.toString.call(this, 'hsl').slice(0, -1)}, ${a})` // CHANGED ES6
    }
    return Color.prototype.toString.call(this, 'rgb').slice(0, -1) + ', ' + a + ')'
    // return `${Color.prototype.toString.call(this, 'rgb').slice(0, -1)}, ${a})` // CHANGED ES6
  }


  // STATIC MEMBERS
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

  /**
   * Return a new Color object, given a string.
   * The string may have any of the formats described in
   * {@link Color.fromString}, or it may have either of the following formats,
   * with the alpha component as a base 10 decimal between 0.0 and 1.0.
   * 1. `#rrggbbaa`, where `aa` is alpha
   * 2. `rgba(r,g,b,a)` or `rgba(r, g, b, a)`, where `a` is alpha
   * 3. `hsva(h,s,v,a)` or `hsva(h, s, v, a)`, where `a` is alpha
   * 4. `hsla(h,s,l,a)` or `hsla(h, s, l, a)`, where `a` is alpha
   * @see Color.fromString
   * @param {string} str a string of one of the forms described
   * @param {function} callback a function to call if all else fails
   * @return {ColorAlpha} a new ColorAlpha object constructed from the given string
   */
  ColorAlpha.fromString = function fromString(str) {
    var is_opaque = Color.fromString(str)
    if (is_opaque) {
      return new ColorAlpha(is_opaque.rgb())
    }
    if (str.slice(0,1) === '#' && str.length === 9) {
      return new ColorAlpha([
        str.slice(1,3)
      , str.slice(3,5)
      , str.slice(5,7)
      ].map(Util.toDec), Util.toDec(str.slice(7,9))/255)
    }
    if (str.slice(0,5) === 'rgba(') {
      var comps = Util.components(5, str)
      return new ColorAlpha(comps.slice(0,3), comps[3])
    }
    if (arg.slice(0,5) === 'hsva(') {
      return ColorAlpha.fromHSVA.apply(null, Util.components(5, str))
    }
    if (arg.slice(0,5) === 'hsla(') {
      return ColorAlpha.fromHSLA.apply(null, Util.components(5, str))
    }
    return null
  }

  return Color
})()
