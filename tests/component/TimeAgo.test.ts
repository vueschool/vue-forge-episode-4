import { $, expect } from '@wdio/globals'
import { render } from '@testing-library/vue'

import TimeAgoComponent from '/components/TimeAgo.vue'

describe('TimeAgo Component', () => {
    it('should display component correctly', async () => {
        const date = new Date(Date.now() - (5 * 60 * 1000)) // 5min ago
        render(TimeAgoComponent, { props: { date } })
        const component = await $('div')
        await expect(component).toBePresent()
        await expect(component).toHaveText('5 minutes ago')
    })
})