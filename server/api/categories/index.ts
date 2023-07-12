import { categories } from '~/server/data/categories'
import { CategoryT, PaginationT } from '~/types'

export default defineEventHandler((event) : { data: CategoryT[], pagination: PaginationT} => {
	const query = getQuery(event)
	
	const page: number = parseInt(`${query.page}`) || 1
	const limit: number = parseInt(`${query.limit}`) || 24
	
	const start: number = (page - 1) * limit
	const end: number = page * limit
	
	const totalPages = Math.ceil(categories.length / limit)
	const isNextAvailable = totalPages > page
	const isPrevAvailable = page !== 1
	
	return {
		data: categories.slice(start, end),
		pagination : {
			total: categories.length,
			page, limit,
			pages: totalPages,
			isNextAvailable,
			isPrevAvailable,
			next: isNextAvailable ? page + 1 : null,
			prev: isPrevAvailable ? page - 1 : null,
		}
	}
})
