import type { Options } from '@wdio/types'

import { config as sharedConf } from './wdio.conf.js'

export const config: Options.Testrunner = {
    ...sharedConf,
    specs: ['./tests/e2e/**/*.test.ts'],
    capabilities: [{
        // capabilities for local browser web tests
        browserName: 'chrome' // or "firefox", "microsoftedge", "safari"
    }],
    services: ['chromedriver', 'nuxt']
}