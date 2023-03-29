
export type AvailableListData = {
  id: string
  name: string
  description: string
  img: string
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type AvailableListData = {
  list: CureListItem[];
  pagination: Partial<TableListPagination>;
};

export type AvailableListParams = {
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
