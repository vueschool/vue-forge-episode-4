import { $, expect } from '@wdio/globals'
import { mock, fn, mocked } from '@wdio/browser-runner'
import { config } from '@vue/test-utils'

import { renderAsyncComponent, type VueWrapper } from '../helpers/vue.js'
import ProjectsDetailsComponent from '/components/ProjectsDetails.vue'

import Money from '~/components/Money.vue'
import TimeAgo from '~/components/TimeAgo.vue'
import Date from '~/components/Date.vue'
import ProjectPledgeForm from '~/components/ProjectPledgeForm.vue'

config.global.components.Money = Money
config.global.components.TimeAgo = TimeAgo
config.global.components.Date = Date
config.global.components.ProjectPledgeForm = ProjectPledgeForm

mock('~/composables/useProjects', () => ({
    useProjects: fn().mockReturnValue({
        fetchOne: fn(),
        item: {
            uuid: 'e69cf89a-b6ad-4f9d-8fca-544eac66feb8',
            title: 'DIY Home Improvement',
            excerpt: 'Home improvement tutorials',
            description: 'Creating DIY home improvement tutorials for enthusiasts.',
            image: 'https://loremflickr.com/1000/640/hammer',
            categoryUuid: '3a8ef95f-3c99-4192-8197-7cb289d23933',
            pledged: 8000,
            backers: 70,
            funded: '7000.00',
            softCap: '6000.00',
            hardCap: '10000.00',
            startsAt: '2023-08-18T23:59:59',
            finishesAt: '2023-11-08T23:59:59',
            createdAt: '2023-07-31T14:45:00',
            lastUpdatedAt: '2023-07-31T14:45:00'
        }
    })
}))

describe('ProjectDetails Component', () => {
    let wrapper: VueWrapper
    
    it('should display component correctly', async () => {
        const props = { uuid: 'e69cf89a-b6ad-4f9d-8fca-544eac66feb8' }
        wrapper = renderAsyncComponent(ProjectsDetailsComponent, { props })
        await expect($('aria/DIY Home Improvement')).toBePresent()
        await expect($('span=$8,000.00')).toBePresent()
        await expect($('span=70')).toBePresent()
    })

    afterEach(() => {
        wrapper?.unmount()
    })
})