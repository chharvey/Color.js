# extrajs-color
A css color in Javascript.


## Usage

install:
```bash
$ npm install extrajs-color
```
use:
```js
const Color = require('extrajs-color')
let red = new Color(255, 0, 0)
let green_fade = new Color(0, 255, 0, 0.5)
```

## API Docs (by example)

This section serves as documentation by example.
More rigorous API documentation is coming soon,
but the examples below illustrate typical ways to use this package.

Each example is a code snippet, that, when nested inside a function, would return `true`.
The function definition block is omitted for brevity.

### Stability Levels
- **(0) OBSOLETE**    : This feature is no longer supported. Do not use it.
- **(1) DEPRECATED**  : Breaking changes are planned for this feature, or it will be removed in future versions. It is no longer in development, and should not be relied upon.
- **(2) EXPERIMENTAL**: This feature is in development, but is unsupported or subject to change. It could be removed in future versions.
- **(3) STABLE**      : This feature has been tested and proven satisfactory. It is in development, but no breaking changes will be made unless absolutely necessary.
- **(4) LOCKED**      : Only patches will be made to this feature. It may be heavily relied upon and will not be removed in future versions.


### Constructor

#### `new color(r=0, g=0, b=0, a=1)` (STABLE)
Construct a new color.
Alpha is 1 by default. Exception: passing no arguments constructs the transparent color.
```js
let c1 = new Color(64,96,255,0.75)
let c2 = new Color(128,64,96)
let c3 = new Color()
return (
  c1.rgb.join() === `64,96,255,0.75`
  && c2.rgb.join() === `128,64,96,1`
  && c3.rgb.join() === `0,0,0,0` // not `0,0,0,1`
)
```


### Getters and Setters

#### get `number : #red` (LOCKED)
Return the red component of the color.
```js
return new Color(12,24,48,0.66).red === 12
```

#### get `number : #green` (LOCKED)
Return the green component of the color.
```js
return new Color(12,24,48,0.66).green === 24
```

#### get `number : #blue` (LOCKED)
Return the blue component of the color.
```js
return new Color(12,24,48,0.66).blue === 48
```

#### get `number : #alpha` (LOCKED)
Return the alpha of the color.
```js
return new Color(12,24,48,0.66).alpha === 0.66
```

#### get `number : #hsvHue` (LOCKED)
Return the hue (in degrees) in HSV-space.
```js
return new Color(255,0,0).hsvHue === 0
```

#### get `number : #hsvSat` (LOCKED)
Return the saturation in HSV-space.
```js
return new Color(255,0,0).hsvSat === 1
```

#### get `number : #hsvVal` (LOCKED)
Return the value (brightness) in HSV-space.
```js
return new Color(255,0,0).hsvVal === 1
```

#### get `number : #hslHue` (LOCKED)
Return the hue (in degrees) in HSL-space.
```js
return new Color(255,0,0).hslHue === 0
```

#### get `number : #hslSat` (LOCKED)
Return the saturation in HSL-space.
```js
return new Color(255,0,0).hslSat === 1
```

#### get `number : #hslLum` (LOCKED)
Return the luminosity in HSL-space.
```js
return new Color(255,0,0).hslLum === 0.5
```

#### get `number : #hwbHue` (LOCKED)
Return the hue (in degrees) in HWB-space.
```js
return new Color(255,0,0).hwbHue === 0
```

#### get `number : #hwbWht` (LOCKED)
Return the white value in HWB-space.
```js
return new Color(255,0,0).hwbWht === 0
```

#### get `number : #hwbBlk` (LOCKED)
Return the black value in HWB-space.
```js
return new Color(255,0,0).hwbBlk === 0
```

#### get `Array<number>(4) : #rgb` (LOCKED)
##### alias: `#rgba`
Return an array of this color’s RGB components.
```js
return new Color(255,0,0).rgb.join() === `255,0,0`
```

#### get `Array<number>(4) : #hsv` (LOCKED)
##### alias: `#hsva`
Return an array of this color’s HSV components.
```js
return new Color(255,0,0).hsv.join() === `0,1,1`
```

#### get `Array<number>(4) : #hsl` (LOCKED)
##### alias: `#hsla`
Return an array of this color’s HSL components.
```js
return new Color(255,0,0).hsl.join() === `0,1,0.5`
```

#### get `Array<number>(4) : #hwb` (LOCKED)
##### alias: `#hwba`
Return an array of this color’s HWB components.
```js
return new Color(255,0,0).hwb.join() === `0,0,0`
```



### Color Operation Methods

#### `#complement()` (LOCKED)
Return the complement of this color.
```js
return new Color(10,20,30).complement().rgb.join() === `245,235,225`
```

#### `#rotate()` (LOCKED)
Return a new color rotated by an angle (in degrees).
```js
return new Color(255,0,0).rotate(120).rgb.join() === `0,255,0`
```

