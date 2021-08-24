#!/usr/bin/env node
// @ts-nocheck

'use strict';

import { argv } from 'yargs';
import optisize from './index.mjs';

const { src, width, height } = argv;

optisize({ src, width, height });
