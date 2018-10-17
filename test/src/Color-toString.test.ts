import {Color} from '../../index'
import test from './test'


export default Promise.all([
	test(new Color(64,128,256      ).toString(), '#4080ff'),
	test(new Color(64,128,256      ).toString(Color.Space.HWB), 'hwb(219.9, 0.25, 0)'),
	test(new Color(128,128,128, 0.5).toString(Color.Space.HWB), 'hwba(0, 0.5, 0.5, 0.5)'),
	test(new Color(                ).toString(Color.Space.HWB), 'hwba(0, 0, 1, 0)'),
	test(new Color(128,28,228      ).toString(Color.Space.HSL), 'hsl(270, 0.79, 0.5)'),
])
