#!/usr/bin/env node

import sade from "sade";
import { parse } from "./src/index.js";

const prog = sade("componentlook", true);

prog
  .version("1.0.0")
  .describe("find component types in your project")
  .example("my-entry")
  .option('--tsconfig', 'Specify a tsconfig file')
  .action((opts) => {
    const {_, ...rest} = opts
    parse(_, rest).catch((error) => {
      console.error(error.message || error);
      process.exitCode = 1;
    });
  })
  .parse(process.argv);
