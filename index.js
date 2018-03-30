/**
 * Internal dependencies
 */
const fs = require('fs');
const path = require('path');

/**
 * External dependencies
 */
const sharp = require('sharp');

/**
 * Imagemin and its plugins
 */
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminPNGquant = require('imagemin-pngquant');

const imageMinPlugins = [
	imageminGifsicle({
		interlaced: true
	}),

	imageminMozjpeg({
		quality: 70
	}),

	imageminPNGquant({
		speed: 1,
		quality: 90
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
 * Resize images
 *
 * @param  {Object} params Settings
 *
 * @return {Void}
 */
const resize = params => {
	const { src, dest, width, height } = params;
	const resized = [];

	fs.readdir(src, (err, files) => {
		files.filter(file => isImage).forEach(file => {
			const srcPath = path.join(src, file);
			const destPath = path.join(dest, file);

			resized.push(
				sharp(srcPath)
					.resize(width, height)
					.toFile(destPath)
			);
		});

		Promise.all(resized).then(() => {
			imagemin([`${dest}/*.{jpeg,jpg,gif,png}`], dest, {
				plugins: imageMinPlugins
			});
		});
	});
};

module.exports = resize;
