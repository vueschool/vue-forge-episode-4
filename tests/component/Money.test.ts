import { $, expect } from '@wdio/globals'
import { render } from '@testing-library/vue'

import MoneyComponent from '/components/Money.vue'

interface MoneyProps {
    currency: string
    decimals: number
    amount: number
    short: boolean
}

const testData = new Map<string, MoneyProps>()
    .set('$12346m', {
        currency: 'EUR',
        decimals: 10,
        amount: 1234567.89,
        short: true
    })
    .set('€1,234,567.8900000000', {
        currency: 'EUR',
        decimals: 10,
        amount: 1234567.89,
        short: false
    })

describe('Money Component', () => {
    for (const [expectedValue, props] of testData.entries()) {
        it(`should display money value correctly for ${props.currency}, short: ${props.short}`, async () => {
            render(MoneyComponent, { props })
            const component = await $('span')
            await expect(component).toBePresent()
            await expect(component).toHaveText(expectedValue)
        })
    }
})