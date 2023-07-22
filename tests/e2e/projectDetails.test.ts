import { browser, $, $$, expect } from '@wdio/globals'

describe('Forge 4 Application', () => {
    it('should load dashboard successfully with 8 cards', async () => {
        await browser.url('/')
        await expect($('aria/✨ DecentralSpark')).toBePresent()
        await expect($$('.card')).toBeElementsArrayOfSize(8)
    })

    describe('project details', () => {
        it('should allow open a project', async () => {
            await browser.url('/')
            await $('.card').waitForExist()
            const projectTitle = await $$('.card')[0].$('h2').getText()
            await $$('.card')[0].$('aria/More details!').click()
            await expect($(`h3=${projectTitle}`)).toBePresent()
        })

        it('should allow to pledge a project', async () => {
            await $('aria/Fund this Project').click()
            await $('form input').setValue(100)
            await $('aria/Pledge Now').click()
            await expect($('aria/Thanks for pledging!')).toBePresent()
        })
    })
})