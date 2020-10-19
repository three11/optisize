/**
 * Node dependencies
 */
const { resolve } = require('path');
const { writeFileSync, existsSync, lstatSync } = require('fs');

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
	// @ts-ignore
	imageminPNGquant({
		quality: [0.5, 0.7]
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
 * @return {Promise<Buffer | void>}
 */
const optisizeFile = async (params, file) => {
	return await sharp(file)
		.resize(params.width, params.height)
		.toBuffer()
		.then(buffer => imagemin.buffer(buffer, { plugins }))
		.then(buffer => {
			spinner.succeed(`Optisized ${file}`);

			return buffer;
		})
		.catch(err => {
			spinner.fail(`Optisize failed. Output: ${err}`);
		});
};

/**
 * Resize an image using Sharp
 *
 * @param  {Object} params
 * @param  {String} file
 *
 * @return {Promise<void>}
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
	const noSrcMsg = 'Optisize failed: No src provided.';
	const wrongSrcMsg = 'Optisize failed: Wrong src provided.';
	const wrongFileMsg = 'Optisize failed: Wrong file type provided.';

	if (!src) {
		spinner.fail(noSrcMsg);

		return;
	}

	if (!existsSync(src)) {
		spinner.fail(wrongSrcMsg);

		return;
	}

	const isDir = lstatSync(src).isDirectory();

	if (!isDir && !src.match(/.(jpg|jpeg|png|gif)$/i)) {
		spinner.fail(wrongFileMsg);

		return;
	}

	const files = isDir ? glob.sync(`${resolve(src)}/**${imagesGlob}`) : [resolve(src)];
	const results = files.map(file => optisizeSingle(params, file));

	return Promise.all(results);
};

module.exports = optisize;
module.exports.optisizeFile = optisizeFile;
module.exports.optisizeSingle = optisizeSingle;
