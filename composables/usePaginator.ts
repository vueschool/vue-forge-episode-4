export const usePaginator = ({
  limit = 8,
  page = 1,
}: {
  limit?: number;
  page?: number;
} = {}) => {
  function getRangeStart() {
    return (page - 1) * limit;
  }

  function getRangeEnd() {
    return page * limit - 1;
  }

  function getPaginationObject(total: number) {
    const totalPages = Math.ceil(total / limit);
    const isNextAvailable = totalPages > page;
    const isPrevAvailable = page !== 1;

    return {
      total: total,
      page,
      limit,
      pages: totalPages,
      isNextAvailable,
      isPrevAvailable,
      next: isNextAvailable ? page + 1 : null,
      prev: isPrevAvailable ? page - 1 : null,
    };
  }

  return { getRangeStart, getRangeEnd, getPaginationObject };
};
