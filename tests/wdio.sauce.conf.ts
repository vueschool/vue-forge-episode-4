import url from 'node:url'
import type { Options } from '@wdio/types'

import { config as e2eConf } from './wdio.e2e.conf.js'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const sauceOptions = { build: `Forge 4 Application ${new Date().toLocaleString()}` }

export const config: Options.Testrunner = {
    ...e2eConf,
    user: process.env.SAUCE_USERNAME,
    key: process.env.SAUCE_ACCESS_KEY,
    specs: ['./tests/e2e/**/*.test.ts'],
    outputDir: __dirname + '/logs',
    bail: 1,
    mochaOpts: {
        bail: true
    },
    capabilities: [{
        browserName: 'chrome',
        platformName: 'Windows 11',
        browserVersion: 'latest',
        'sauce:options': sauceOptions
    }, {
        browserName: 'firefox',
        platformName: 'Windows 11',
        browserVersion: 'latest',
        'sauce:options': sauceOptions
    }, {
        browserName: 'safari',
        platformName: 'macOS 13',
        browserVersion: 'latest',
        'sauce:options': sauceOptions
    }, {
        browserName: 'MicrosoftEdge',
        platformName: 'Windows 11',
        browserVersion: 'latest',
        'sauce:options': sauceOptions
    }],
    services: [
        ['sauce', { sauceConnect: true }],
        'nuxt'
    ]
}