import { $, expect } from '@wdio/globals'
import { render } from '@testing-library/vue'

import DateComponent from '/components/Date.vue'

describe('Date Component', () => {
    it('should display date correctly', async () => {
        render(DateComponent, { props: { date: '2043' } })
        const component = await $('span')
        await expect(component).toBePresent()
        await expect(component).toHaveText('31/12/2042, 16:00:00')
    })
})