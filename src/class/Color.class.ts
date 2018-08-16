const NAMES = require('../color-names.json')
/**
 * @todo TODO take from `continuum/Util.average`
 * @private
 * @param   a 1st number
 * @param   b 2nd number; for best results, should be greater than `a`
 * @param   w number between [0,1]; weight of 2nd number
 * @returns the weighted average of `a` and `b`
 */
function average(a: number, b: number, w = 0.5): number {
  return (a * (1-w)) + (b * w)
}
/**
 * @todo TODO take from `continuum/Util.aMean`
 * @private
 * @param   arr an array of numbers
 * @returns the arithmetic mean of the array entries
 */
function aMean(arr: number[]): number {
  return arr.reduce((a,b) => a + b) / arr.length
}
/**
 * @todo TODO put into `extrajs/Number`
 * @private
 * @summary Return the remainder of Euclidean division of `a` by `n`.
 * @description This method returns `a % n` when `a` is positive,
 * but returns a positive result when `a` is negative.
 * `n` must be positive.
 * @param   a the dividend
 * @param   n the divisor, a positive integer
 * @returns `((a % n) + n) % n`
 * @throws  {RangeError} when `n` is not a positive integer
 */
function mod(a: number, n: number): number {
  if (n <= 0 || n%1 !== 0) throw new RangeError('The divisor must be a positive integer.')
  return ((a % n) + n) % n
}


/**
 * @summary Enum for the types of string representations of colors.
 */
enum Space {
  /** #rrggbb      / #rrggbbaa        */ HEX = 'hex',
  /** rgb(r, g, b) / rgba(r, g, b, a) */ RGB = 'rgb',
  /** hsv(h, s, v) / hsva(h, s, v, a) */ HSV = 'hsv',
  /** hsl(h, s, l) / hsla(h, s, l, a) */ HSL = 'hsl',
  /** hwb(h, w, b) / hwba(h, w, b, a) */ HWB = 'hwb',
}


/**
 * A 24/32-bit color ("True Color") that can be displayed in a pixel, given three primary color channels
 * and a possible transparency channel.
 */
export default class Color {
  static readonly Space = Space

  /**
   * @summary Calculate the alpha of two or more overlapping translucent colors.
   * @description For two overlapping colors with respective alphas `a` and `b`, the compounded alpha
   * of an even mix will be `1 - (1-a)*(1-b)`.
   * For three, it would be `1 - (1-a)*(1-b)*(1-c)`.
   * An alpha is a number within the interval [0,1], and represents the opacity
   * of a translucent color. An alpha of 0 is completely transparent; an alpha
   * of 1 is completely opaque.
   * @param  alphas an array of alphas
   * @return the compounded alpha
   */
  private static _compoundOpacity(alphas: number[]): number {
    return 1 - alphas.map((a) => 1-a).reduce((a,b) => a*b)
  }

  /**
   * @summary Transform an sRGB channel value (gamma-corrected) to a linear value.
   * @description Approximately, the square of the value: `(x) => x * x`.
   * @see https://www.w3.org/Graphics/Color/sRGB.html
   * @see https://en.wikipedia.org/wiki/SRGB#The_reverse_transformation
   * @param   c_srgb an rgb component (0–1) of a color
   * @returns the transformed linear value
   */
  private static _sRGB_Linear(c_srgb: number): number {
    return (c_srgb <= 0.03928) ? c_srgb / 12.92 : ((c_srgb + 0.055) / 1.055) ** 2.4
  }
  /**
   * @summary Return the inverse of {@link Color._sRGB_Linear}.
   * @description Approximately, the square root of the value: `(x) => Math.sqrt(x)`.
   * @see https://www.w3.org/Graphics/Color/sRGB.html
   * @see https://en.wikipedia.org/wiki/SRGB#The_forward_transformation_(CIE_XYZ_to_sRGB)
   * @param   c_lin a perceived luminance (linear) of a color’s rgb component (0–1)
   * @returns the transformed sRGB value
   */
  private static _linear_sRGB(c_lin: number): number {
    return (c_lin <= 0.00304) ? c_lin * 12.92 : 1.055 * c_lin ** (1 / 2.4) - 0.055
  }

