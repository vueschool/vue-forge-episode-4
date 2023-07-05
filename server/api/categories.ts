import { categories} from '~/server/data/categories'


export default defineEventHandler((event) => {
	return { data: categories }
})
