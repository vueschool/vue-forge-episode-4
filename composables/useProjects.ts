import { useApiData } from "~/composables/useApiData";
import { PaginationT, ProjectT, UuidT } from "~/types";

export const useProjects = () => {
  const supabase = useTypedSupabaseClient();
  const project = ref<ProjectT | any>({});
  const projects = ref<ProjectT[]>([]);
  const pagination = ref<PaginationT | any>({});

  const fetchAll = async ({ page }: { page: number } = { page: 1 }) => {
    const { getPaginationObject, getRangeEnd, getRangeStart } = usePaginator({
      page,
    });

    let { data, error, count } = await supabase
      .from("projects")
      .select("*, categories(*)", { count: "exact" })
      .range(getRangeStart(), getRangeEnd());

    if (error || !data) {
      throw new Error(error?.message || "Error fetching projects");
    }

    projects.value = data.map((p) => {
      return {
        ...p,
        category: p.categories || undefined,
      };
    });

    if (!count) throw new Error("Count not fetched from Supabase");
    pagination.value = getPaginationObject(count);
  };

  const fetchOne = async ({ uuid }: { uuid: UuidT }) => {
    const { data } = await useFetch(`/api/projects/${uuid}`);
    const response = useApiData(data);
    project.value = response.data;
  };

  const create = async (data: ProjectT) => {
    const { data: responseData } = await useFetch("/api/projects", {
      method: "POST",
      body: { ...data },
    });
    const response = useApiData(responseData);
    projects.value = response.data;

    return response;
  };
  return {
    item: project,
    list: projects,
    pagination,

    create,
    fetchAll,
    fetchOne,
  };
};
