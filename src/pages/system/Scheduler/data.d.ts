export type ScheduleListItem = {
  id?: string
  operator_id: string
  operator: string
  operator_name: string
  worked_at: Date
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type ScheduleListData = {
  list: CureListItem[];
  pagination: Partial<TableListPagination>;
};

export type ScheduleListParams = {
  id?: strig,
  status?: string;
  name?: string;
  desc?: string;
  worked_at?: string;
  operator_name?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
