var Color = require('./index.js')


function color() {
  console.log(new Color(128,128,128, 0.5))
  console.log(new Color(64,128,256))
  console.log(new Color())
}

function color_hsvHue() {
  console.log(new Color(128,28,228).toString('hsl'))
}

function color_complement() {
}

function color_rotate() {
}

function color_invert() {
}

function color_saturate() {
}

function color_desaturate() {
}

function color_lighten() {
}

function color_darken() {
}

function color_negate() {
}

function color_fadeIn() {
}

function color_fadeOut() {
}

function color_mix() {
}

function color_blur() {
}

function color_equals() {
}

function color_contrastRatio() {
}

function color_toString() {
  console.log(new Color(128,128,128, 0.5).toString(Color.ColorSpace.HWB))
  console.log(new Color(64,128,256).toString(Color.ColorSpace.HWB))
  console.log(new Color().toString(Color.ColorSpace.HWB))
}

function color_fromHSV() {
}

function color_fromHSL() {
}

function color_fromHWB() {
}

function color_fromString() {
  console.log(Color.fromString('hwb(0,0,0)').toString())
  console.log(Color.fromString('#e4f0f6').toString(Color.ColorSpace.HWB))
}

function color_static_mix() {
}


// color();
// color_hsvHue();
// color_complement();
// color_rotate();
// color_invert();
// color_saturate();
// color_desaturate();
// color_lighten();
// color_darken();
// color_negate();
// color_fadeIn();
// color_fadeOut();
// color_mix();
// color_blur();
// color_equals();
// color_contrastRatio();
// color_toString();
// color_fromHSV();
// color_fromHSL();
// color_fromHWB();
// color_fromString();
// color_static_mix();
