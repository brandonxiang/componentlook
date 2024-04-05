import { parse } from '../../src/index.js';
import path from 'path';

const entry = path.resolve('fixtures/vue/index.vue');

parse([entry]);