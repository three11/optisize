/** @typedef {{ src?: string, width?: number, height?: number }} OptisizeParams */

import { resolve } from 'path';
import { writeFileSync, existsSync, lstatSync } from 'fs';

import ora from 'ora';
import sharp from 'sharp';
import { sync } from 'glob';
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminPNGquant from 'imagemin-pngquant';

const plugins = [
	imageminGifsicle({
		interlaced: true
	}),
	imageminMozjpeg({
		quality: 70
	}),
	imageminPNGquant({
		quality: [0.5, 0.7]
	})
];

const imagesGlob = '/*.{jpeg,jpg,gif,png}';

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
export const optisizeFile = async (params, file) =>
	await sharp(file)
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

/**
 * Resize an image using Sharp
 *
 * @param  {OptisizeParams} params
 * @param  {String} file
 *
 * @return {Promise<void>}
 */
export const optisizeSingle = async (params, file) =>
	await sharp(file)
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

/**
 * Resize images
 *
 * @param  {OptisizeParams} params
 *
 * @return {Promise<string | void[]>}
 */
export const optisize = async (params = {}) => {
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

	if (!isDir && !src.match(/.(jpg|jpeg|png|gif)$/i)) {
		spinner.fail(wrongFileMsg);

		return Promise.reject(wrongFileMsg);
	}

	const files = isDir ? sync(`${resolve(src)}/**${imagesGlob}`) : [resolve(src)];
	const results = files.map(file => optisizeSingle(params, file));

	return Promise.all(results);
};

export default optisize;
