import { projects } from '~/server/data/projects'
import { ProjectT, PaginationT } from '~/types'

export default defineEventHandler((event) : { data: ProjectT[], pagination: PaginationT} => {
	const query = getQuery(event)
	
	const page: number = parseInt(`${query.page}`) || 1
	const limit: number = parseInt(`${query.limit}`) || 24
	
	const start: number = (page - 1) * limit
	const end: number = page * limit
	
	const totalPages = Math.ceil(projects.length / limit)
	const isNextAvailable = totalPages > page
	const isPrevAvailable = page !== 1
	
	return {
		data: projects.slice(start, end),
		pagination : {
			total: projects.length,
			page, limit,
			pages: totalPages,
			isNextAvailable,
			isPrevAvailable,
			next: isNextAvailable ? page + 1 : null,
			prev: isPrevAvailable ? page - 1 : null,
		}
	}
})
