/** @typedef {{ src?: string, width?: number, height?: number }} OptisizeParams */

import { resolve } from 'path';
import { writeFileSync, existsSync, lstatSync } from 'fs';

import ora from 'ora';
import sharp from 'sharp';
import imagemin from 'imagemin';
import { globby } from 'globby';
import imageminSvgo from 'imagemin-svgo';
import imageminWebp from 'imagemin-webp';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminPNGquant from 'imagemin-pngquant';
import { cosmiconfigSync } from 'cosmiconfig';

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
	imageminPNGquant({
		quality: [0.5, 0.7],
		...(config?.png || {})
	}),
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

	if (!isDir && !src.match(/.(jpg|jpeg|png|gif|svg|webp)$/i)) {
		spinner.fail(wrongFileMsg);

		return Promise.reject(wrongFileMsg);
	}

	const files = isDir ? await globby(`${resolve(src)}/**${imagesGlob}`) : [resolve(src)];
	const results = files.map(file => optisizeSingle(params, file));

	return Promise.all(results);
};

export default optisize;
