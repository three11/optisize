[![GitHub stars](https://img.shields.io/github/stars/three11/optisize.svg?style=social&label=Stars)](https://github.com/three11/optisize)
[![GitHub forks](https://img.shields.io/github/forks/three11/optisize.svg?style=social&label=Fork)](https://github.com/three11/optisize/network#fork-destination-box)
[![GitHub release](https://img.shields.io/github/release/three11/optisize.svg)](https://github.com/three11/optisize/releases/latest)
[![GitHub issues](https://img.shields.io/github/issues/three11/optisize.svg)](https://github.com/three11/optisize/issues)
[![GitHub last commit](https://img.shields.io/github/last-commit/three11/optisize.svg)](https://github.com/three11/optisize/commits/master)
[![Github file size](https://img.shields.io/github/size/three11/optisize/index.js.svg)](https://github.com/three11/optisize/)
[![Build Status](https://travis-ci.org/three11/optisize.svg?branch=master)](https://travis-ci.org/three11/optisize)
[![npm](https://img.shields.io/npm/dt/@three11/optisize.svg)](https://www.npmjs.com/package/@three11/optisize)
[![npm](https://img.shields.io/npm/v/@three11/optisize.svg)](https://www.npmjs.com/package/@three11/optisize)
[![license](https://img.shields.io/github/license/three11/optisize.svg)](https://github.com/three11/optisize)
[![Analytics](https://ga-beacon.appspot.com/UA-83446952-1/github.com/three11/optisize/README.md)](https://github.com/three11/optisize/)
[![Open Source Love svg1](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/three11/optisize/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/three11/optisize/graphs/commit-activity)

[![ForTheBadge built-with-love](https://ForTheBadge.com/images/badges/built-with-love.svg)](https://github.com/three11/) [![Greenkeeper badge](https://badges.greenkeeper.io/three11/optisize.svg)](https://greenkeeper.io/)

# Optisize

Tool for resizing and optimizing images with NodeJS

## About

There are many packages and tools which do that.

Most of them are doing a lot of other things.

This package is focused on two tasks and does them pretty well:

1. Resizes your images and
2. Optimizes their size

## Install

```console
npm i @three11/optisize
```

or

```console
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

```javascript
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

```json
"optisize": "optisize"
```

Then invoke the script and supply the required arguments:

```console
yarn optisize --src="path/to/images" --width=640 --height=360
```

or

```console
npm run optisize --src="path/to/images" --width=640 --height=360
```

## Important note!

`width` and `height` settings are not required and can be supplied together, alone and also can be missing.

If they are missing, the images will only be optimized.

## License

GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007
