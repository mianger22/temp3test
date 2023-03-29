
export type ServicesItem = {
  id: string;
  description: string;
  name: string;
  price: number;
};

// export type CartshopItem = {
//   id: string;
//   products: any[];
//   user_id: string;
//   user_name?: string;
// };

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
  name?: string;
  description?: string;
  price?: string;
};
