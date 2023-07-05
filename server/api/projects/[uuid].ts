import { projects } from '~/server/data/projects'
import { ProjectT } from '~/types'

export default defineEventHandler((event) : { data: ProjectT} => {
	const uuid = event?.context?.params?.uuid
	const project = projects.find((p) => p.uuid === uuid)
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
