export type UserToothItem = {
  position: number,
  available_id: string,
  health_ids: Array<string>,
  nerve_id: string
}
export type UserListItem = {
  id: string;
  phone: string
  name: string
  surname: string
  email: string
  image_url?: string
  tooths: List<UserToothItem>
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
  is_admin?: boolean;
  userId?: string;
};
