import {Color} from '../../index'
import test from './test'


export default Promise.all([
	test(new Color(128,128,128, 0.5).rgb.join(), '128,128,128,0.5'),
	test(new Color( 64,128,255     ).rgb.join(), '64,128,255,1'),
	test(new Color(                ).rgb.join(), '0,0,0,0'),
])
