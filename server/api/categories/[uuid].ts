import { categories } from '~/server/data/categories'
import { CategoryT } from '~/types'

export default defineEventHandler((event) : { data: CategoryT } => {
	const uuid = event?.context?.params?.uuid
	const project = categories.find((p) => p.uuid === uuid)
	if (!uuid  || !project) {
		throw createError({
			statusCode: 404,
			statusMessage: `Project with ID ${uuid} not found`
		})
	}
	
	return {
		data: project
	}
})
