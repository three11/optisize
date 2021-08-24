// @ts-nocheck

import sizeOf from 'image-size';

import tape from 'tape';
import optisize from './index.mjs';

const src = 'assets';

tape('should warn for missing src', async t => {
	try {
		await optisize();
	} catch (e) {
		t.equal(e, 'Optisize failed: No src provided.');
	}

	t.end();
});

tape('width should be 1000', async t => {
	await optisize({
		src,
		width: 1000
	});

	const { width } = sizeOf('assets/unicorn.png');

	t.equal(1000, width);
	t.end();
});

tape('height should be 500', async t => {
	await optisize({
		src,
		height: 500
	});

	const { height } = sizeOf('assets/unicorn.png');

	t.equal(500, height);
	t.end();
});
