
export type HealthListItem = {
  id: string | undefined,
  name: string
  description: string
  img: string
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type HealthListData = {
  list: HealthListItem[];
  pagination: Partial<TableListPagination>;
};

export type HealthListParams = {
  status?: string;
  name?: string;
  desc?: string;
  description?: string;
  img?: string;
  key?: string;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
