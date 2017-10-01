/**
 * A 24/32-bit color ("True Color") that can be displayed in a pixel, given three primary color components
 * and a possible transparency component.
 * @class
 */
class Color {
  /**
   *
   * @summary Construct a Color object.
   * @description Calling `new Color(r, g, b, a)` (4 arguments) specifies default behavior.
   * Calling `new Color(r, g, b)` (3 arguments) will result in an opaque color (`#rrggbbFF`),
   * where the alpha is 1 by default.
   * Calling `new Color()` (no arguments) will result in transparent (`#00000000`).
   * @version STABLE
   * @param {number=} r the red   component of this color (an integer 0—255)
   * @param {number=} g the green component of this color (an integer 0—255)
   * @param {number=} b the blue  component of this color (an integer 0—255)
   * @param {number=} a the alpha component of this color (a number 0–1)
   */
  constructor(r = 0, g = 0, b = 0, a = 1) {
    if (arguments.length === 0) a = 0

    /**
     * @summary The red component of this color. An integer in [0,255].
     * @type {number}
     * @private
     * @final
     */
    this._RED = Math.round(Math.max(0, Math.min(r, 255)))

    /**
     * @summary The green component of this color. An integer in [0,255].
     * @type {number}
     * @private
     * @final
     */
    this._GREEN = Math.round(Math.max(0, Math.min(g, 255)))

    /**
     * @summary The blue component of this color. An integer in [0,255].
     * @type {number}
     * @private
     * @final
     */
    this._BLUE = Math.round(Math.max(0, Math.min(b, 255)))

    /**
     * @summary The alpha component of this color. An number in [0,1].
     * @type {number}
     * @private
     * @final
     */
    this._ALPHA = Math.max(0, Math.min(a, 1))

    /** @private */ this._max    = Math.max(this._RED, this._GREEN, this._BLUE) / 255
    /** @private */ this._min    = Math.min(this._RED, this._GREEN, this._BLUE) / 255
    /** @private */ this._chroma = this._max - this._min
  }



  /**
   * @summary Calculate the alpha of two or more overlapping translucent colors.
   * @description For two overlapping colors with respective alphas `a` and `b`, the compounded alpha
   * of an even mix will be `1 - (1-a)*(1-b)`.
   * For three, it would be `1 - (1-a)*(1-b)*(1-c)`.
   * An alpha is a number within the interval [0,1], and represents the opacity
   * of a translucent color. An alpha of 0 is completely transparent; an alpha
   * of 1 is completely opaque.
   * @private
   * @version EXPERIMENTAL
   * @param  {Array<number>} alphas an array of alphas
   * @return {number} the compounded alpha
   */
  static _compoundOpacity(alphas) {
    return 1 - alphas.map((a) => 1-a).reduce((a,b) => a*b)
  }



  /**
   * @summary Get the red component of this color.
   * @version LOCKED
   * @type {number}
   */
  get red() { return this._RED }

  /**
   * @summary Get the green component of this color.
   * @version LOCKED
   * @type {number}
   */
  get green() { return this._GREEN }

  /**
   * @summary Get the blue component of this color.
   * @version LOCKED
   * @type {number}
   */
  get blue() { return this._BLUE }

  /**
   * @summary Get the alpha (opacity) of this color.
   * @version LOCKED
   * @type {number}
   */
  get alpha() { return this._ALPHA }



  /**
   * @summary Get the hsv-hue of this color.
   * @description The HSV-space hue of this color, or what "color" this color is.
   * A number bound by [0, 360).
   * @version LOCKED
   * @type {number}
   */
  get hsvHue() {
    if (this._chroma === 0) return 0
    let rgb_norm = [
      this._RED   / 255,
      this._GREEN / 255,
      this._BLUE  / 255,
    ]
    return [
      (r, g, b) => ((g - b) / this._chroma + 6) % 6 * 60,
      (r, g, b) => ((b - r) / this._chroma + 2)     * 60,
      (r, g, b) => ((r - g) / this._chroma + 4)     * 60,
    ][rgb_norm.indexOf(this._max)](...rgb_norm)
    /*
     * Exercise: prove:
     * _HSV_HUE === Math.atan2(Math.sqrt(3) * (g - b), 2*r - g - b)
     */
  }

