/**
 * Internal dependencies
 */
const { join } = require('path');
const { readdirSync } = require('fs');

/**
 * External dependencies
 */
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
 * Filter only image foles
 *
 * @param  {String} file Filename
 *
 * @return {Boolean}
 */
const isImage = file => file.match(/\.(jpeg|jpg|gif|png)$/);

/**
 * Resize an image using Sharp
 *
 * @param  {Object} params
 * @param  {String} file
 *
 * @return {Promise}
 */
const resizeImage = (params, file) =>
	sharp(join(params.src, file))
		.resize(params.width, params.height)
		.toFile(join(params.dest, file));

/**
 * Optimize images in a folder
 *
 * @param  {String} folder
 *
 * @return {Void}
 */
const optimizeImages = folder => {
	imagemin([`${folder}/*.{jpeg,jpg,gif,png}`], folder, { plugins });
};

/**
 * Resize images
 *
 * @param  {Object} params Settings
 *
 * @return {Promise}
 */
const resize = async params => {
	const { src, dest, width, height } = params;
	const files = (await Promise.all(await readdirSync(src)))
		.filter(isImage)
		.map(file => resizeImage(params, file));

	optimizeImages(dest);

	return Promise.all(files);
};

module.exports = resize;
