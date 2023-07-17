import { useApiData } from "~/composables/useApiData";
import { PaginationT, CategoryT, UuidT } from "~/types";

export const useCategories = () => {
  const supabase = useTypedSupabaseClient();
  const category = ref<CategoryT | any>({});
  const categories = ref<CategoryT[]>([]);
  const pagination = ref<PaginationT | any>({});

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
    const { data } = await useFetch(`/api/categories/${uuid}`);
    const response = useApiData(data);
    category.value = response.data;
  };

  return {
    item: category,
    list: categories,
    pagination,

    fetchAll,
    fetchOne,
  };
};