  /**
   * @summary Get the hsv-saturation of this color.
   * @description The vividness of this color. A lower saturation means the color is closer to white,
   * a higher saturation means the color is more true to its hue.
   * A number bound by [0, 1].
   * @version LOCKED
   * @type {number}
   */
  get hsvSat() {
    return (this._chroma === 0) ? 0 : this._chroma / this.hsvVal
  }

  /**
   * @summary Get the hsv-value of this color.
   * @description The brightness of this color. A lower value means the color is closer to black, a higher
   * value means the color is more true to its hue.
   * A number bound by [0, 1].
   * @version LOCKED
   * @type {number}
   */
  get hsvVal() {
    return this._max
  }



  /**
   * @summary Get the hsl-hue of this color.
   * @description The Hue of this color. Identical to {@link Color#hsvHue}.
   * A number bound by [0, 360).
   * @version LOCKED
   * @type {number}
   */
  get hslHue() {
    return this.hsvHue
  }

  /**
   * @summary Get the hsl-saturation of this color.
   * @description The amount of "color" in the color. A lower saturation means the color is more grayer,
   * a higher saturation means the color is more colorful.
   * A number bound by [0, 1].
   * @version LOCKED
   * @type {number}
   */
  get hslSat() {
    return (this._chroma === 0) ? 0 : (this._chroma / ((this.hslLum <= 0.5) ? 2*this.hslLum : (2 - 2*this.hslLum)))
    /*
     * Exercise: prove:
     * _HSL_SAT === _chroma / (1 - Math.abs(2*this.hslLum - 1))
     * Proof:
     * denom == (function (x) {
     *   if (x <= 0.5) return 2x
     *   else          return 2 - 2x
     * })(_HSL_LUM)
     * Part A. Let x <= 0.5. Then 2x - 1 <= 0, and |2x - 1| == -(2x - 1).
     * Then 1 - |2x - 1| == 1 + (2x - 1) = 2x. //
     * Part B. Let 0.5 < x. Then 1 < 2x - 1, and |2x - 1| == 2x - 1.
     * Then 1 - |2x - 1| == 1 - (2x - 1) = 2 - 2x. //
     */
  }

  /**
   * @summary Get the hsl-luminosity of this color.
   * @description How "white" or "black" the color is. A lower luminosity means the color is closer to black,
   * a higher luminosity means the color is closer to white.
   * A number bound by [0, 1].
   * @version LOCKED
   * @type {number}
   */
  get hslLum() {
    return 0.5 * (this._max + this._min)
  }



  /**
   * @summary Get the hwb-hue of this color.
   * @description The Hue of this color. Identical to {@link Color#hsvHue}.
   * A number bound by [0, 360).
   * @version LOCKED
   * @type {number}
   */
  get hwbHue() {
    return this.hsvHue
  }

  /**
   * @summary Get the hwb-white of this color.
   * @description The amount of White in this color. A higher white means the color is closer to #fff,
   * a lower white means the color has a true hue (more colorful).
   * A number bound by [0, 1].
   * @version LOCKED
   * @type {number}
   */
  get hwbWht() {
    return this._min
  }

  /**
   * @summary Get the hwb-black of this color.
   * @description The amount of Black in this color. A higher black means the color is closer to #000,
   * a lower black means the color has a true hue (more colorful).
   * A number bound by [0, 1].
   * @version LOCKED
   * @type {number}
   */
  get hwbBlk() {
    return 1 - this._max
  }



  /**
   * @summary Get an array of RGBA components.
   * @version LOCKED
   * @type {Array<number>}
   */
  get rgb() { return [this.red, this.green, this.blue, this.alpha] }
  /** Alias of {@link Color#rgb} */ get rgba() { return this.rgb }

  /**
   * @summary Get an array of HSVA components.
   * @version LOCKED
   * @type {Array<number>}
   */
  get hsv() { return [this.hsvHue, this.hsvSat, this.hsvVal, this.alpha] }
  /** Alias of {@link Color#hsv} */ get hsva() { return this.hsv }

  /**
   * @summary Get an array of HSLA components.
   * @version LOCKED
   * @type {Array<number>}
   */
  get hsl() { return [this.hslHue, this.hslSat, this.hslLum, this.alpha] }
  /** Alias of {@link Color#hsl} */ get hsla() { return this.hsl }

