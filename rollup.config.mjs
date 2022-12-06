import { readFileSync } from 'fs'

import { minify as terser } from 'terser'
import { transform as sucrase } from 'sucrase'
import { transformAsync as babel } from '@babel/core'

import rease from 'rollup-plugin-rease'
// import css from 'rollup-plugin-css-only'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
// import livereload from 'rollup-plugin-livereload'

import { optimize as svgo } from 'svgo'

const production = !process.env.ROLLUP_WATCH

export default {
  input : 'src/index.rease.tsx',
  output: {
    sourcemap: false,
    format   : 'iife',
    name     : 'app',
    file     : 'app/solitaire.html'
  },
  plugins: [
    {
      load(id) {
        if (/\.jpe?g$/.test(id)) {
          const code = readFileSync(id, 'base64')
          return `export default ${JSON.stringify(code)}`
        }
        return null
      },
      transform(code, id) {
        // if (id in temp) return temp[id]
        if (id.endsWith('.svg')) {
          code = svgo(code.trim()).data
          return `export default ${JSON.stringify(encodeURIComponent(code))}`
        }
        // if (/\.jpe?g$/.test(id)) {
        //   code = new Buffer(code).toString('base64')
        //   return `export default ${JSON.stringify(code)}`
        // }
        return null
      }
    },
    rease({ env: 'client', debug: true }),
    {
      name: 'sucrase-custom',
      transform(code, id) {
        if (/\.[mc]?tsx?$/.test(id)) {
          try {
            code = sucrase(code, { transforms: ['typescript'] }).code
          } catch (e) {
            console.error('sucrase-custom')
            console.error(e)
          }
          return { code }
        }
        return null
      }
    },
    resolve({
      browser   : true,
      extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json']
    }),
    commonjs(),

    // !production && livereload(),

    {
      async transform(code) {
        if (production) {
          try {
            code = (await babel(code, {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    corejs     : 3,
                    loose      : true,
                    bugfixes   : true,
                    modules    : false,
                    useBuiltIns: 'entry', // 'entry', 'usage'
                    targets    : '> 1%, not dead, ie 11',
                  }
                ]
              ],
              plugins: ['@babel/plugin-transform-runtime']
            })).code
          } catch (e) {
            console.error('babel-custom')
            console.error(e)
          }
        }
        return { code }
      },
      async renderChunk(code) {
        if (production) {
          try {
            code = (await terser(code, {
              safari10       : true,
              mangle         : true,
              module         : true,
              toplevel       : true,
              compress       : true,
              keep_classnames: false
            })).code
          } catch (e) {
            console.error('terser-custom')
            console.error(e)
          }
        }

        // return '/* eslint-disable */\n' + code
        return `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset='utf-8'>
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="theme-color" content="#333333">

  <title>Solitaire</title>

  <style>
  </style>
</head>

<body style="touch-action:pan-down;">
<script>
/* eslint-disable */
${code}
</script>
</body>

</html>`
      }
    }
  ],
  watch: { clearScreen: false }
}
