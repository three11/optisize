#!/usr/bin/env node
'use strict';

/**
 * External dependencies
 */
const yargs = require('yargs').argv;

/**
 * Internal dependencies
 */
const resize = require('./');

/**
 * Command line arguments
 */
const { src, dest, width, height } = yargs;

if (!src || !dest) {
	console.error('Please provide source and/or destination folders');

	return;
}

resize({ src, dest, width, height });
