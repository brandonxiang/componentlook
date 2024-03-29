import { parse } from '../../src/index.js';
import path from 'path';

const entry = path.resolve('tests/fixtures/vue/index.vue');

parse([entry]);