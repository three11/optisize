/**
 * Internal dependencies
 */
const { resolve } = require('path');

/**
 * External dependencies
 */
const sizeOf = require('image-size');

/**
 * Test environment
 */
const src = resolve(__dirname, 'assets/src');
const dest = resolve(__dirname, 'assets/dest');

const tape = require('tape');
const resize = require('./');

const original = sizeOf('assets/src/unicorn.png');
const originalAspectRatio = original.width / original.height;

tape('dimensions should match', t => {
	resize({
		src,
		dest
	}).then(files => {
		t.equal(original.width, files[0].width);
		t.equal(original.height, files[0].height);
	});

	t.end();
});

tape('width should be 500', t => {
	resize({
		src,
		dest,
		width: 500
	}).then(files => {
		const { width, height } = files[0];

		t.equal(500, width);
	});

	t.end();
});

tape('should keep aspect ratio', t => {
	resize({
		src,
		dest,
		width: 500
	}).then(files => {
		const { width, height } = files[0];

		t.equal(originalAspectRatio, width / height);
	});

	t.end();
});

tape('height should be 200', t => {
	resize({
		src,
		dest,
		height: 200
	}).then(files => {
		const { width, height } = files[0];

		t.equal(200, height);
	});

	t.end();
});
