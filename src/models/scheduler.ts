import type { Effect, Reducer } from 'umi';
import { query, add, remove, update } from '@/services/scheduler'

export type SchuduleItem = {
    id?: string,
    operator_id: string,
    worked_at: Date
}

export type ScheduleModelState = {
    data?: SchuduleItem[];
};
export type SchedulerModelType = {
    namespace: string;
    state: ScheduleModelState;
    effects: {
        fetch: Effect;
        // fetchCurrent: Effect;
    };
    reducers: {
        // saveCurrentUser: Reducer<ScheduleModelState>;
        // changeNotifyCount: Reducer<ScheduleModelState>;
    };
};

const SchedulerModel: SchedulerModelType = {
    namespace: 'scheduler',
    state: {
        data: []
    },
    effects: {
        *fetch(_, { call, put }) {
            const response = yield call(query);
            yield put({
                type: 'save',
                payload: response,
            });
        },
    },
    reducers: {}
}