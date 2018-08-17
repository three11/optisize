/**
 * Node dependencies
 */
const { resolve } = require('path');
const { writeFileSync, existsSync } = require('fs');

/**
 * External dependencies
 */
const ora = require('ora');
const glob = require('glob');
const sharp = require('sharp');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminPNGquant = require('imagemin-pngquant');

/**
 * Imagemin settings
 */
const plugins = [
	imageminGifsicle({
		interlaced: true
	}),
	imageminMozjpeg({
		quality: 70
	}),
	imageminPNGquant({
		quality: 70
	})
];

/**
 * Glob pattern for all images
 */
const imagesGlob = '/*.{jpeg,jpg,gif,png}';

/**
 * Initialize CLI spinner
 */
const spinner = ora({
	text: 'Optisize in progress...',
	spinner: 'bouncingBall'
}).start();

/**
 * Resize an image using Sharp
 *
 * @param  {Object} params
 * @param  {String} file
 *
 * @return {Void}
 */
const optisizeSingle = async (params, file) => {
	return await sharp(file)
		.resize(params.width, params.height)
		.toBuffer()
		.then(buffer => imagemin.buffer(buffer, { plugins }))
		.then(buffer => {
			writeFileSync(file, buffer);

			spinner.succeed(`Optisized ${file}`);
		})
		.catch(err => {
			spinner.fail(`Optisize failed. Output: ${err}`);
		});
};

/**
 * Resize images
 *
 * @param  {Object} params Settings
 *
 * @return {Promise}
 */
const optisize = async (params = {}) => {
	const { src } = params;
	const noSrcMsg = 'Optisized failed: No src provided.';
	const wrongSrcMsg = 'Optisize failed: Wrong src provided.'

	if (!src) {
		spinner.fail(noSrcMsg);

		return Promise.reject(noSrcMsg);
	}

	if (!existsSync(src)){
		spinner.fail(noSrcMsg);

		return Promise.reject(wrongSrcMsg);
	}

	const files = glob
		.sync(`${resolve(src)}/**${imagesGlob}`)
		.map(file => optisizeSingle(params, file));

	return Promise.all(files);
};

module.exports = optisize;
