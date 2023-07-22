import type { Options } from '@wdio/types'

import { config as sharedConf } from './wdio.conf.js'

export const config: Options.Testrunner = {
    ...sharedConf,
    runner: ['browser', {
        preset: 'vue',
        // start browser window when `DEBUG` environment variable is set
        headless: Boolean(process.env.CI)
    }],
    specs: [
        ['./tests/component/**/*.test.ts']
    ],
    capabilities: [{
        // capabilities for local browser web tests
        browserName: 'chrome' // or "firefox", "microsoftedge", "safari"
    }],
    services: ['chromedriver']
}