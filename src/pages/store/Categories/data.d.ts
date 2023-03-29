
export type CategorieItem = {
  id?: string;
  name: string
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type CategoriesListData = {
  list: CategorieItem[];
  pagination: Partial<TableListPagination>;
};

export type UserListParams = {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
