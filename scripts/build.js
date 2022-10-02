#!/usr/bin/env node
const { rollup } = require('rollup')
const { nodeResolve: resolvePlugin } = require('@rollup/plugin-node-resolve')
const filesizePlugin = require('rollup-plugin-filesize')
const replacePlugin = require('@rollup/plugin-replace')
const external = require('rollup-plugin-peer-deps-external')
const terserPlugin = require('rollup-plugin-terser').terser

const fs = require('fs-extra')
const path = require('path')
const ts = require('typescript')

// make sure we're in the right folder
process.chdir(process.env.PWD)

const BUILDS_PATH = 'dist'
const TYPE_BUILDS_ES6_PATH = '.dist.es6'
const TYPE_BUILDS_ES5_PATH = '.dist.es5'
const INDEX_PATH = 'index'
const BUILD_NAME = 'index'

fs.removeSync(BUILDS_PATH)
fs.removeSync(TYPE_BUILDS_ES5_PATH)
fs.removeSync(TYPE_BUILDS_ES6_PATH)

function runTypeScriptBuild(outDir, target, declarations) {
  console.log(`Running typescript build (target: ${ts.ScriptTarget[target]}) in ${outDir}/`)

  const tsConfig = path.resolve('tsconfig.json')
  const json = ts.parseConfigFileTextToJson(tsConfig, ts.sys.readFile(tsConfig), true)

  const { options } = ts.parseJsonConfigFileContent(json.config, ts.sys, path.dirname(tsConfig))

  options.target = target
  options.outDir = outDir
  options.declaration = declarations
  options.module = ts.ModuleKind.ES2015
  options.importHelpers = true
  options.noEmitHelpers = true
  options.noEmit = false

  if (target === ts.ScriptTarget.ES5) options.downlevelIteration = true

  if (declarations) options.declarationDir = path.resolve('.', BUILDS_PATH)

  const rootFile = path.resolve('src', INDEX_PATH + '.ts')
  const host = ts.createCompilerHost(options, true)
  const prog = ts.createProgram([rootFile], options, host)
  const result = prog.emit()

  if (result.emitSkipped) {
    const message = result.diagnostics
      .map(
        d =>
          `${ts.DiagnosticCategory[d.category]} ${d.code} (${d.file}:${d.start}): ${d.messageText}`,
      )
      .join('\n')

    throw new Error(`Failed to compile typescript:\n\n${message}`)
  }
}

async function generateBundledModule(inputFile, outputFile, format, production) {
  let plugins

  plugins = production
    ? [
        external({
          includeDependencies: true,
        }),
        resolvePlugin(),
        replacePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
        terserPlugin(),
        filesizePlugin(),
      ]
    : [
        external({
          includeDependencies: true,
        }),
        resolvePlugin(),
        filesizePlugin(),
      ]

  const bundle = await rollup({
    input: inputFile,
    plugins,
  })

  await bundle.write({
    file: outputFile,
    format,
    banner: '/* (c) Nikita Melnikov - MIT Licensed 2020 - now */',
    exports: 'named',
    name: format === 'umd' ? BUILD_NAME : undefined,
  })
}

async function build() {
  runTypeScriptBuild(TYPE_BUILDS_ES5_PATH, ts.ScriptTarget.ES5, true)
  runTypeScriptBuild(TYPE_BUILDS_ES6_PATH, ts.ScriptTarget.ES2015, false)

  const es5Build = path.join(TYPE_BUILDS_ES5_PATH, INDEX_PATH + '.js')
  const es6Build = path.join(TYPE_BUILDS_ES6_PATH, INDEX_PATH + '.js')

  await Promise.all([
    generateBundledModule(es5Build, path.join(BUILDS_PATH, BUILD_NAME + '.js'), 'cjs', false),
    generateBundledModule(es5Build, path.join(BUILDS_PATH, BUILD_NAME + '.min.js'), 'cjs', true),

    generateBundledModule(es5Build, path.join(BUILDS_PATH, BUILD_NAME + '.module.js'), 'es', false),

    generateBundledModule(es6Build, path.join(BUILDS_PATH, BUILD_NAME + '.es6.js'), 'es', false),

    generateBundledModule(es5Build, path.join(BUILDS_PATH, BUILD_NAME + '.umd.js'), 'umd', false),
    generateBundledModule(
      es5Build,
      path.join(BUILDS_PATH, BUILD_NAME + '.umd.min.js'),
      'umd',
      true,
    ),
  ])

  fs.removeSync(TYPE_BUILDS_ES5_PATH)
  fs.removeSync(TYPE_BUILDS_ES6_PATH)
}

build().catch(error => {
  console.error(error)

  if (error.frame) {
    console.error(error.frame)
  }

  process.exit(1)
})