  /**
   * @summary Get an array of HWBA components.
   * @version LOCKED
   * @type {Array<number>}
   */
  get hwb() { return [this.hwbHue, this.hwbWht, this.hwbBlk, this.alpha] }
  /** Alias of {@link Color#hwb} */ get hwba() { return this.hwb }



  /**
   * @summary Return the complement of this color, preserving alpha.
   * @description The complement of a color is the difference between that color and white.
   * @version LOCKED
   * @returns {Color} a new Color object that corresponds to this color’s complement
   */
  complement() {
    return new Color (
      255 - this.red,
      255 - this.green,
      255 - this.blue,
      this.alpha
    )
  }

  /**
   * @summary Return a hue-rotation of this color, preserving alpha.
   * @version LOCKED
   * @param  {number} a the number of degrees to rotate
   * @returns {Color} a new Color object corresponding to this color rotated by `a` degrees
   */
  rotate(a) {
    return Color.fromHSV(((this.hsvHue + a) % 360), this.hsvSat, this.hsvVal, this.alpha)
  }

  /**
   * @summary Return the inverse of this color.
   * @description The inverse of a color is that color with a hue rotation of 180 degrees.
   * @version LOCKED
   * @returns {Color} a new Color object that corresponds to this color’s inverse
   */
  invert() {
    return this.rotate(180)
  }

  /**
   * @summary Return a more saturated (more colorful) version of this color by a percentage.
   * @description This method calculates saturation in the HSL space.
   * A parameter of 1.0 returns a color with full saturation, and 0.0 returns an identical color.
   * A negative number will {@link Color#desaturate()|desaturate} this color.
   * Set `relative = true` to specify the amount as relative to the color’s current saturation.
   * @version LOCKED
   * @param  {number} p must be between -1.0 and 1.0; the value by which to saturate this color
   * @param  {boolean=} relative `true` if the saturation added is relative
   * @returns {Color} a new Color object that corresponds to this color saturated by `p`
   */
  saturate(p, relative = false) {
    let newsat = this.hslSat + (relative ? (this.hslSat * p) : p)
    newsat = Math.min(Math.max(0, newsat), 1)
    return Color.fromHSL(this.hslHue, newsat, this.hslLum, this.alpha)
  }

  /**
   * @summary Return a less saturated version of this color by a percentage.
   * @description A parameter of 1.0 returns a grayscale color, and 0.0 returns an identical color.
   * @version LOCKED
   * @see Color#saturate
   * @param  {number} p must be between -1.0 and 1.0; the value by which to desaturate this color
   * @param  {boolean=} relative `true` if the saturation subtracted is relative
   * @returns {Color} a new Color object that corresponds to this color desaturated by `p`
   */
  desaturate(p, relative = false) {
    return this.saturate(-p, relative)
  }

  /**
   * @summary Return a lighter version of this color by a percentage.
   * @description This method calculates with luminosity in the HSL space.
   * A parameter of 1.0 returns white, and 0.0 returns an identical color.
   * A negative parameter will {@link Color#darken|darken} this color.
   * Set `relative = true` to specify the amount as relative to the color’s current luminosity.
   *
   * For example, if `$color` has an HSL-lum of 0.5, then calling `$color.lighten(0.5)` will return
   * a new color with an HSL-lum of 1.0, because the argument 0.5 is simply added to the color’s luminosity.
   * However, calling `$color.lighten(0.5, true)` will return a new color with an HSL-lum of 0.75,
   * because the argument 0.5, relative to the color’s current luminosity of 0.5, results in
   * an added luminosity of 0.25.
   *
   * @version LOCKED
   * @param {number} p must be between -1.0 and 1.0; the amount by which to lighten this color
   * @param {boolean=} relative `true` if the luminosity added is relative
   * @returns {Color} a new Color object that corresponds to this color lightened by `p`
   */
  lighten(p, relative = false) {
    var newlum = this.hslLum + (relative ? (this.hslLum * p) : p)
    newlum = Math.min(Math.max(0, newlum), 1)
    return Color.fromHSL(this.hslHue, this.hslSat, newlum, this.alpha)
  }

  /**
   * @summary Return a darker version of this color by a percentage.
   * @description A parameter of 1.0 returns black, and 0.0 returns an identical color.
   * @version LOCKED
   * @see Color#lighten
   * @param {number} p must be between -1.0 and 1.0; the amount by which to darken this color
   * @param {boolean=} relative `true` if the luminosity subtracted is relative
   * @returns {Color} a new Color object that corresponds to this color darkened by `p`
   */
  darken(p, relative = false) {
    return this.lighten(-p, relative)
  }

