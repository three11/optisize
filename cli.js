#!/usr/bin/env node
'use strict';

/**
 * External dependencies
 */
const yargs = require('yargs').argv;

/**
 * Internal dependencies
 */
const optisize = require('./');

/**
 * Command line arguments
 */
const { src, width, height } = yargs;

if (!src) {
	console.error('Please provide source folder');

	return;
}

optisize({ src, width, height });
