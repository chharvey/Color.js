var Util = require('./Util.class.js')
var Color = require('./Color.class.js')

/**
 * A 32-bit color that can be displayed in a pixel, given three primary color components
 * and a transparency component.
 * @extends Color
 * @module
 */
module.exports = class ColorAlpha extends Color {
  /**
   * Construct a ColorAlpha object.
   * Calling `new ColorAlpha()` (no arguments) will result in black (#000000FF).
   * @param {number=} red   the red   component of this color (an integer 0—255)
   * @param {number=} green the green component of this color (an integer 0—255)
   * @param {number=} blue  the blue  component of this color (an integer 0—255)
   * @param {number=} alpha a number in [0,1]; the alpha, or opacity, of this color
   */
  constructor(red = 0, green = 0, blue = 0, alpha = 1) {
    super(red, green, blue)

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
  get alpha() { return this._ALPHA }


  // Convenience getter functions.
  /**
   * Return an array of RGBA components (in that order).
   * @return {Array<number>} an array of RGBA components
   */
  get rgba() { return this.rgb.concat(this.alpha) }

  /**
   * Return an array of HSVA components (in that order).
   * @return {Array<number>} an array of HSVA components
   */
  get hsva() { return this.hsv.concat(this.alpha) }

  /**
   * Return an array of HSLA components (in that order).
   * @return {Array<number>} an array of HSLA components
   */
  get hsla() { return this.hsl.concat(this.alpha) }

  /**
   * Return an array of HWBA components (in that order).
   * @return {Array<number>} an array of HWBA components
   */
  get hwba() { return this.hwb.concat(this.alpha) }


  /**
   * @override
   * @return {ColorAlpha} the complement of this color
   */
  complement() {
    return new ColorAlpha(...super.complement().rgb, this.alpha)
  }

  /**
   * @override
   * @return {ColorAlpha} a new color corresponding to this color rotated by `a` degrees
   */
  rotate(a) {
    return new ColorAlpha(...super.rotate(a).rgb, this.alpha)
  }

  /**
   * @override
   * @return {ColorAlpha} a new ColorAlpha object that corresponds to this color saturated by `p`
   */
  saturate(p, relative) {
    return new ColorAlpha(...super.saturate(p, relative).rgb, this.alpha)
  }

  /**
   * @override
   * @return {ColorAlpha} a new ColorAlpha object that corresponds to this color lightened by `p`
   */
  lighten(p, relative) {
    return new ColorAlpha(...super.lighten(p, relative).rgb, this.alpha)
  }

  /**
   * Return a new color with the complemented alpha of this color.
   * An alpha of, for example, 0.7, complemented, is 0.3 (the complement with 1.0).
   * @return {ColorAlpha} a new ColorAlpha object with the same color but complemented alpha
   */
  negative() {
    return new ColorAlpha(...this.rgb, 1 - this.alpha)
  }

  /**
   * @override
   * @param {Color} $color the second color; may also be an instance of ColorAlpha
   */
  mix($color, w = 0.5) {
    let newColor = super.mix($color, w)
    let newAlpha = Util.compoundOpacity([this.alpha, ($color instanceof ColorAlpha) ? $color.alpha : 1])
    return new ColorAlpha(...newColor.rgb, newAlpha)
  }

  /**
   * @override
   * @param {Color} $color the second color; may also be an instance of ColorAlpha
   */
  blur($color, w = 0.5) {
    let newColor = super.blur($color, w)
    let newAlpha = Util.compoundOpacity([this.alpha, ($color instanceof ColorAlpha) ? $color.alpha : 1])
    return new ColorAlpha(...newColor.rgb, newAlpha)
  }

  /**
   * @override
   * @param  {ColorAlpha} $colorAlpha a ColorAlpha object
   */
  equals($colorAlpha) {
    let sameAlphas = (this.alpha === $color.alpha) // NOTE speedy
    return sameAlphas && (this.alpha===0 || super.equals($colorAlpha))
  }

  /**
   * @override
   * Return a string representation of this color.
   * See {@link ColorAlpha.ColorSpace} for types of arguments accepted.
   * The format of the numbers returned will be as follows:
   * - all HEX values for RGB, and hue/sat/val/lum will be of the same format as described in {@link Color#toString}
   * - all alpha values will be base 10 decimals in [0,1], rounded to the nearest 0.001
   * IDEA may change the default to `.HEXA` instead of `.RGBA`, once browsers support ColorAlpha hex (#rrggbbaa)
   * @see https://drafts.csswg.org/css-color/#hex-notation
   * @param {ColorAlpha.ColorSpace=} space represents the space in which this color exists
   * @return {string} a string representing this color.
   */
  toString(space = ColorAlpha.ColorSpace.RGBA) {
    if (space === ColorAlpha.ColorSpace.HEXA) {
      return `${super.toString(Color.ColorSpace.HEX)}${Util.toHex(Math.round(this.alpha * 255))}`
    }
    let superstring = super.toString(space.slice(0,-1)).slice(4,-1) // converts `'hwb(h, w, b)'` -> `'h, w, b'`
    let a = Math.round(this.alpha * 1000) / 1000
    return `${space}(${superstring}, ${a})`
  }



  /**
   * Return a new ColorAlpha object, given hue, saturation, and value in HSV-space,
   * and an alpha component.
   * The alpha must be between 0.0 and 1.0.
   * @see Color.fromHSV
   * @param {number=} hue the HSV-hue component of this color (a number 0—360)
   * @param {number=} sat the HSV-sat component of this color (a number 0—1)
   * @param {number=} val the HSV-val component of this color (a number 0—1)
   * @param {number=} alpha the opacity (a number 0—1)
   * @return {ColorAlpha} a new ColorAlpha object with hsva(hue, sat, val, alpha)
   */
  static fromHSVA(hue = 0, sat = 0, val = 0, alpha = 1) {
    return new ColorAlpha(...Color.fromHSV(hue, sat, val).rgb, alpha)
  }

  /**
   * Return a new ColorAlpha object, given hue, saturation, and luminosity in HSL-space,
   * and an alpha component.
   * The alpha must be between 0.0 and 1.0.
   * @see Color.fromHSL
   * @param {number=} hue the HSL-hue component of this color (a number 0—360)
   * @param {number=} sat the HSL-sat component of this color (a number 0—1)
   * @param {number=} lum the HSL-lum component of this color (a number 0—1)
   * @param {number=} alpha the opacity (a number 0—1)
   * @return {ColorAlpha} a new ColorAlpha object with hsla(hue, sat, lum, alpha)
   */
  static fromHSLA(hue = 0, sat = 0, lum = 0, alpha) {
    return new ColorAlpha(...Color.fromHSL(hue, sat, lum).rgb, alpha)
  }

  /**
   * Return a new ColorAlpha object, given hue, white, and black in HWB-space,
   * and an alpha component.
   * The alpha must be between 0.0 and 1.0.
   * @see Color.fromHWB
   * @param {number=} hue the HWB-hue component of this color (a number 0—360)
   * @param {number=} wht the HWB-wht component of this color (a number 0—1)
   * @param {number=} blk the HWB-blk component of this color (a number 0—1)
   * @param {number} alpha the opacity
   * @return {ColorAlpha} a new ColorAlpha object with hwba(hue, wht, blk, alpha)
   */
  static fromHWBA(hue = 0, wht = 0, blk = 0, alpha) {
    return new ColorAlpha(...Color.fromHWB(hue, wht, blk).rgb, alpha)
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
    str = str.trim()
    let is_opaque = Color.fromString(str)
    if (is_opaque) {
      return new ColorAlpha(...is_opaque.rgb)
    }
    if (str.slice(0,1) === '#' && str.length === 9) {
      return new ColorAlpha(...[
        str.slice(1,3),
        str.slice(3,5),
        str.slice(5,7),
      ].map(Util.toDec), Util.toDec(str.slice(7,9))/255)
    }
    let returned = {
      'rgba(': (comps) => new ColorAlpha     (...comps),
      'hsva(': (comps) => ColorAlpha.fromHSVA(...comps),
      'hsla(': (comps) => ColorAlpha.fromHSLA(...comps),
      'hwba(': (comps) => ColorAlpha.fromHWBA(...comps),
      default: (comps) => null,
    }
    return (returned[str.slice(0,5)] || returned.default).call(null, Util.components(5, str))
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
    let newAlpha = Util.compoundOpacity($colors.map(($c) => ($c instanceof ColorAlpha) ? $c.alpha : 1))
    return new ColorAlpha(...newColor.rgb, newAlpha)
  }

  /**
   * Enum for the types of string representations of colors.
   * @enum {string}
   */
  static get ColorSpace() {
    return {
      /* Example: #rrggbbaa */       HEXA: 'hexa',
      /* Example: rgb(r, g, b, a) */ RGBA: 'rgba',
      /* Example: hsv(h, s, v, a) */ HSVA: 'hsva',
      /* Example: hsl(h, s, l, a) */ HSLA: 'hsla',
      /* Example: hwb(h, w, b, a) */ HWBA: 'hwba',
    }
  }
}
