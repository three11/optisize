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

optisize({ src, width, height });
