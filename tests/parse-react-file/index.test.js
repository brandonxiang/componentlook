


// import ts from 'typescript';
// import { test } from 'uvu';
// import * as assert from 'uvu/assert';
import { parse } from '../../src/index.js';
import path from 'path';

const entry = path.resolve('fixtures/react/index.tsx');

parse([entry]);