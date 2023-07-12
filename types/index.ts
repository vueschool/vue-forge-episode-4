export type UuidT = string

export type User = {
	uuid: UuidT
	firstName: string
	lastName: string
	username: string
	bio: string
	email: string
	avatar: string
}

export type CategoryT = {
	uuid: UuidT
	name: string
	slug: string
}

export type ProjectT = {
	uuid: UuidT
	title: string
	excerpt: string
	description: string
	image: string
	category: CategoryT
	pledged: Number
	backers: Number
	funded: string
	softCap: string
	hardCap: string
	finishesAt: Date
	createdAt: Date
	lastUpdatedAt: Date
}

export type PaginationT = {
	total: number
	page: number
	limit: number
	pages: number
	isNextAvailable: boolean
	isPrevAvailable: boolean
	next: number | null
	prev: number | null
}

export type ApiResponseT = {
	data: any
	pagination: PaginationT
}
