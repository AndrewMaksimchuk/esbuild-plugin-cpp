import { promisify } from 'node:util';
import child_process from 'node:child_process';

const execFile = promisify(child_process.execFile);

export function cppPlugin (predefineNames = []) {
  const predefineNamesOptions = predefineNames.map((name) => `-D ${name} `);
  return {
    name: 'cppPlugin',
    setup(build) {
      build.onLoad({filter: /.*/}, async (args) => {
        const options = predefineNamesOptions.length ? ['-P', predefineNamesOptions, args.path] : ['-P', args.path];
        const {stdout} = await execFile('cpp', options);
        return {
          contents: stdout,
          loader: 'js'
        };
      })
    },
  };
}

