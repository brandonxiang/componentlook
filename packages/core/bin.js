#!/usr/bin/env node

import { readFileSync } from "node:fs";
import sade from "sade";
import { parse } from "./src/index.js";

const packageJson = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8")
);
const prog = sade("componentlook", true);

prog
  .version(packageJson.version)
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
