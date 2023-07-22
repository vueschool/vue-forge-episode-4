import { browser, $, $$, expect } from '@wdio/globals'

const randomUsername = `user-${Math.floor(Math.random() * 1000000)}@example.com`

describe('Forge 4 Application', () => {
    describe('register', () => {
        it('it should fail with no input', async () => {
            await browser.url('/register')
            await $('form').$('aria/Sign Up').click()
            await expect($('aria/Please fill in all fields')).toBePresent()
            await $('aria/x').waitForClickable()
            await $('aria/x').click()
            await browser.pause(1000)
        })

        it('should be invalid if username is not an email', async () => {
            const input = await $('input[type="email"]')
            await input.setValue('invalid')
            expect(await browser.execute((elem: HTMLInputElement) => elem.checkValidity(), input)).toBe(false)
            await input.setValue(randomUsername)
            expect(await browser.execute((elem: HTMLInputElement) => elem.checkValidity(), input)).toBe(true)
            await $('form').$('aria/Sign Up').click()
            await expect($('aria/Please fill in all fields')).toBePresent()
            await $('aria/x').waitForClickable()
            await $('aria/x').click()
        })

        it('should fail if password does not match', async () => {
            const [password, passwordConfirm] = await $$('input[type="password"]')
            await password.setValue('foo')
            await passwordConfirm.setValue('bar')
            await $('form').$('aria/Sign Up').click()
            await expect($('aria/Passwords do not match')).toBePresent()
        })

        it('should fail if password match but less than 6 characters', async () => {
            const [password, passwordConfirm] = await $$('input[type="password"]')
            await password.setValue('foo')
            await passwordConfirm.setValue('foo')
            await $('form').$('aria/Sign Up').click()
            await expect($('aria/Password should be at least 6 characters')).toBePresent()
        })

        it('finish valid registration', async () => {
            const [password, passwordConfirm] = await $$('input[type="password"]')
            await password.setValue('foobar')
            await passwordConfirm.setValue('foobar')
            await $('form').$('aria/Sign Up').click()
            await expect($('aria/You\'ve successfully registered 🎉')).toBePresent()
        })

        it('should not allow to register with same email', async () => {
            await browser.url('/register')
            await $('input[type="email"]').setValue(randomUsername)
            const [password, passwordConfirm] = await $$('input[type="password"]')
            await password.setValue('foobar')
            await passwordConfirm.setValue('foobar')
            await $('form').$('aria/Sign Up').click()
            await expect($('aria/User already registered')).toBePresent()
        })
    })
})