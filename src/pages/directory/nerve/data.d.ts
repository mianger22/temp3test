
export type NerveListItem = {
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

export type NerveListData = {
  list: NerveListItem[];
  pagination: Partial<TableListPagination>;
};

export type NerveListParams = {
  status?: string;
  name?: string;
  description?: string;
  img?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
