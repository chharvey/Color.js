var Util = require('./Util.class.js')

/**
 * A 24-bit color ("True Color") that can be displayed in a pixel, given three primary color components.
 * @type {Color}
 */
module.exports = (function () {
  // CONSTRUCTOR
  /**
   * Construct a Color object.
   * Valid parameters:
   * - new Color([60, 120, 240]) // [red, green, blue]
   * - new Color([192])          // [grayscale]
   * - new Color()               // (black, rgb(0,0,0))
   * The RGB array may be an array of length 3 or 1, containing integers 0–255.
   * If array length is 3, the components are red, green, and blue, in that order.
   * If the length is 1, the red, green, and blue components are equal to that number,
   * which will produce a grayscale color.
   * If no argument is given, the color will be black (#000000).
   * @constructor
   * @param {Array<number>=[0]} $rgb an array of 1 or 3 integers in [0,255]
   */
  function Color($rgb) {
    var self = this
    if (arguments.length >= 1 && $rgb.length >= 3) {
      /**
       * The red component of this color. An integer in [0,255].
       * @type {number}
       */
      self._RED   = $rgb[0]
      /**
       * The green component of this color. An integer in [0,255].
       * @type {number}
       */
      self._GREEN = $rgb[1]
      /**
       * The blue component of this color. An integer in [0,255].
       * @type {number}
       */
      self._BLUE  = $rgb[2]
    } else if (arguments.length >= 1 && $rgb.length >= 1) {
      return Color.call(self, [ $rgb[0], $rgb[0], $rgb[0] ])
    } else /* if (arguments.length < 1) */ {
      return Color.call(self, [0])
    }

    var _max = Math.max(self._RED, self._GREEN, self._BLUE) / 255
    var _min = Math.min(self._RED, self._GREEN, self._BLUE) / 255
    var _chroma = _max - _min

    /**
     * The HSV-space hue of this color, or what "color" this color is.
     * A number bound by [0, 360).
     * @type {number}
     */
    self._HSV_HUE = (function () {
      if (_chroma === 0) return 0
      var rgb_norm = [
        self._RED   / 255
      , self._GREEN / 255
      , self._BLUE  / 255
      ]
      return [
        function (r, g, b) { return ((g - b) / _chroma + 6) % 6 * 60 }
      , function (r, g, b) { return ((b - r) / _chroma + 2)     * 60 }
      , function (r, g, b) { return ((r - g) / _chroma + 4)     * 60 }
      ][rgb_norm.indexOf(_max)].apply(null, rgb_norm)
      /*
       * Exercise: prove:
       * _HSV_HUE === Math.atan2(Math.sqrt(3) * (g - b), 2*r - g - b)
       */
    })()

    /**
     * The brightness of this color. A lower value means the color is closer to black, a higher
     * value means the color is more true to its hue.
     * The HSV-space value ("brightness") of this color is equivalent to the ratio of the
     * brightest RGB-component’s value to 255, as a percentage.
     * A number bound by [0, 1].
     * @type {number}
     */
    self._HSV_VAL = (function () {
      return _max
    })()

    /**
     * The vividness of this color. A lower saturation means the color is closer to white,
     * a higher saturation means the color is more true to its hue.
     * A number bound by [0, 1].
     * @type {number}
     */
    self._HSV_SAT = (function () {
      if (_chroma === 0) return 0 // avoid div by 0
      return _chroma / self._HSV_VAL
    })()

    /**
     * The Hue of this color. Identical to `this._HSV_HUE`.
     * A number bound by [0, 360).
     * @type {number}
     */
    self._HSL_HUE = (function () {
      return self._HSV_HUE
    })()

    /**
     * How "white" or "black" the color is. A lower luminosity means the color is closer to black,
     * a higher luminosity means the color is closer to white.
     * A number bound by [0, 1].
     * @type {number}
     */
    self._HSL_LUM = (function () {
      return 0.5 * (_max + _min)
    })()

    /**
     * The amount of "color" in the color. A lower saturation means the color is more grayer,
     * a higher saturation means the color is more colorful.
     * A number bound by [0, 1].
     * @type {number}
     */
    self._HSL_SAT = (function () {
      if (_chroma === 0) return 0 // avoid div by 0
      return _chroma / ((self._HSL_LUM <= 0.5)  ?  2*self._HSL_LUM  :  (2 - 2*self._HSL_LUM))
      /*
       * Exercise: prove:
       * _HSL_SAT === _chroma / (1 - Math.abs(2*self._HSL_LUM - 1))
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
    })()
  }


  // ACCESSOR FUNCTIONS
  /**
   * Get the red component of this color.
   * @return {number} the red component of this color
   */
  Color.prototype.red = function red() { return this._RED }
  /**
   * Get the green component of this color.
   * @return {number} the green component of this color
   */
  Color.prototype.green = function green() { return this._GREEN }
  /**
   * Get the blue component of this color.
   * @return {number} the blue component of this color
   */
  Color.prototype.blue = function blue() { return this._BLUE }

  /**
   * Get the hsv-hue of this color.
   * @return {number} the hsv-hue of this color
   */
  Color.prototype.hsvHue = function hsvHue() { return this._HSV_HUE }
  /**
   * Get the hsv-saturation of this color.
   * @return {number} the hsv-saturation of this color
   */
  Color.prototype.hsvSat = function hsvSat() { return this._HSV_SAT }
  /**
   * Get the hsv-value of this color.
   * @return {number} the hsv-value of this color
   */
  Color.prototype.hsvVal = function hsvVal() { return this._HSV_VAL }

  /**
   * Get the hsl-hue of this color.
   * @return {number} the hsl-hue of this color
   */
  Color.prototype.hslHue = function hslHue() { return this._HSL_HUE }
  /**
   * Get the hsl-saturation of this color.
   * @return {number} the hsl-saturation of this color
   */
  Color.prototype.hslSat = function hslSat() { return this._HSL_SAT }
  /**
   * Get the hsl-luminosity of this color.
   * @return {number} the hsl-luminosity of this color
   */
  Color.prototype.hslLum = function hslLum() { return this._HSL_LUM }

  // Convenience getter functions.
  /**
   * Return an array of RGB components (in that order).
   * @return {Array<number>} an array of RGB components
   */
  Color.prototype.rgb = function rgb() { return [this.red(), this.green(), this.blue()] }
  /**
   * Return an array of HSV components (in that order).
   * @return {Array<number>} an array of HSV components
   */
  Color.prototype.hsv = function hsv() { return [this.hsvHue(), this.hsvSat(), this.hsvVal()] }
  /**
   * Return an array of HSL components (in that order).
   * @return {Array<number>} an array of HSL components
   */
  Color.prototype.hsl = function hsl() { return [this.hslHue(), this.hslSat(), this.hslLum()] }


  // METHODS
  /**
   * Return a new color that is the complement of this color.
   * The complement of a color is the difference between that color and white (#fff).
   * @return {Color} a new Color object that corresponds to this color’s complement
   */
  Color.prototype.complement = function complement() {
    return new Color([
      255 - this.red()
    , 255 - this.green()
    , 255 - this.blue()
    ])
  }

  /**
   * Return a new color that is a hue-rotation of this color.
   * @param  {number} a the number of degrees to rotate
   * @return {Color} a new Color object corresponding to this color rotated by `a` degrees
   */
  Color.prototype.rotate = function rotate(a) {
    var newhue = (this.hsvHue() + a) % 360
    return Color.fromHSV(newhue, this.hsvSat(), this.hsvVal())
  }

  /**
   * Return a new color that is the inverse of this color.
   * The inverse of a color is that color with a hue rotation of 180 degrees.
   * @return {Color} a new Color object that corresponds to this color’s inverse
   */
  Color.prototype.invert = function invert() {
    return this.rotate(180)
  }

  /**
   * Return a new color that is a more saturated (more colorful) version of this color by a percentage.
   * This method calculates saturation in the HSL space.
   * A parameter of 1.0 returns a color with full saturation, and 0.0 returns an identical color.
   * A negative number will {@link Color.desaturate()|desaturate} this color.
   * @param  {number} p must be between -1.0 and 1.0; the value by which to saturate this color
   * @param  {boolean=} relative true if the saturation added is relative
   * @return {Color} a new Color object that corresponds to this color saturated by `p`
   */
  Color.prototype.saturate = function saturate(p, relative) {
    var newsat = this.hslSat() + (relative ? (this.hslSat() * p) : p)
    newsat = Math.min(Math.max(0, newsat), 1)
    return Color.fromHSL(this.hslHue(), newsat, this.hslLum())
  }

  /**
   * Return a new color that is a less saturated version of this color by a percentage.
   * A parameter of 1.0 returns a grayscale color, and 0.0 returns an identical color.
   * @see Color.saturate()
   * @param  {number} p must be between -1.0 and 1.0; the value by which to desaturate this color
   * @param  {boolean=} relative true if the saturation subtracted is relative
   * @return {Color} a new Color object that corresponds to this color desaturated by `p`
   */
  Color.prototype.desaturate = function desaturate(p, relative) {
    return this.saturate(-p, relative)
  }

  /**
   * Return a new color that is a brighter version of this color by a percentage.
   * This method calculates with luminosity in the HSL space.
   * A parameter of 1.0 returns white (#fff), and 0.0 returns an identical color.
   * A negative parameter will {@link Color.darken()|darken} this color.
   *
   * Set `relative = true` to specify the amount as relative to the color’s current brightness.
   * For example, if `$color` has an HSL-lum of 0.5, then calling `$color.brighten(0.5)` will return
   * a new color with an HSL-lum of 1.0, because the argument 0.5 is simply added to the color’s luminosity.
   * However, calling `$color.brighten(0.5, true)` will return a new color with an HSL-lum of 0.75,
   * because the argument 0.5, relative to the color’s current luminosity of 0.5, results in
   * an added luminosity of 0.25.
   *
   * @param {number} p must be between -1.0 and 1.0; the amount by which to lighten this color
   * @param {boolean=} relative true if the luminosity added is relative
   * @return {Color} a new Color object that corresponds to this color brightened by `p`
   */
  Color.prototype.brighten = function brighten(p, relative) {
    var newlum = this.hslLum() + (relative ? (this.hslLum() * p) : p)
    newlum = Math.min(Math.max(0, newlum), 1)
    return Color.fromHSL(this.hslHue(), this.hslSat(), newlum)
  }

  /**
   * Return a new color that is a darker version of this color by a percentage.
   * A parameter of 1.0 returns black (#000), and 0.0 returns an identical color.
   * @see Color.brighten()
   * @param {number} p must be between -1.0 and 1.0; the amount by which to darken this color
   * @param {boolean=} relative true if the luminosity subtracted is relative
   * @return {Color} a new Color object that corresponds to this color darkened by `p`
   */
  Color.prototype.darken = function darken(p, relative) {
    return this.brighten(-p, relative)
  }

  /**
   * Mix (average) another color with this color, with a given weight favoring that color.
   * If `w == 0.0`, return exactly this color.
   * `w == 1.0` return exactly the other color.
   * `w == 0.5` (default if omitted) return a perfectly even mix.
   * In other words, `w` is "how much of the other color you want."
   * Note that `color1.mix(color2, w)` returns the same result as `color2.mix(color1, 1-w)`.
   * @param {Color} $color the second color
   * @param {number=0.5} w between 0.0 and 1.0; the weight favoring the other color
   * @return {Color} a mix of the two given colors
   */
  Color.prototype.mix = function mix($color, w) {
    if (arguments.length >= 2) {
    /**
     * Helper function. Average two numbers, with a weight favoring the 2nd number.
     * @param  {number} a 1st number
     * @param  {number} b 2nd number
     * @param  {number} w number between [0,1]; weight of 2nd number
     * @return {number} the weighted average of `a` and `b`
     */
    function average(a, b, w) {
      return (a * (1-w)) + (b * w)
    }
    return new Color([
      Math.round(average(this.red(),   $color.red(),   w))
    , Math.round(average(this.green(), $color.green(), w))
    , Math.round(average(this.blue(),  $color.blue(),  w))
    ])
    } else return this.mix($color, 0.5)
  }

  /**
   * Compare this color with another color.
   * Return `true` if they are the same color.
   * @param  {Color} $color a Color object
   * @return {boolean} true if the argument is the same color as this color
   */
  Color.prototype.equals = function equals($color) {
    return (this.hsvSat()===0 && $color.hsvSat()===0 && (this.hsvVal() === $color.hsvVal())) // NOTE speedy
      || (
         (this.red()   === $color.red())
      && (this.green() === $color.green())
      && (this.blue()  === $color.blue())
      )
  }
  /**
   * Return the *contrast ratio* between two colors.
   * More info can be found at
   * {@link https://www.w3.org/TR/WCAG/#contrast-ratiodef}
   * @param {Color} $color the second color to check
   * @return {number} the contrast ratio of this color with the argument
   */
  Color.prototype.contrastRatio = function contrastRatio($color) {
    /**
     * Return the relative lumance of a color.
     * @param  {Color} c a Color object
     * @return {number} the relative lumance of the color
     */
    function luma(c) {
      /**
       * A helper function.
       * @param  {number} p a decimal representation of an rgb component of a color
       * @return {number} the output of some mathematical function of `p`
       */
      function coef(p) {
        return (p <= 0.03928) ? p/12.92 : Math.pow((p + 0.055)/1.055, 2.4)
      }
      return 0.2126*coef(c.red()  /255)
           + 0.7152*coef(c.green()/255)
           + 0.0722*coef(c.blue() /255)
    }
    var both = [luma(this), luma($color)]
    return (Math.max.apply(null, both) + 0.05) / (Math.min.apply(null, both) + 0.05)
  }

  /**
   * Return a string representation of this color.
   * If `space === 'hex'`, return `#rrggbb`
   * If `space === 'hsv'`, return `hsv(h, s, v)`
   * If `space === 'hsl'`, return `hsl(h, s, l)`
   * If `space === 'rgb'` (default), return `rgb(r, g, b)`
   * IDEA may change the default to 'hex' instead of 'rgb', once browsers support ColorAlpha hex (#rrggbbaa)
   * https://drafts.csswg.org/css-color/#hex-notation
   * @param {string='rgb'} space represents the space in which this color exists
   * @return {string} a string representing this color.
   */
  Color.prototype.toString = function toString(space) {
    if (space === 'hex') return '#' + Util.toHex(this.red()) + Util.toHex(this.green())  + Util.toHex(this.blue())
    if (space === 'hsv') return 'hsv(' + this.hsvHue() + ', ' + this.hsvSat() + ', ' + this.hsvVal() + ')'
    if (space === 'hsl') return 'hsl(' + this.hslHue() + ', ' + this.hslSat() + ', ' + this.hslLum() + ')'
                         return 'rgb(' + this.red()    + ', ' + this.green()  + ', ' + this.blue()   + ')'
    // CHANGED ES6
    // if (space === 'hex') return `#${Util.toHex(this.red())}${Util.toHex(this.green())}${Util.toHex(this.blue())}`
    // if (space === 'hsv') return `hsv(${this.hsvHue()}, ${this.hsvSat()}, ${this.hsvVal()})`
    // if (space === 'hsl') return `hsl(${this.hslHue()}, ${this.hslSat()}, ${this.hslLum()})`
    //                      return `rgb(${this.red()   }, ${this.green() }, ${this.blue()  })`
  }


  // STATIC MEMBERS
  /**
   * Return a new Color object, given hue, saturation, and value in HSV-space.
   * @param {number} hue must be between 0 and 360; hue in HSV-space
   * @param {number} sat must be between 0.0 and 1.0; saturation in HSV-space
   * @param {number} val must be between 0.0 and 1.0; brightness in HSV-space
   * @return {Color} a new Color object with hsv(hue, sat, val)
   */
  Color.fromHSV = function fromHSV(hue, sat, val) {
    var c = sat * val
    var x = c * (1 - Math.abs(hue/60 % 2 - 1))
    var m = val - c
    var rgb;
         if (  0 <= hue && hue <  60) { rgb = [c, x, 0] }
    else if ( 60 <= hue && hue < 120) { rgb = [x, c, 0] }
    else if (120 <= hue && hue < 180) { rgb = [0, c, x] }
    else if (180 <= hue && hue < 240) { rgb = [0, x, c] }
    else if (240 <= hue && hue < 300) { rgb = [x, 0, c] }
    else if (300 <= hue && hue < 360) { rgb = [c, 0, x] }
    return new Color(rgb.map(function (el) { return Math.round((el + m) * 255) }))
  }

  /**
   * Return a new Color object, given hue, saturation, and luminosity.
   * @param {number} hue must be between 0 and 360; hue in HSL-space (same as hue in HSV-space)
   * @param {number} sat must be between 0.0 and 1.0; saturation in HSL-space
   * @param {number} lum must be between 0.0 and 1.0; luminosity in HSL-space
   * @return {Color} a new Color object with hsl(hue, sat, lum)
   */
  Color.fromHSL = function fromHSL(hue, sat, lum) {
    var c = sat * (1 - Math.abs(2*lum - 1))
    var x = c * (1 - Math.abs(hue/60 % 2 - 1))
    var m = lum - c/2
    var rgb;
         if (  0 <= hue && hue <  60) { rgb = [c, x, 0] }
    else if ( 60 <= hue && hue < 120) { rgb = [x, c, 0] }
    else if (120 <= hue && hue < 180) { rgb = [0, c, x] }
    else if (180 <= hue && hue < 240) { rgb = [0, x, c] }
    else if (240 <= hue && hue < 300) { rgb = [x, 0, c] }
    else if (300 <= hue && hue < 360) { rgb = [c, 0, x] }
    return new Color(rgb.map(function (el) { return Math.round((el + m) * 255) }))
  }

  /**
   * Return a new Color object, given a string.
   * The string may have either of the following formats:
   * 1. `#rrggbb`, with hexadecimal RGB components (in base 16, out of ff, lowercase). The `#` must be included.
   * 2. `rgb(r,g,b)` or `rgb(r, g, b)`, with integer RGB components (in base 10, out of 255).
   * 3. `hsv(h,s,v)` or `hsv(h, s, v)`, with decimal HSV components (in base 10).
   * 4. `hsl(h,s,l)` or `hsl(h, s, l)`, with decimal HSL components (in base 10).
   * @param {string} str a string of one of the forms described
   * @return {Color} a new Color object constructed from the given string
   */
  Color.fromString = function fromString(str) {
    if (str.slice(0,1) === '#' && str.length === 7) {
      return new Color([
        str.slice(1,3)
      , str.slice(3,5)
      , str.slice(5,7)
      ].map(Util.toDec))
    }
    if (str.slice(0,4) === 'rgb(') {
      return new Color(Util.components(4, str))
    }
    if (arg.slice(0,4) === 'hsv(') {
      return Color.fromHSV.apply(null, Util.components(4, str))
    }
    if (arg.slice(0,4) === 'hsl(') {
      return Color.fromHSL.apply(null, Util.components(4, str))
    }
    return null
  }

  return Color
})()
