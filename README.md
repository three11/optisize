# Optisize

Tool for resizing and optimizing images with NodeJS

## About

There are many packages and tools which do that.

Most of them are doing a lot of other things.

This package is focused on two tasks and does them pretty well:

1. Resizes your images and
2. Optimizes their size

## Install

```
npm i @three11/optisize
```

or

```
yarn add @three11/optisize
```

## Arguments

This tool accepts the following arguments:

1. `src`: String - Source folder (Required) \*
2. `width`: Number - Target width (Optional)
3. `height`: Number - Target height (Optional)

* The `src` argument should represent a relative path to your images folder. The folder is relative to your `node_modules` folder. All images located inside other folders in that folder will be recursively optisized as well.

## Usage

### Default:

```
const optisize = require('optisize');
const optisizeSettings = {
	src: 'path/to/images';
	width: 640;
	height: 360;
}

optisize(optisizeSettings);
```

### As package.json script:

Add the following in the `scripts` section of your `package.json` file:

```
"optisize": "optisize"
```

Then invoke the script and supply the required arguments:

```
$ yarn optisize --src="path/to/images" --width=640 --height=360
```

or

```
$ npm run optisize --src="path/to/images" --width=640 --height=360
```

## Important note!

`width` and `height` settings are not required and can be supplied together, alone and also can be missing.

If they are missing, the images will only be optimized.

## License

GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007
