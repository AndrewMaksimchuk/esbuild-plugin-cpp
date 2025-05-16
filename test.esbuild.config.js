import * as esbuild from 'esbuild'
import {cppPlugin} from "./index.js"

await esbuild.build({
  entryPoints: ['test.input.js'],
  bundle: true,
  outfile: 'test.out.js',
  plugins: [cppPlugin(['DEBUG'])],
})

