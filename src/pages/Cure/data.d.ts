import { UserToothItem } from "../User/list/data";

export type CureToothPlanItem = {
  position: number,
  description: string
}

export type CureToothItem = {
  position: number,
  available_id: string,
  health_ids: Array<string>,
  nerve_id: string
}

export type CureListItem = {
  id?: string;
  user_id: string | null,
  stamp: Moment,
  doctor?: string,
  step?: string,
  name?: string,
  diagnose?: string,
  cost?: number,
  cost_with_discount?: number,
  rentgen?: string,
  plan_cure?: List<CureToothPlanItem>,
  result_cure: List<CureToothItem>,
  tooths?: List<UserToothItem>,
  result_text?: string,
  suitableDate?: boolean,
  user_name?: string
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type CureListData = {
  list: CureListItem[];
  pagination: Partial<TableListPagination>;
};

export type CureListParams = {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  current?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
  stamp?: any;
  doctor?: string;
  user_name?: string;
};