  /**
   * @summary Return a new color with the complemented alpha of this color.
   * @description An alpha of, for example, 0.7, complemented, is 0.3 (the complement with 1.0).
   * @version LOCKED
   * @returns {Color} a new Color object with the same color but complemented alpha
   */
  negate() {
    return new Color(...this.rgb, 1 - this.alpha)
  }

  /**
   * @summary Return a less faded (larger alpha) version of this color.
   * @description A parameter of 1.0 returns full opaqueness, and 0.0 returns an identical color.
   * A negative parameter will {@link Color#fadeOut|fade out} this color.
   * Set `relative = true` to specify the amount as relative to the color’s current opacity.
   * @version LOCKED
   * @returns {Color} a new Color object that corresponds to this color faded in by `p`
   */
  fadeIn(p, relative = false) {
    var newalpha = this.alpha + (relative ? (this.alpha * p) : p)
    newalpha = Math.min(Math.max(0, newalpha), 1)
    return new Color(...this.rgb, newalpha)
  }

  /**
   * @summary Return a more faded (smaller alpha) version of this color.
   * @description A parameter of 1.0 returns transparent, and 0.0 returns an identical color.
   * @version LOCKED
   * @see Color#fadeIn
   * @returns {Color} a new Color object that corresponds to this color faded out by `p`
   */
  fadeOut(p, relative = false) {
    return this.fadeIn(-p, relative)
  }



  /**
   * @summary Mix (average) another color with this color, with a given weight favoring that color.
   * @description If `w == 0.0`, return exactly this color.
   * `w == 1.0` return exactly the other color.
   * `w == 0.5` (default if omitted) return a perfectly even mix.
   * In other words, `w` is "how much of the other color you want."
   * Note that `color1.mix(color2, w)` returns the same result as `color2.mix(color1, 1-w)`.
   * @version STABLE
   * @param {Color} $color the second color
   * @param {number=} w between 0.0 and 1.0; the weight favoring the other color
   * @returns {Color} a mix of the two given colors
   */
  mix($color, w = 0.5) {
    let red   = Math.round((1-w) * this.red    +  w * $color.red  )
    let green = Math.round((1-w) * this.green  +  w * $color.green)
    let blue  = Math.round((1-w) * this.blue   +  w * $color.blue )
    let alpha = this._compoundOpacity([this.alpha, $color.alpha])
    return new Color(red, green, blue, alpha)
  }

  /**
   * @summary Blur another color with this color, with a given weight favoring that color.
   * @description Behaves almost exactly the same as {@link Color#mix}, except that this method uses a more
   * visually accurate, slightly brighter, mix.
   * @version STABLE
   * @see https://www.youtube.com/watch?v=LKnqECcg6Gw
   * @param  {Color} $color the second color
   * @param  {number=} w between 0.0 and 1.0; the weight favoring the other color
   * @returns {Color} a blur of the two given colors
   */
  blur($color, w = 0.5) {
    let red   = Math.round(Math.sqrt((1-w) * Math.pow(this.red  , 2)  +  w * Math.pow($color.red  , 2)))
    let green = Math.round(Math.sqrt((1-w) * Math.pow(this.green, 2)  +  w * Math.pow($color.green, 2)))
    let blue  = Math.round(Math.sqrt((1-w) * Math.pow(this.blue , 2)  +  w * Math.pow($color.blue , 2)))
    let alpha = this._compoundOpacity([this.alpha, $color.alpha])
    return new Color(red, green, blue, alpha)
  }

  /**
   * @summary Compare this color with another color.
   * @description Return `true` if they are the same color.
   * Colors are the “same” iff they have exactly the same RGBA components.
   * Thus “same” colors are “replaceable”.
   * @version STABLE
   * @param  {Color} $color a Color object
   * @returns {boolean} `true` if the argument is the same color as this color
   */
  equals($color) {
    if (this === $color) return true
    if (this.alpha === 0 && $color.alpha === 0) return true
    return (
         this.red   === $color.red
      && this.green === $color.green
      && this.blue  === $color.blue
      && this.alpha === $color.alpha
    )
  }

