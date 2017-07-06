var Util = require('./Util.class.js')
var Color = require('./Color.class.js')

module.exports = class ColorAlpha extends Color {
  /**
   * A 32-bit color that can be displayed in a pixel, given three primary color components
   * and a transparency component.
   *
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
   * @extends Color
   * @param {Array<number>=} $rgb an array of 1 or 3 integers in [0,255]
   * @param {number=} alpha a number in [0,1]; the alpha, or opacity, of this color
   */
  constructor($rgb, alpha = 1) {
    if (Array.isArray($rgb)) {
      super($rgb)
    } else {
      super()
      alpha = (typeof $rgb === 'number') ? $rgb : 0
    }

    /**
     * The alpha component of this color. An number in [0,1].
     * @type {number}
     */
    this._ALPHA = alpha
  }


  /**
   * Get the alpha (opacity) of this color.
   * @return {number} the alpha of this color
   */
  alpha() { return this._ALPHA }


  // Convenience getter functions.
  /**
   * Return an array of RGBA components (in that order).
   * @return {Array<number>} an array of RGBA components
   */
  rgba() { return this.rgb().concat(this.alpha()) }

  /**
   * Return an array of HSVA components (in that order).
   * @return {Array<number>} an array of HSVA components
   */
  hsva() { return this.hsv().concat(this.alpha()) }

  /**
   * Return an array of HSLA components (in that order).
   * @return {Array<number>} an array of HSLA components
   */
  hsla() { return this.hsl().concat(this.alpha()) }

  /**
   * Return an array of HWBA components (in that order).
   * @return {Array<number>} an array of HWBA components
   */
  hwba() { return this.hwb().concat(this.alpha()) }


  /**
   * @override
   * @return {ColorAlpha} the complement of this color
   */
  complement() {
    return new ColorAlpha(super.complement().rgb(), this.alpha())
  }

  /**
   * @override
   * @param  {number} a the number of degrees to rotate
   * @return {ColorAlpha} a new color corresponding to this color rotated by `a` degrees
   */
  rotate(a) {
    return new ColorAlpha(super.rotate(a).rgb(), this.alpha())
  }

  /**
   * @override
   * @param  {number} p must be between -1.0 and 1.0; the value by which to saturate this color
   * @param  {boolean=} relative true if the saturation added is relative
   * @return {ColorAlpha} a new ColorAlpha object that corresponds to this color saturated by `p`
   */
  saturate(p, relative) {
    return new ColorAlpha(super.saturate(p, relative).rgb(), this.alpha())
  }

  /**
   * @override
   * @param {number} p must be between -1.0 and 1.0; the amount by which to lighten this color
   * @param {boolean=} relative true if the luminosity added is relative
   * @return {ColorAlpha} a new ColorAlpha object that corresponds to this color lightened by `p`
   */
  lighten(p, relative) {
    return new ColorAlpha(super.lighten(p, relative).rgb(), this.alpha())
  }

  /**
   * Return a new color with the complemented alpha of this color.
   * An alpha of, for example, 0.7, complemented, is 0.3 (the complement with 1.0).
   * @return {ColorAlpha} a new ColorAlpha object with the same color but complemented alpha
   */
  negative() {
    return new ColorAlpha(this.rgb(), 1 - this.alpha())
  }

  /**
   * @override
   * @param {Color} $color the second color; may also be an instance of ColorAlpha
   * @param {number=0.5} w between 0.0 and 1.0; the weight favoring the other color
   * @param {boolean=} blur if truthy, will use a more accurate calculation
   * @return {ColorAlpha} a mix of the two given colors
   */
  mix($color, w = 0.5, blur = false) {
    let newColor = super.mix($color, w, blur)
    let newAlpha = Util.compoundOpacity([this.alpha(), ($color instanceof ColorAlpha) ? $color.alpha() : 1])
    return new ColorAlpha(newColor.rgb(), newAlpha)
  }

  /**
   * @override
   * @param  {ColorAlpha} $colorAlpha a ColorAlpha object
   * @return {boolean} true if the argument is the same color as this color
   */
  equals($colorAlpha) {
    let sameAlphas = (this.alpha() === $color.alpha()) // NOTE speedy
    return sameAlphas && (this.alpha()===0 || super.equals($colorAlpha))
  }

  /**
   * Return a string representation of this color.
   * If `space === 'hex'` , return `#rrggbbaa`
   * If `space === 'hsva'`, return `hsva(h, s, v, a)`
   * If `space === 'hsla'`, return `hsla(h, s, l, a)`
   * If `space === 'hwba'`, return `hwba(h, w, b, a)` // NOTE not supported yet
   * If `space === 'rgba'`, return `rgba(r, g, b, a)` (default)
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
  toString(space) {
    let a = Math.round(this.alpha() * 1000) / 1000
    if (space === 'hex') {
      return super.toString('hex') + Util.toHex(Math.round(this.alpha()*255))
    }
    if (space === 'hsva') {
      return `hsva(${super.toString('hsv').slice(4, -1)}, ${a})`
    }
    if (space === 'hsla') {
      return `hsla(${super.toString('hsl').slice(4, -1)}, ${a})`
    }
    if (space === 'hwba') {
      return `hwba(${super.toString('hwb').slice(4, -1)}, ${a})`
    }
    return `rgba(${super.toString('rgb').slice(4, -1)}, ${a})`
  }



  /**
   * Return a new ColorAlpha object, given hue, saturation, and value in HSV-space,
   * and an alpha component.
   * The alpha must be between 0.0 and 1.0.
   * The first argument must be an array of these three values in order.
   * @see Color.fromHSV
   * @param {Array<number>} $hsv an Array of HSV components
   * @param {number} alpha the opacity
   * @return {ColorAlpha} a new ColorAlpha object with hsva(hue, sat, val, alpha)
   */
  static fromHSVA($hsv, alpha) {
    return new ColorAlpha(Color.fromHSV($hsv).rgb(), alpha)
  }

  /**
   * Return a new ColorAlpha object, given hue, saturation, and luminosity in HSL-space,
   * and an alpha component.
   * The alpha must be between 0.0 and 1.0.
   * The first argument must be an array of these three values in order.
   * @see Color.fromHSL
   * @param {Array<number>} $hsl an Array of HSL components
   * @param {number} alpha the opacity
   * @return {ColorAlpha} a new ColorAlpha object with hsla(hue, sat, lum, alpha)
   */
  static fromHSLA($hsl, alpha) {
    return new ColorAlpha(Color.fromHSL($hsl).rgb(), alpha)
  }

  /**
   * Return a new ColorAlpha object, given hue, white, and black in HWB-space,
   * and an alpha component.
   * The alpha must be between 0.0 and 1.0.
   * The first argument must be an array of these three values in order.
   * @see Color.fromHWB
   * @param {Array<number>} $hwb an Array of HWB components
   * @param {number} alpha the opacity
   * @return {ColorAlpha} a new ColorAlpha object with hwba(hue, wht, blk, alpha)
   */
  static fromHWBA($hwb, alpha) {
    return new ColorAlpha(Color.fromHWB($hwb).rgb(), alpha)
  }

  /**
   * Return a new ColorAlpha object, given a string.
   * The string may have any of the formats described in
   * {@link Color.fromString}, or it may have either of the following formats,
   * with the alpha component as a base 10 decimal between 0.0 and 1.0.
   * 1. `#rrggbbaa`, where `aa` is alpha
   * 2. `rgba(r,g,b,a)` or `rgba(r, g, b, a)`, where `a` is alpha
   * 3. `hsva(h,s,v,a)` or `hsva(h, s, v, a)`, where `a` is alpha
   * 4. `hsla(h,s,l,a)` or `hsla(h, s, l, a)`, where `a` is alpha
   * 4. `hwba(h,w,b,a)` or `hwba(h, w, b, a)`, where `a` is alpha
   * @see Color.fromString
   * @param {string} str a string of one of the forms described
   * @return {ColorAlpha} a new ColorAlpha object constructed from the given string
   */
  static fromString(str) {
    let is_opaque = Color.fromString(str)
    if (is_opaque) {
      return new ColorAlpha(is_opaque.rgb())
    }
    if (str.slice(0,1) === '#' && str.length === 9) {
      return new ColorAlpha([
        str.slice(1,3),
        str.slice(3,5),
        str.slice(5,7),
      ].map(Util.toDec), Util.toDec(str.slice(7,9))/255)
    }
    let comps = Util.components(5, str)
    if (str.slice(0,5) === 'rgba(') {
      return new ColorAlpha(comps.slice(0,3), comps[3])
    }
    if (str.slice(0,5) === 'hsva(') {
      return ColorAlpha.fromHSVA(comps.slice(0,3), comps[3])
    }
    if (str.slice(0,5) === 'hsla(') {
      return ColorAlpha.fromHSLA(comps.slice(0,3), comps[3])
    }
    if (str.slice(0,5) === 'hwba(') {
      return ColorAlpha.fromHWBA(comps.slice(0,3), comps[3])
    }
    return null
  }

  /**
   * ColorAlpha equivalent of {@see Color.mix}.
   * {@see Color#mix()} for description of `@param flag`.
   * @param {Array<Color>} $colors an array of Color (or ColorAlpha) objects, of length >=2
   * @param {boolean=} blur if truthy, will use a more accurate calculation
   * @return {ColorAlpha} a mix of the given colors
   */
  static mix($colors, blur = false) {
    let newColor = Color.mix($colors, blur)
    let newAlpha = Util.compoundOpacity($colors.map(($c) => ($c instanceof ColorAlpha) ? $c.alpha() : 1))
    return new ColorAlpha(newColor.rgb(), newAlpha)
  }
}
