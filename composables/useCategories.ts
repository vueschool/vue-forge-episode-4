import { PaginationT, CategoryT, UuidT, ProjectT } from "~/types";

export const useCategories = () => {
  const supabase = useTypedSupabaseClient();
  const category = ref<
    {
      projects: ProjectT[];
    } & CategoryT
  >();
  const categories = ref<CategoryT[]>([]);
  const pagination = ref<PaginationT>();

  const fetchAll = async ({ page }: { page: number } = { page: 1 }) => {
    const { getPaginationObject, getRangeEnd, getRangeStart } = usePaginator({
      limit: 10,
      page,
    });

    let { data, error, count } = await supabase
      .from("categories")
      .select("*", { count: "exact" })
      .range(getRangeStart(), getRangeEnd());

    if (error || !data) {
      throw new Error(error?.message || "Error fetching projects");
    }

    categories.value = data;

    if (!count) throw new Error("Count not fetched from Supabase");
    pagination.value = getPaginationObject(count);
  };

  const fetchOne = async ({ uuid }: { uuid: UuidT }) => {
    console.log(uuid);
    const { data, error } = await supabase
      .from("categories")
      .select("*, projects(*)")
      .eq("uuid", uuid)
      .single();
    if (error || !data)
      throw new Error(error?.message || "Error fetching category");
    category.value = data;
  };

  return {
    item: category,
    list: categories,
    pagination,

    fetchAll,
    fetchOne,
  };
};
