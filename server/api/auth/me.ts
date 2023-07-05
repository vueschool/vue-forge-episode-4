import { faker } from '@faker-js/faker';
import { User } from '~/types'

const firstName = faker.person.firstName()
const lastName = faker.person.lastName()

const data: User = {
	uuid: faker.string.uuid(),
	firstName,
	lastName,
	username: `${firstName}.${lastName}`.toLowerCase(),
	bio: faker.person.bio(),
	email: faker.internet.email({firstName, lastName}),
	avatar: 'https://i.pravatar.cc/300',
}

export default defineEventHandler((event) => {
	
	
	return { data }
})
