/** @typedef {{ src?: string, width?: number, height?: number }} OptisizeParams */

const { resolve } = require('path');
const { writeFileSync, existsSync, lstatSync } = require('fs');

const ora = require('ora');
const sharp = require('sharp');
const imagemin = require('imagemin');
const { globby } = require('globby');
const imageminSvgo = require('imagemin-svgo');
const imageminWebp = require('imagemin-webp');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminPNGquant = require('imagemin-pngquant');
const { cosmiconfigSync } = require('cosmiconfig');

const explorer = cosmiconfigSync('optisize');
const config = explorer.search()?.config;
const plugins = [
	imageminGifsicle({
		interlaced: true,
		...(config?.gif || {})
	}),
	imageminMozjpeg({
		quality: 70,
		...(config?.jpeg || {})
	}),
	// @ts-ignore
	imageminPNGquant({
		quality: [0.5, 0.7],
		...(config?.png || {})
	}),
	// @ts-ignore
	imageminSvgo({
		...(config?.svg || {})
	}),
	imageminWebp({
		quality: 50,
		...(config?.webp || {})
	})
];

const imagesGlob = '/*.{jpeg,jpg,gif,png,svg,webp}';

const spinner = ora({
	text: 'Optisize in progress...',
	spinner: 'bouncingBall'
}).start();

/**
 * Resize an image using Sharp
 *
 * @param  {OptisizeParams} params
 * @param  {String} file
 *
 * @return {Promise<Buffer | void>}
 */
const optisizeFile = async (params, file) =>
	await sharp(file)
		.resize(params.width, params.height)
		.toBuffer()
		// @ts-ignore
		.then(buffer => imagemin.buffer(buffer, { plugins }))
		.then(buffer => {
			spinner.succeed(`Optisized ${file}`);

			return buffer;
		})
		.catch(err => {
			spinner.fail(`Optisize failed. Output: ${err}`);
		});

/**
 * Resize an image using Sharp
 *
 * @param  {OptisizeParams} params
 * @param  {String} file
 *
 * @return {Promise<void>}
 */
const optisizeSingle = async (params, file) =>
	await sharp(file)
		.resize(params.width, params.height)
		.toBuffer()
		// @ts-ignore
		.then(buffer => imagemin.buffer(buffer, { plugins }))
		.then(buffer => {
			writeFileSync(file, buffer);

			spinner.succeed(`Optisized ${file}`);
		})
		.catch(err => {
			spinner.fail(`Optisize failed. Output: ${err}`);
		});

/**
 * Resize images
 *
 * @param  {OptisizeParams} params
 *
 * @return {Promise<string | void[]>}
 */
const optisize = async (params = {}) => {
	const { src } = params;
	const noSrcMsg = 'Optisize failed: No src provided.';
	const wrongSrcMsg = 'Optisize failed: Wrong src provided.';
	const wrongFileMsg = 'Optisize failed: Wrong file type provided.';

	if (!src) {
		spinner.fail(noSrcMsg);

		return Promise.reject(noSrcMsg);
	}

	if (!existsSync(src)) {
		spinner.fail(wrongSrcMsg);

		return Promise.reject(wrongSrcMsg);
	}

	const isDir = lstatSync(src).isDirectory();

	if (!isDir && !src.match(/.(jpg|jpeg|png|gif|svg|webp)$/i)) {
		spinner.fail(wrongFileMsg);

		return Promise.reject(wrongFileMsg);
	}

	const files = isDir ? await globby(`${resolve(src)}/**${imagesGlob}`) : [resolve(src)];
	const results = files.map(file => optisizeSingle(params, file));

	return Promise.all(results);
};

module.exports = optisize;
module.exports.optisize = optisize;
module.exports.optisizeFile = optisizeFile;
module.exports.optisizeSingle = optisizeSingle;
