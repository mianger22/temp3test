export type CartshopProductItem = {
  product_id: string
  count: number
  name?: string
  price?: number
  amout?: number
}

export type CartshopItem = {
  id: string;
  products: any[];
  user_id: string;
  user_name?: string;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type CartshopListData = {
  list: CartshopItem[];
  pagination: Partial<TableListPagination>;
};

export type UserListParams = {
  status?: string;
  name?: string;
  id?: string;
  user_name?: string;
  user_phone?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
