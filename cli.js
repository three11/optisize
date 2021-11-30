#!/usr/bin/env node
'use strict';

const yargs = require('yargs').argv;

const optisize = require('./');

/**
 * @type {Record<string, any>}
 */
const { src, width, height } = yargs;

optisize({ src, width, height });
