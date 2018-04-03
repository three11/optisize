/**
 * Internal dependencies
 */
const { join } = require('path');
const { writeFileSync } = require('fs');

/**
 * External dependencies
 */
const glob = require('glob');
const sharp = require('sharp');

/**
 * Imagemin dependencies
 */
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminPNGquant = require('imagemin-pngquant');

/**
 * Imagemin settings
 *
 * @type {Array}
 */
const plugins = [
	imageminGifsicle({
		interlaced: true
	}),

	imageminMozjpeg({
		quality: 70
	}),

	imageminPNGquant({
		speed: 1,
		quality: 70
	})
];

/**
 * Glob pattern for all images
 *
 * @type {String}
 */
const imagesGlob = '/*.{jpeg,jpg,gif,png}';

/**
 * Resize an image using Sharp
 *
 * @param  {Object} params
 * @param  {String} file
 *
 * @return {Promise}
 */
const optisizeSingle = async (params, file) => {
	return await sharp(file)
		.resize(params.width, params.height)
		.toBuffer()
		.then(buffer => imagemin.buffer(buffer, { plugins }))
		.then(buffer => {
			writeFileSync(file, buffer);

			return buffer;
		});
};

/**
 * Resize images
 *
 * @param  {Object} params Settings
 *
 * @return {Promise}
 */
const optisize = async params => {
	const { src } = params;
	const files = glob
		.sync(`${src}/**${imagesGlob}`)
		.map(file => optisizeSingle(params, file));

	return Promise.all(files);
};

module.exports = optisize;
