/**
 * External dependencies
 */
const sizeOf = require('image-size');

/**
 * Test environment
 */
const src = 'assets';
const tape = require('tape');
const optisize = require('./');

tape('width should be 1000', t => {
	optisize({
		src,
		width: 1000
	}).then(files => {
		const { width, height } = sizeOf('assets/unicorn.png');

		t.equal(1000, width);
	});

	t.end();
});

tape('height should be 500', t => {
	optisize({
		src,
		height: 500
	}).then(files => {
		const { width, height } = sizeOf('assets/unicorn.png');

		t.equal(500, height);
	});

	t.end();
});

