#!/usr/bin/env node
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import optisize from './optisize.js';

const argv = yargs(hideBin(process.argv)).options({
	src: { type: 'string' },
	width: { type: 'number' },
	height: { type: 'number' }
}).argv;

(async () => {
	const { src, width, height } = await argv;

	await optisize({ src, width, height });
})();