#### `#invert()` (LOCKED)
Return a new color rotated by 180 degrees.
```js
return new Color(128,0,0).invert().rgb.join() === `0,128,128`
```

#### `#saturate()` (LOCKED)
Return a new color, saturated (in HSL-space) by a number.
```js
```

#### `#desaturate()` (LOCKED)
Return a new color, desaturated (in HSL-space) by a number.
```js
```

#### `#lighten()` (LOCKED)
Return a new color, lightened (in HSL-space) by a number.
```js
```

#### `#darken()` (LOCKED)
Return a new color, darkened (in HSL-space) by a number.
```js
```

#### `#negate()` (LOCKED)
Return a new color, with a complemented alpha component.
```js
```

#### `#fadeIn()` (LOCKED)
Return a new color, with an increased alpha component.
```js
```

#### `#fadeOut()` (LOCKED)
Return a new color, with a decreased alpha component.
```js
```



### Color Comparison Methods

#### `#mix()` (STABLE)
Mix two colors together, returning a new color.
```js
```
Provide a weight, favoring the given color.
`1.0` returns the other color; `0.0` returns this color;
`0.5` returns an even mix (the default behavior).
```js
```

#### `#blur()` (STABLE)
Like `#mix()`, but with a more aesthetic and user-friendly calculation. Use when blurring two colors together.
Watch [“Computer Color is Broken” by minutephysics](https://www.youtube.com/watch?v=LKnqECcg6Gw) to find out why.
```js
```
Provide a weight, favoring the given color:
```js
```

#### `#equals()` (STABLE)
Return `true` if this color equals the given color.
“Equals” means “replaceable”, that is, the RGBA components are equal.
```js
```

#### `#constrastRatio()` (STABLE)
Return the contrast ratio between two colors (ignoring alpha).
[What is contrast ratio?](https://www.w3.org/TR/WCAG/#contrast-ratiodef)
```js
```

#### `#toString()` (STABLE)
Return a string representation of this color. Parameter must be of `Color.Space` enum type.
```js
let c1 = new Color(255, 0, 0)
let c2 = new Color(255, 0, 0, 0.5)
let c1_strings = (
  c1.toString() === c1.toString(Color.Space.HEX)
  && c1.toString(Color.Space.HEX) === `#ff0000`
  && c1.toString(Color.Space.RGB) === `rgb(255, 0, 0)`
  && c1.toString(Color.Space.HSV) === `hsv(0, 1, 1)`
  && c1.toString(Color.Space.HSL) === `hsl(0, 1, 0.5)`
  && c1.toString(Color.Space.HWB) === `hwb(0, 0, 0)`
)
let c2_strings = (
  c2.toString() === c2.toString(Color.Space.HEX)
  && c2.toString(Color.Space.HEX) === `#ff000080`
  && c2.toString(Color.Space.RGB) === `rgba(255, 0, 0, 0.5)`
  && c2.toString(Color.Space.HSV) === `hsva(0, 1, 1, 0.5)`
  && c2.toString(Color.Space.HSL) === `hsla(0, 1, 0.5, 0.5)`
  && c2.toString(Color.Space.HWB) === `hwba(0, 0, 0, 0.5)`
)
return c1_strings && c2_strings
```



### Static Methods

#### `Color.fromHSV()` (LOCKED)
##### alias: `Color.fromHSVA()`
Construct a new color given HSV component parameters.
```js
```

#### `Color.fromHSL()` (LOCKED)
##### alias: `Color.fromHSLA()`
Construct a new color given HSL component parameters.
```js
```

#### `Color.fromHWB()` (LOCKED)
##### alias: `Color.fromHWBA()`
Construct a new color given HWB component parameters.
```js
```

#### `Color.fromString()` (LOCKED)
Construct a new color given a css-valid color string.
```js
```

#### `Color.mix()` (STABLE)
Mix an arbitrary number of colors evenly. Differs from `Color#mix()` in that chaining those functions results in uneven mixes.
```js
```



### Inner Classes

#### enum `Color.Space` (STABLE)
Enumeration for types of css-valid string representations of a color.
Each space applies to both opaque and translucent colors.

Enum constant      | opaque form    | translucent form
------------------ | -------------- | ------------------
`Color.Space.HEX`  | `#rrggbb`      | `#rrggbbaa`
`Color.Space.RGB`  | `rgb(r, g, b)` | `rgba(r, g, b, a)`
`Color.Space.HSV`  | `hsv(h, s, v)` | `hsva(h, s, v, a)`
`Color.Space.HSL`  | `hsl(h, s, l)` | `hsla(h, s, l, a)`
`Color.Space.HWB`  | `hwb(h, w, b)` | `hwba(h, w, b, a)`
