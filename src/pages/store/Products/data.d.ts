
export type ProductItem = {
  id: string;
  name: string
  vendor_code: string
  description: string
  image: string
  group_id: string
  price: number
  hidden: boolean
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type UserListData = {
  list: CureListItem[];
  pagination: Partial<TableListPagination>;
};

export type UserListParams = {
  status?: string;
  name?: string;
  group_name?: string;
  hidden?: boolean;
  price?: string;
  vendor_code?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