  /**
   * @summary Return the *contrast ratio* between two colors.
   * @description
   * NOTE: In this method, alpha is ignored, that is, the colors are assumed to be opaque.
   * @see https://www.w3.org/TR/WCAG/#contrast-ratiodef
   * @version STABLE
   * @param {Color} $color the second color to check
   * @returns {number} the contrast ratio of this color with the argument
   */
  contrastRatio($color) {
    /**
     * Return the relative lumance of a color.
     * @private
     * @param  {Color} c a Color object
     * @returns {number} the relative lumance of the color
     */
    function luma(c) {
      /**
       * A helper calculation.
       * @private
       * @param  {number} p a decimal representation of an rgb component of a color
       * @returns {number} the output of some mathematical function of `p`
       */
      function coef(p) {
        return (p <= 0.03928) ? p/12.92 : Math.pow((p + 0.055)/1.055, 2.4)
      }
      return 0.2126*coef(c.red  /255)
           + 0.7152*coef(c.green/255)
           + 0.0722*coef(c.blue /255)
    }
    let both = [luma(this), luma($color)]
    return (Math.max(...both) + 0.05) / (Math.min(...both) + 0.05)
  }

  /**
   * @summary Return a string representation of this color.
   * @description If the alpha of this color is 1, then the string returned will represent an opaque color,
   * e.g. `hsv()`, `hsl()`, etc. Otherwise, the string returned will represent a translucent color,
   * `hsva()`, `hsla()`, etc.
   * The format of the numbers returned will be as follows. The default format is HEX.
   * - all HEX values will be base 16 integers in [00,FF], two digits
   * - HSV/HSL/HWB-hue values will be base 10 decimals in [0,360) rounded to the nearest 0.1
   * - HSV/HSL-sat/val/lum and HWB-wht/blk values will be base 10 decimals in [0,1] rounded to the nearest 0.01
   * - all RGB values will be base 10 integers in [0,255], one to three digits
   * - all alpha values will be base 10 decimals in [0,1], rounded to the nearest 0.001
   * @version STABLE
   * @see https://drafts.csswg.org/css-color/#hex-notation
   * @param {Color.Space=} space represents the space in which this color exists
   * @returns {string} a string representing this color.
   */
  toString(space = Color.Space.HEX) {
    if (space === Color.Space.HEX) {
      let red   = this.red.toString(16)
      let green = this.green.toString(16)
      let blue  = this.blue.toString(16)
      let alpha = Math.round(this.alpha * 255).toString(16)
      return `#${red}${green}${blue}${(this.alpha < 1) ? alpha : ''}`
    }
    let alpha = `, ${Math.round(this.alpha * 1000) / 1000}`
    let arr = {
      [Color.Space.RGB]: () => this.rgb.slice(0,3),
      [Color.Space.HSV]: () => [
        Math.round(this.hsvHue *  10) /  10,
        Math.round(this.hsvSat * 100) / 100,
        Math.round(this.hsvVal * 100) / 100,
      ],
      [Color.Space.HSL]: () => [
        Math.round(this.hslHue *  10) /  10,
        Math.round(this.hslSat * 100) / 100,
        Math.round(this.hslLum * 100) / 100,
      ],
      [Color.Space.HWB]: () => [
        Math.round(this.hwbHue *  10) /  10,
        Math.round(this.hwbWht * 100) / 100,
        Math.round(this.hwbBlk * 100) / 100,
      ],
      default: () => { throw new TypeError('Argument must be of type `Color.Space`.') },
    }
    return (this.alpha < 1) ?
      `${space}a(${(arr[space] || arr.default).call(this).join(', ')}${alpha})`
    : `${space}(${(arr[space] || arr.default).call(this).join(', ')})`
  }



