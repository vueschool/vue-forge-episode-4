import { browser, $, expect } from '@wdio/globals'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

const email = `user-${Math.floor(Math.random() * 1000000)}@example.com`
const password = 'password'

describe('Forge 4 Application', () => {
    /**
     * create a user
     */
    before(async () => {
        await browser.url('/logout')
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { name: 'Yoda' }
        })

        if (error) {
            throw new Error(error.message)
        }
    })

    describe('login', () => {
        it('it should fail with no input', async () => {
            await browser.url('/')
            await $('aria/Login').click()
            await $('form').$('aria/Login').click()
            await expect($('aria/Invalid login credentials')).toBePresent()
        })

        it('should be invalid if username is not an email', async () => {
            const input = await $('input[type="email"]')
            await input.setValue('invalid')
            expect(await browser.execute((elem: HTMLInputElement) => elem.checkValidity(), input)).toBe(false)
            await input.setValue(email)
            expect(await browser.execute((elem: HTMLInputElement) => elem.checkValidity(), input)).toBe(true)
        })

        it('should be fail if credentials are invalid', async () => {
            await $('input[type="email"]').setValue(email)
            await $('input[type="password"]').setValue('invalid')
            await $('form').$('aria/Login').click()
            await expect($('aria/Invalid login credentials')).toBePresent()
            await $('aria/x').waitForClickable()
            await $('aria/x').click()
        })

        it('should fail if email is not confirmed', async () => {
            await $('input[type="email"]').setValue(email)
            await $('input[type="password"]').setValue(password)
            await $('form').$('aria/Login').click()
            await expect($('.avatar')).toBePresent()
        })
    })
})