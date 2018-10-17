import {Color} from '../../index'
import test from './test'


export default Promise.all([
	test(new Color(128,0,0).complement().toString(), '#008080'),
])
