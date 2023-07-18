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
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("uuid", uuid)
      .single();
    if (error || !data) {
      throw new Error(error?.message || "Error fetching project");
    }
    project.value = data;
  };

  const create = async (project: Partial<ProjectT>): Promise<ProjectT> => {
    const { data: newProject, error } = await supabase
      .from("projects")
      .insert(project as ProjectT)
      .select("*")
      .single();

    console.log(newProject, error);
    if (error || !newProject)
      throw new Error(error?.message || "Error creating project");

    return newProject;
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