  /**
   * @summary Return a new Color object, given hue, saturation, and value in HSV-space.
   * @description The HSV-hue must be between 0 and 360.
   * The HSV-saturation must be between 0.0 and 1.0.
   * The HSV-value must be between 0.0 and 1.0.
   * The alpha must be between 0.0 and 1.0.
   * @version LOCKED
   * @param {number=} hue the HSV-hue component of this color (a number 0—360)
   * @param {number=} sat the HSV-sat component of this color (a number 0—1)
   * @param {number=} val the HSV-val component of this color (a number 0—1)
   * @param {number=} alpha the opacity (a number 0—1)
   * @returns {Color} a new Color object with hsva(hue, sat, val, alpha)
   */
  static fromHSV(hue = 0, sat = 0, val = 0, alpha = 1) {
    let c = sat * val
    let x = c * (1 - Math.abs(hue/60 % 2 - 1))
    let m = val - c
    let rgb;
         if (  0 <= hue && hue <  60) { rgb = [c, x, 0] }
    else if ( 60 <= hue && hue < 120) { rgb = [x, c, 0] }
    else if (120 <= hue && hue < 180) { rgb = [0, c, x] }
    else if (180 <= hue && hue < 240) { rgb = [0, x, c] }
    else if (240 <= hue && hue < 300) { rgb = [x, 0, c] }
    else if (300 <= hue && hue < 360) { rgb = [c, 0, x] }
    return new Color(...rgb.map((el) => Math.round((el + m) * 255)), alpha)
  }
  /** Alias of {@link Color.fromHSV} */ static fromHSVA(h=0,s=0,v=0,a=1) { return Color.fromHSV(h,s,v,a) }

  /**
   * @summary Return a new Color object, given hue, saturation, and luminosity in HSL-space.
   * @description The HSL-hue must be between 0 and 360.
   * The HSL-saturation must be between 0.0 and 1.0.
   * The HSL-luminosity must be between 0.0 and 1.0.
   * The alpha must be between 0.0 and 1.0.
   * @version LOCKED
   * @param {number=} hue the HSL-hue component of this color (a number 0—360)
   * @param {number=} sat the HSL-sat component of this color (a number 0—1)
   * @param {number=} lum the HSL-lum component of this color (a number 0—1)
   * @param {number=} alpha the opacity (a number 0—1)
   * @returns {Color} a new Color object with hsla(hue, sat, lum, alpha)
   */
  static fromHSL(hue = 0, sat = 0, lum = 0, alpha = 1) {
    let c = sat * (1 - Math.abs(2*lum - 1))
    let x = c * (1 - Math.abs(hue/60 % 2 - 1))
    let m = lum - c/2
    let rgb;
         if (  0 <= hue && hue <  60) { rgb = [c, x, 0] }
    else if ( 60 <= hue && hue < 120) { rgb = [x, c, 0] }
    else if (120 <= hue && hue < 180) { rgb = [0, c, x] }
    else if (180 <= hue && hue < 240) { rgb = [0, x, c] }
    else if (240 <= hue && hue < 300) { rgb = [x, 0, c] }
    else if (300 <= hue && hue < 360) { rgb = [c, 0, x] }
    return new Color(...rgb.map((el) => Math.round((el + m) * 255)), alpha)
  }
  /** Alias of {@link Color.fromHSL} */ static fromHSLA(h=0,s=0,l=0,a=1) { return Color.fromHSL(h,s,l,a) }

  /**
   * @summary Return a new Color object, given hue, white, and black in HWB-space.
   * @description Credit for formula is due to https://drafts.csswg.org/css-color/#hwb-to-rgb
   * The HWB-hue must be between 0 and 360.
   * The HWB-white must be between 0.0 and 1.0.
   * The HWB-black must be between 0.0 and 1.0.
   * The alpha must be between 0.0 and 1.0.
   * @version LOCKED
   * @param {number=} hue the HWB-hue component of this color (a number 0—360)
   * @param {number=} wht the HWB-wht component of this color (a number 0—1)
   * @param {number=} blk the HWB-blk component of this color (a number 0—1)
   * @param {number=} alpha the opacity (a number 0—1)
   * @returns {Color} a new Color object with hwba(hue, wht, blk, alpha)
   */
  static fromHWB(hue = 0, wht = 0, blk = 0, alpha = 1) {
    return Color.fromHSV(hue, 1 - wht / (1 - blk), 1 - blk, alpha)
    // HWB -> RGB:
    /*
    var rgb = Color.fromHSL([hue, 1, 0.5]).rgb.map((el) => el/255)
    for (var i = 0; i < 3; i++) {
      rgb[i] *= (1 - white - black);
      rgb[i] += white;
    }
    return new Color(rgb.map(function (el) { return Math.round(el * 255) }))
     */
  }
  /** Alias of {@link Color.fromHWB} */ static fromHWBA(h=0,w=0,b=0,a=1) { return Color.fromHWB(h,w,b,a) }

