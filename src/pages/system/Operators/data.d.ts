
export type OperatorsListItem = {
  id: string
  name: string
  telegram_id: string
  image: string
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type OperatorsListData = {
  list: CureListItem[];
  pagination: Partial<TableListPagination>;
};

export type OperatorsListParams = {
  status?: string;
  name?: string;
  desc?: string;
  telegram_id?: string;
  image?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
