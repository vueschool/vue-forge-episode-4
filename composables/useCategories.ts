import { useApiData } from '~/composables/useApiData'
import { PaginationT, CategoryT, UuidT} from '~/types'

export const useCategories = () => {
	const category = ref<CategoryT | any>({})
	const categories = ref<CategoryT[]>([])
	const pagination = ref<PaginationT | any>({})
	
	const fetchAll = async ({ page } : { page: number } = { page: 1 }) => {
		const { data } = await useFetch('/api/categories', { params: { page, } })
		const response = useApiData(data)
		categories.value = response.data
		pagination.value = response.pagination
	}
	
	const fetchOne = async ({ uuid } : { uuid: UuidT }) => {
		const { data } = await useFetch(`/api/categories/${uuid}`)
		const response = useApiData(data)
		category.value = response.data
	}
	
	return {
		item: category,
		list: categories,
		pagination,
		
		fetchAll,
		fetchOne,
	}
}