  /**
   * @summary Return a new Color object, given a string.
   * @description The string must have one of the following formats:
   *  1. `#rrggbb`, with hexadecimal RGB components (in base 16, out of ff, lowercase or uppercase). The `#` must be included.
   *  2. `#rrggbbaa`, where `aa` is alpha
   *  3. `rgb(r,g,b)`    or `rgb(r, g, b)`    , with integer RGB components (in base 10, out of 255)
   *  4. `rgba(r,g,b,a)` or `rgba(r, g, b, a)`, where `a` is alpha
   *  5. `hsv(h,s,v)`    or `hsv(h, s, v)`    , with decimal HSV components (in base 10)
   *  6. `hsva(h,s,v,a)` or `hsva(h, s, v, a)`, where `a` is alpha
   *  7. `hsl(h,s,l)`    or `hsl(h, s, l)`    , with decimal HSL components (in base 10)
   *  8. `hsla(h,s,l,a)` or `hsla(h, s, l, a)`, where `a` is alpha
   *  9. `hwb(h,w,b)`    or `hwb(h, w, b)`    , with decimal HWB components (in base 10)
   * 10. `hwba(h,w,b,a)` or `hwba(h, w, b, a)`, where `a` is alpha
   * @version LOCKED
   * @param {string} str a string of one of the forms described
   * @returns {Color} a new Color object constructed from the given string
   */
  static fromString(str) {
    if (str[0] === '#') {
      let red   = parseInt(str.slice(1,3), 16)
      let green = parseInt(str.slice(3,5), 16)
      let blue  = parseInt(str.slice(5,7), 16)
      let alpha = (str.length === 9) ? parseInt(str.slice(7,9), 16)/255 : 1
      return new Color(red, green, blue, alpha)
    }
    let returned = {
      rgb    : (comps) => new Color    (...comps),
      hsv    : (comps) => Color.fromHSV(...comps),
      hsl    : (comps) => Color.fromHSL(...comps),
      hwb    : (comps) => Color.fromHWB(...comps),
      default: (comps) => null,
    }
    return (returned[str.slice(0,3)] || returned.default).call(null,
      str.slice((str[3] === 'a') ? 5 : 4, -1).split(',').map((s) => +s))
  }

  /**
   * @summary Mix (average) a set of 2 or more colors. The average will be weighted evenly.
   * @description If two colors $a and $b are given, calling this static method, `Color.mix([$a, $b])`,
   * is equivalent to calling `$a.mix($b)` without a weight.
   * However, calling `Color.mix([$a, $b, $c])` with 3 or more colors yields an even mix,
   * and will *NOT* yield the same results as calling `$a.mix($b).mix($c)`, which yields an uneven mix.
   * Note that the order of the given colors does not change the result, that is,
   * `Color.mix([$a, $b, $c])` will return the same result as `Color.mix([$c, $b, $a])`.
   * @version STABLE
   * @see Color#mix
   * @param {Array<Color>} $colors an array of Color objects, of length >=2
   * @param {boolean=} blur if `true`, use a blurring function ({@link Color#blur})
   * @returns {Color} a mix of the given colors
   */
  static mix($colors, blur = false) {
    function compoundComponents($arr) {
      if (blur) {
        return Math.round(Math.sqrt($arr.reduce((a,b) => a*a + b*b) / $colors.length))
      }
      return Math.round($arr.reduce((a,b) => a + b) / $colors.length)
    }
    let reds   = $colors.map(($c) => $c.red  )
    let greens = $colors.map(($c) => $c.green)
    let blues  = $colors.map(($c) => $c.blue )
    let alphas = $colors.map(($c) => $c.alpha)
    return new Color(...[reds, greens, blues].map(compoundComponents), this._compoundOpacity(alphas))
  }
}



  /**
   * @summary Enum for the types of string representations of colors.
   * @version STABLE
   * @enum {string}
   */
Color.Space = {
  /** #rrggbb      / #rrggbbaa        */ HEX: 'hex',
  /** rgb(r, g, b) / rgba(r, g, b, a) */ RGB: 'rgb',
  /** hsv(h, s, v) / hsva(h, s, v, a) */ HSV: 'hsv',
  /** hsl(h, s, l) / hsla(h, s, l, a) */ HSL: 'hsl',
  /** hwb(h, w, b) / hwba(h, w, b, a) */ HWB: 'hwb',
}

module.exports = Color