  /**
   * @summary Return a new Color object, given hue, saturation, and value in HSV-space.
   * @description The HSV-hue must be between 0 and 360.
   * The HSV-saturation must be between 0.0 and 1.0.
   * The HSV-value must be between 0.0 and 1.0.
   * The alpha must be between 0.0 and 1.0.
   * @param   hue the HSV-hue channel of this color (a number 0—360)
   * @param   sat the HSV-sat channel of this color (a number 0—1)
   * @param   val the HSV-val channel of this color (a number 0—1)
   * @param   alpha the opacity (a number 0—1)
   * @returns a new Color object with hsva(hue, sat, val, alpha)
   */
  static fromHSV(hue = 0, sat = 0, val = 0, alpha = 1): Color {
    hue = mod(hue, 360)
    let c: number = sat * val
    let x: number = c * (1 - Math.abs(hue/60 % 2 - 1))
    let m: number = val - c
    let rgb: number[] = [c, x, 0]
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
   * @see https://www.w3.org/TR/css-color-4/#hsl-to-rgb
   * @param   hue the HSL-hue channel of this color (a number 0—360)
   * @param   sat the HSL-sat channel of this color (a number 0—1)
   * @param   lum the HSL-lum channel of this color (a number 0—1)
   * @param   alpha the opacity (a number 0—1)
   * @returns a new Color object with hsla(hue, sat, lum, alpha)
   */
  static fromHSL(hue = 0, sat = 0, lum = 0, alpha = 1): Color {
    hue = mod(hue, 360)
    let c: number = sat * (1 - Math.abs(2*lum - 1))
    let x: number = c * (1 - Math.abs(hue/60 % 2 - 1))
    let m: number = lum - c/2
    let rgb: number[] = [c, x, 0]
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
   * @description
   * The HWB-hue must be between 0 and 360.
   * The HWB-white must be between 0.0 and 1.0.
   * The HWB-black must be between 0.0 and 1.0.
   * The alpha must be between 0.0 and 1.0.
   * @see https://www.w3.org/TR/css-color-4/#hwb-to-rgb
   * @param   hue the HWB-hue channel of this color (a number 0—360)
   * @param   wht the HWB-wht channel of this color (a number 0—1)
   * @param   blk the HWB-blk channel of this color (a number 0—1)
   * @param   alpha the opacity (a number 0—1)
   * @returns a new Color object with hwba(hue, wht, blk, alpha)
   */
  static fromHWB(hue = 0, wht = 0, blk = 0, alpha = 1): Color {
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
   * @description The string must have one of the following formats (spaces optional):
   *  - `#rrggbb`
   *  - `#rrggbbaa`
   *  - `#rgb`
   *  - `#rgba`
   *  - `rgb(r, g, b)`
   *  - `rgb(r, g, b, a)`
   *  - `rgba(r, g, b, a)`
   *  - `hsv(h, s, v)`
   *  - `hsv(h, s, v, a)`
   *  - `hsva(h, s, v, a)`
   *  - `hsl(h, s, l)`
   *  - `hsl(h, s, l, a)`
   *  - `hsla(h, s, l, a)`
   *  - `hwb(h, w, b)`
   *  - `hwb(h, w, b, a)`
   *  - `hwba(h, w, b, a)`
   *  - *any exact string match of a named color*
   * @see {@link https://www.w3.org/TR/css-color-4/#named-colors|Named Colors | CSS Color Module Level 4}
   * @param   str a string of one of the forms described
   * @returns a new Color object constructed from the given string
   * @throws  {Error} if the string given is not a valid format
   */
  static fromString(str = ''): Color {
    if (str === '') return new Color()
    if (str[0] === '#') {
      if ([4,5,7,9].includes(str.length)) {
        if ([4,5].includes(str.length)) {
          let [r, g, b, a]: string[] = [str[1], str[2], str[3], str[4] || '']
          return Color.fromString(`#${r}${r}${g}${g}${b}${b}${a}${a}`)
        }
        let red  : number = parseInt(str.slice(1,3), 16)
        let green: number = parseInt(str.slice(3,5), 16)
        let blue : number = parseInt(str.slice(5,7), 16)
        let alpha: number = (str.length === 9) ? parseInt(str.slice(7,9), 16)/255 : 1
        return new Color(red, green, blue, alpha)
      }
    }
    if (!str.includes('(')) {
      const returned: string|null = NAMES[str] || null
      if (!returned) throw new Error(`No color found for the name given: '${str}'.`)
      return Color.fromString(returned)
    }
    let switch_: { [index: string]: (ch: number[]) => Color } = {
      rgb: (channels) => new Color    (...channels),
      hsv: (channels) => Color.fromHSV(...channels),
      hsl: (channels) => Color.fromHSL(...channels),
      hwb: (channels) => Color.fromHWB(...channels),
      default(channels) { throw new Error('Incorrect string format given.') },
    }
    return (switch_[str.slice(0,3)] || switch_.default).call(null, str.slice((str[3] === 'a') ? 5 : 4, -1).split(',').map((s) => +s))
  }

  /**
   * @summary Mix (average) a set of 2 or more colors. The average will be weighted evenly.
   * @description If two colors `a` and `b` are given, calling this static method, `Color.mix([a, b])`,
   * is equivalent to calling `a.mix(b)` without a weight.
   * However, calling `Color.mix([a, b, c])` with 3 or more colors yields an even mix,
   * and will *not* yield the same results as calling `a.mix(b).mix(c)`, which yields an uneven mix.
   * Note that the order of the given colors does not change the result, that is,
   * `Color.mix([a, b, c])` returns the same result as `Color.mix([c, b, a])`.
   * @see Color#mix
   * @param   colors an array of Color objects, of length >=2
   * @param   blur should I use a blurring function ({@link Color#blur})?
   * @returns a mix of the given colors
   */
  static mix(colors: Color[], blur = false): Color {
    if (blur) return Color.blur(colors) // TODO remove param `blur` on v3+
    let red  : number = Math.round(aMean(colors.map((c) => c.red  )))
    let green: number = Math.round(aMean(colors.map((c) => c.green)))
    let blue : number = Math.round(aMean(colors.map((c) => c.blue )))
    let alpha: number = Color._compoundOpacity(colors.map((c) => c.alpha))
    return new Color(red, green, blue, alpha)
  }

  /**
   * @summary Blur a set of 2 or more colors. The average will be weighted evenly.
   * @description Behaves almost exactly the same as {@link Color.mix},
   * except that this method uses a more visually accurate, slightly brighter, mix.
   * @see Color#blur
   * @param   colors an array of Color objects, of length >=2
   * @returns a blur of the given colors
   */
  static blur(colors: Color[]): Color {
    /**
     * @summary Calculate the compound value of two or more overlapping same-channel values.
     * @private
     * @param   arr an array of same-channel values (red, green, or blue)
     * @returns the compounded value
     */
    function compoundChannel(arr: number[]): number {
      return Color._linear_sRGB(aMean(arr.map(Color._sRGB_Linear)))
    }
    let red  : number = Math.round(compoundChannel(colors.map((c) => c.red  )))
    let green: number = Math.round(compoundChannel(colors.map((c) => c.green)))
    let blue : number = Math.round(compoundChannel(colors.map((c) => c.blue )))
    let alpha: number =     Color._compoundOpacity(colors.map((c) => c.alpha))
    return new Color(red, green, blue, alpha)
  }

  /**
   * @summary Generate a random color.
   * @param   alpha should the alpha channel also be randomized? (if false, default alpha value is 1)
   * @returns a Color object with random values
   */
  static random(alpha = true): Color {
    return Color.fromString(`#${Math.random().toString(16).slice(2, (alpha) ? 10 : 8)}`)
  }

  /**
   * @summary Randomly select a Named Color.
   * @returns one of the Named Colors, randomly chosen
   */
  static randomName(): Color {
    let names = Object.entries(NAMES)
    return Color.fromString(names[Math.floor(Math.random() * names.length)][0])
  }


  /**
   * @summary The red channel of this color. An integer in [0,255].
   */
  private readonly _RED: number
  /**
   * @summary The green channel of this color. An integer in [0,255].
   */
  private readonly _GREEN: number
  /**
   * @summary The blue channel of this color. An integer in [0,255].
   */
  private readonly _BLUE: number
  /**
   * @summary The alpha channel of this color. An number in [0,1].
   */
  private readonly _ALPHA: number

  private readonly _max: number
  private readonly _min: number
  private readonly _chroma: number

  /**
   *
   * @summary Construct a new Color object.
   * @description Calling `new Color(r, g, b, a)` (4 arguments) specifies default behavior.
   * Calling `new Color(r, g, b)` (3 arguments) will result in an opaque color (`#rrggbbFF`),
   * where the alpha is 1 by default.
   * Calling `new Color()` (no arguments) will result in transparent (`#00000000`).
   * @param r the red   channel of this color (an integer 0—255)
   * @param g the green channel of this color (an integer 0—255)
   * @param b the blue  channel of this color (an integer 0—255)
   * @param a the alpha channel of this color (a number 0–1)
   */
  constructor(r = 0, g = 0, b = 0, a = 1) {
    if (arguments.length === 0) a = 0

    this._RED   = Math.round(Math.max(0, Math.min(r, 255)))
    this._GREEN = Math.round(Math.max(0, Math.min(g, 255)))
    this._BLUE  = Math.round(Math.max(0, Math.min(b, 255)))
    this._ALPHA = Math.max(0, Math.min(a, 1))

    this._max    = Math.max(this._RED, this._GREEN, this._BLUE) / 255
    this._min    = Math.min(this._RED, this._GREEN, this._BLUE) / 255
    this._chroma = this._max - this._min
  }

  /**
   * @summary Get the red channel of this color.
   */
  get red(): number { return this._RED }

  /**
   * @summary Get the green channel of this color.
   */
  get green(): number { return this._GREEN }

  /**
   * @summary Get the blue channel of this color.
   */
  get blue(): number { return this._BLUE }

  /**
   * @summary Get the alpha (opacity) of this color.
   */
  get alpha(): number { return this._ALPHA }

  /**
   * @summary Return a string representation of this color.
   * @description If the alpha of this color is 1, then the string returned will represent an opaque color,
   * e.g. `hsv()`, `hsl()`, etc. Otherwise, the string returned will represent a translucent color,
   * `hsva()`, `hsla()`, etc.
   * The format of the numbers returned will be as follows. The default format is {@link Color.Space.HEX}.
   * - all HEX values will be base 16 integers in [00,FF], two digits
   * - HSV/HSL/HWB-hue values will be base 10 decimals in [0,360) rounded to the nearest 0.1
   * - HSV/HSL-sat/val/lum and HWB-wht/blk values will be base 10 decimals in [0,1] rounded to the nearest 0.01
   * - all RGB values will be base 10 integers in [0,255], one to three digits
   * - all alpha values will be base 10 decimals in [0,1], rounded to the nearest 0.001
   * @see https://www.w3.org/TR/css-color-4/#hex-notation
   * @param   space represents the space in which this color exists
   * @returns a string representing this color
   */
  toString(space = Color.Space.HEX): string {
    function leadingZeroHex(n: number): string {
      return `${(n < 16) ? '0' : ''}${n.toString(16)}`
    }
    if (space === Color.Space.HEX) {
      return `#${this.rgb.slice(0,3).map(leadingZeroHex).join('')}${(this.alpha < 1) ? leadingZeroHex(Math.round(this.alpha * 255)) : ''}`
    }
    let switch_: { [index: string]: () => number[] } = {
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
      default() { throw new TypeError('Argument must be of type `Color.Space`.') },
    }
    return (this.alpha < 1) ?
      `${space}a(${(switch_[space] || switch_.default).call(this).join(', ')}, ${Math.round(this.alpha * 1000) / 1000})`
    : `${space}(${ (switch_[space] || switch_.default).call(this).join(', ')})`
  }



  /**
   * @summary Get the hsv-hue of this color.
   * @description The HSV-space hue (in degrees) of this color, or what "color" this color is.
   * A number bound by [0, 360).
   */
  get hsvHue(): number {
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
   */
  get hsvSat(): number {
    return (this._chroma === 0) ? 0 : this._chroma / this.hsvVal
  }

  /**
   * @summary Get the hsv-value of this color.
   * @description The brightness of this color. A lower value means the color is closer to black, a higher
   * value means the color is more true to its hue.
   * A number bound by [0, 1].
   */
  get hsvVal(): number {
    return this._max
  }



  /**
   * @summary Get the hsl-hue of this color.
   * @description The Hue of this color. Identical to {@link Color#hsvHue}.
   * A number bound by [0, 360).
   */
  get hslHue(): number {
    return this.hsvHue
  }

  /**
   * @summary Get the hsl-saturation of this color.
   * @description The amount of "color" in the color. A lower saturation means the color is more grayer,
   * a higher saturation means the color is more colorful.
   * A number bound by [0, 1].
   */
  get hslSat(): number {
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
   */
  get hslLum(): number {
    return 0.5 * (this._max + this._min)
  }



  /**
   * @summary Get the hwb-hue of this color.
   * @description The Hue of this color. Identical to {@link Color#hsvHue}.
   * A number bound by [0, 360).
   */
  get hwbHue(): number {
    return this.hsvHue
  }

  /**
   * @summary Get the hwb-white of this color.
   * @description The amount of White in this color. A higher white means the color is closer to #fff,
   * a lower white means the color has a true hue (more colorful).
   * A number bound by [0, 1].
   */
  get hwbWht(): number {
    return this._min
  }

  /**
   * @summary Get the hwb-black of this color.
   * @description The amount of Black in this color. A higher black means the color is closer to #000,
   * a lower black means the color has a true hue (more colorful).
   * A number bound by [0, 1].
   */
  get hwbBlk(): number {
    return 1 - this._max
  }



  /**
   * @summary Get an array of RGBA channels.
   */
  get rgb(): number[] { return [this.red, this.green, this.blue, this.alpha] }
  /** Alias of {@link Color#rgb} */ get rgba() { return this.rgb }

  /**
   * @summary Get an array of HSVA channels.
   */
  get hsv(): number[] { return [this.hsvHue, this.hsvSat, this.hsvVal, this.alpha] }
  /** Alias of {@link Color#hsv} */ get hsva() { return this.hsv }

  /**
   * @summary Get an array of HSLA channels.
   */
  get hsl(): number[] { return [this.hslHue, this.hslSat, this.hslLum, this.alpha] }
  /** Alias of {@link Color#hsl} */ get hsla() { return this.hsl }

  /**
   * @summary Get an array of HWBA channels.
   */
  get hwb(): number[] { return [this.hwbHue, this.hwbWht, this.hwbBlk, this.alpha] }
  /** Alias of {@link Color#hwb} */ get hwba() { return this.hwb }



  /**
   * @summary Return the complement of this color, preserving alpha.
   * @description The complement of a color is the difference between that color and white.
   * @returns a new Color object that corresponds to this color’s complement
   */
  complement(): this {
    return new Color (
      255 - this.red,
      255 - this.green,
      255 - this.blue,
      this.alpha
    )
  }

  /**
   * @summary Return a hue-rotation of this color, preserving alpha.
   * @param   a the number of degrees to rotate
   * @returns a new Color object corresponding to this color rotated by `a` degrees
   */
  rotate(a: number): this {
    return Color.fromHSV(((this.hsvHue + a) % 360), this.hsvSat, this.hsvVal, this.alpha)
  }

  /**
   * @summary Return the inverse of this color.
   * @description The inverse of a color is that color with a hue rotation of 180 degrees.
   * @returns a new Color object that corresponds to this color’s inverse
   */
  invert(): this {
    return this.rotate(180)
  }

  /**
   * @summary Return a more saturated (more colorful) version of this color by a percentage.
   * @description This method calculates saturation in the HSL space.
   * A parameter of 1.0 returns a color with full saturation, and 0.0 returns an identical color.
   * A negative number will {@link Color#desaturate()|desaturate} this color.
   * Set `relative = true` to specify the amount as relative to the color’s current saturation.
   *
   * For example, if `$color` has an HSL-sat of 0.5, then calling `$color.saturate(0.5)` will return
   * a new color with an HSL-sat of 1.0, because the argument 0.5 is simply added to the color’s saturation.
   * However, calling `$color.saturate(0.5, true)` will return a new color with an HSL-sat of 0.75,
   * because the argument 0.5, relative to the color’s current saturation of 0.5, results in
   * an added saturation of 0.25.
   *
   * @param   p must be between -1.0 and 1.0; the value by which to saturate this color
   * @param   relative should the saturation added be relative?
   * @returns a new Color object that corresponds to this color saturated by `p`
   */
  saturate(p: number, relative = false): this {
    let newsat: number = this.hslSat + (relative ? (this.hslSat * p) : p)
    newsat = Math.min(Math.max(0, newsat), 1)
    return Color.fromHSL(this.hslHue, newsat, this.hslLum, this.alpha)
  }

  /**
   * @summary Return a less saturated version of this color by a percentage.
   * @description A parameter of 1.0 returns a grayscale color, and 0.0 returns an identical color.
   * @see Color#saturate
   * @param   p must be between -1.0 and 1.0; the value by which to desaturate this color
   * @param   relative should the saturation subtracted be relative?
   * @returns a new Color object that corresponds to this color desaturated by `p`
   */
  desaturate(p: number, relative = false): this {
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
   * @param   p must be between -1.0 and 1.0; the amount by which to lighten this color
   * @param   relative should the luminosity added be relative?
   * @returns a new Color object that corresponds to this color lightened by `p`
   */
  lighten(p: number, relative = false): this {
    let newlum: number = this.hslLum + (relative ? (this.hslLum * p) : p)
    newlum = Math.min(Math.max(0, newlum), 1)
    return Color.fromHSL(this.hslHue, this.hslSat, newlum, this.alpha)
  }

  /**
   * @summary Return a darker version of this color by a percentage.
   * @description A parameter of 1.0 returns black, and 0.0 returns an identical color.
   * @see Color#lighten
   * @param   p must be between -1.0 and 1.0; the amount by which to darken this color
   * @param   relative should the luminosity subtracted be relative?
   * @returns a new Color object that corresponds to this color darkened by `p`
   */
  darken(p: number, relative = false): this {
    return this.lighten(-p, relative)
  }

  /**
   * @summary Return a new color with the complemented alpha of this color.
   * @description E.g. an alpha of 0.7, complemented, is 0.3 (the complement with 1.0).
   * @returns a new Color object with the same color but complemented alpha
   */
  negate(): this {
    return new Color(...this.rgb, 1 - this.alpha)
  }

  /**
   * @summary Return a less faded (larger alpha) version of this color.
   * @description A parameter of 1.0 returns full opaqueness, and 0.0 returns an identical color.
   * A negative parameter will {@link Color#fadeOut|fade out} this color.
   * Set `relative = true` to specify the amount as relative to the color’s current opacity.
   * @param   p must be between -1.0 and 1.0; the amount by which to fade in this color
   * @param   relative should the alpha added be relative?
   * @returns a new Color object that corresponds to this color faded in by `p`
   */
  fadeIn(p: number, relative = false): this {
    let newalpha: number = this.alpha + (relative ? (this.alpha * p) : p)
    newalpha = Math.min(Math.max(0, newalpha), 1)
    return new Color(...this.rgb, newalpha)
  }

  /**
   * @summary Return a more faded (smaller alpha) version of this color.
   * @description A parameter of 1.0 returns transparent, and 0.0 returns an identical color.
   * @see Color#fadeIn
   * @param   p must be between -1.0 and 1.0; the amount by which to fade out this color
   * @param   relative should the alpha subtracted be relative?
   * @returns a new Color object that corresponds to this color faded out by `p`
   */
  fadeOut(p: number, relative = false): this {
    return this.fadeIn(-p, relative)
  }



  /**
   * @summary Mix (average) another color with this color, with a given weight favoring that color.
   * @description If `weight == 0.0`, return exactly this color.
   * `weight == 1.0` return exactly the other color.
   * `weight == 0.5` (default if omitted) return a perfectly even mix.
   * In other words, `weight` is "how much of the other color you want."
   * Note that `color1.mix(color2, weight)` returns the same result as `color2.mix(color1, 1-weight)`.
   * @param   color the second color
   * @param   weight between 0.0 and 1.0; the weight favoring the other color
   * @returns a mix of the two given colors
   */
  mix(color: Color, weight = 0.5): this {
    let red  : number = Math.round(average(this.red  , color.red  , weight))
    let green: number = Math.round(average(this.green, color.green, weight))
    let blue : number = Math.round(average(this.blue , color.blue , weight))
    let alpha: number = Color._compoundOpacity([this.alpha, color.alpha])
    return new Color(red, green, blue, alpha)
  }

  /**
   * @summary Blur another color with this color, with a given weight favoring that color.
   * @description Behaves almost exactly the same as {@link Color#mix},
   * except that this method uses a more visually accurate, slightly brighter, mix.
   * @see {@link https://www.youtube.com/watch?v=LKnqECcg6Gw|“Computer Color is Broken” by minutephysics}
   * @param   color the second color
   * @param   weight between 0.0 and 1.0; the weight favoring the other color
   * @returns a blur of the two given colors
   */
  blur(color: Color, weight = 0.5): this {
    /**
     * @summary Calculate the compound value of two overlapping same-channel values.
     * @private
     * @param   c1 the first channel value (red, green, or blue)
     * @param   c2 the second channel value (corresponding to `c1`)
     * @returns the compounded value
     */
    function compoundChannel(c1: number, c2: number) {
      return Color._linear_sRGB(average(Color._sRGB_Linear(c1), Color._sRGB_Linear(c2), weight))
    }
    let red  : number = Math.round(compoundChannel(this.red  , color.red  ))
    let green: number = Math.round(compoundChannel(this.green, color.green))
    let blue : number = Math.round(compoundChannel(this.blue , color.blue ))
    let alpha: number =    Color._compoundOpacity([this.alpha, color.alpha])
    return new Color(red, green, blue, alpha)
  }

  /**
   * @summary Compare this color with another color.
   * @description Return `true` if they are the same color.
   * Colors are the “same” iff they have exactly the same RGBA channels.
   * Thus, “same” colors are “replaceable”.
   * @param   color a Color object
   * @returns is the argument the “same” color as this color?
   */
  equals(color: Color): boolean {
    if (this === color) return true
    if (this.alpha === 0 && color.alpha === 0) return true
    return (
         this.red   === color.red
      && this.green === color.green
      && this.blue  === color.blue
      && this.alpha === color.alpha
    )
  }

  /**
   * @summary Return the *relative luminance* of this color.
   * @description
   * The relative luminance of a color is the perceived brightness of that color.
   * Note that this is different from the actual luminosity of the color.
   * For examle, lime (`#00ff00`) and blue (`#0000ff`) both have a luminosity of 0.5,
   * even though lime is perceived to be much brighter than blue.
   * In fact, the relative luminance of lime is 0.72 — about ten times that of blue’s, which is only 0.07.
   *
   * In this method, alpha is ignored, that is, the color is assumed to be opaque.
   * @see https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
   * @see https://en.wikipedia.org/wiki/Relative_luminance#Relative_luminance_in_colorimetric_spaces
   * @returns the relative luminance of this color, a number 0–1
   */
  relativeLuminance(): number {
    return 0.2126 * Color._sRGB_Linear(this.red   / 255)
         + 0.7152 * Color._sRGB_Linear(this.green / 255)
         + 0.0722 * Color._sRGB_Linear(this.blue  / 255)
  }

  /**
   * @summary Return the *contrast ratio* between two colors.
   * @see https://www.w3.org/TR/WCAG/#dfn-contrast-ratio
   * @param   color the second color to check
   * @returns the contrast ratio of this color with the argument, a number 1–21
   */
  contrastRatio(color: Color): number {
    let rl_this:  number =  this.relativeLuminance()
    let rl_color: number = color.relativeLuminance()
    return (Math.max(rl_this, rl_color) + 0.05) / (Math.min(rl_this, rl_color) + 0.05)
  }

  /**
   * Return a string name of this color, if one exists.
   * @see {@link https://www.w3.org/TR/css-color-4/#named-colors|Named Colors | CSS Color Module Level 4}
   * @returns the name of this color, else `null` if it does not have one
   */
  name(): string|null {
    const returned: [string, number][]|null = Object.entries(NAMES).find((c) => c[1].toLowerCase() === this.toString(Color.Space.HEX)) || null
    return (returned || [null])[0]
  }
}
