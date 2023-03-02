export interface OptisizeParams {
	src?: string;
	width?: number;
	height?: number;
}

import { resolve } from 'node:path';
import { writeFileSync, existsSync, lstatSync } from 'node:fs';

import ora from 'ora';
import glob from 'glob';
import sharp from 'sharp';
import imagemin from 'imagemin';
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

export const optisizeFile = async (params: OptisizeParams, file: string): Promise<void | Buffer> =>
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

export const optisizeSingle = async (params: OptisizeParams, file: string): Promise<void> =>
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

export const optisize = async (params: OptisizeParams = {}): Promise<string | void[]> => {
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

	const files = isDir ? await glob(`${resolve(src)}/**${imagesGlob}`) : [resolve(src)];
	const results = files.map(file => optisizeSingle(params, file));

	return Promise.all(results);
};

export default optisize;
