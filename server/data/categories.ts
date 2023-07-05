import { faker } from '@faker-js/faker'
import { Category } from '~/types'

export const categories : Category[] = [
	{ uuid: faker.string.uuid(), name: 'Art', slug: 'art' },
	{ uuid: faker.string.uuid(), name: 'Comics & illustration', slug: 'comics-and-illustration'},
	{ uuid: faker.string.uuid(), name: 'Design & Tech', slug: 'design-and-tech'},
	{ uuid: faker.string.uuid(), name: 'Film', slug: 'film'},
	{ uuid: faker.string.uuid(), name: 'Food & Craft', slug: 'food-and-craft'},
	{ uuid: faker.string.uuid(), name: 'Games', slug: 'games'},
	{ uuid: faker.string.uuid(), name: 'Music', slug: 'music'},
	{ uuid: faker.string.uuid(), name: 'Publishing', slug: 'publishing'},
]
