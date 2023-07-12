import { useApiData } from '~/composables/useApiData'
import { PaginationT, ProjectT, UuidT} from '~/types'

export const useProjects = () => {
	const project = ref<ProjectT | any>({})
	const projects = ref<ProjectT[]>([])
	const pagination = ref<PaginationT | any>({})
	
	const fetchAll = async ({ page } : { page: number }) => {
		const { data } = await useFetch('/api/projects', { params: { page, } })
		const response = useApiData(data)
		projects.value = response.data
		pagination.value = response.pagination
	}
	
	const fetchOne = async ({ uuid } : { uuid: UuidT }) => {
		const { data } = await useFetch(`/api/projects/${uuid}`)
		const response = useApiData(data)
		project.value = response.data
	}
	
	
	const create = async (data: ProjectT) => {
		const { data: responseData } = await useFetch('/api/projects', { method: 'POST', body: { ...data } })
		const response = useApiData(responseData)
		projects.value = response.data
		
		return response
	}
	return {
		item: project,
		list: projects,
		pagination,
		
		create,
		fetchAll,
		fetchOne,
	}
}
