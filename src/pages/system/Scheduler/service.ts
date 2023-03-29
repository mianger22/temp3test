
import request from '@/utils/request';
import type { ScheduleListParams, ScheduleListItem } from './data.d';

export async function querySchedule(params?: ScheduleListParams) {
  // получаем наименование из поиска
  let searchName = params?.worked_at && params.worked_at;
  // получаем контакт из поиска
  let searchTelegram = params?.operator_name && params.operator_name;

  let s;

  let response = await request('/api/v1/chats/schedules/', {
    params,
  });
  
  let users = await request('/api/v1/chats/operators/')

  if (response.error == false) {
    if (!searchName && !searchTelegram) {
      s = response.result
      .map((sch: ScheduleListItem) => {
        let operator = users.result.find((x: any) => x.id == sch.operator_id);
        
        sch['operator'] = operator;
        sch['operator_name'] = operator['name'];
        
        return sch;
      })
    } else {
      s = response.result.map((sch: ScheduleListItem) => {
        let operator = users.result.find((x: any) => x.id == sch.operator_id);
        
        if (searchTelegram && operator['name'].toLowerCase().indexOf(searchTelegram.toLowerCase()) >= 0 === true) {
          sch['operator'] = operator;
          sch['operator_name'] = operator['name'];
        } else if (searchName && sch.worked_at.toString().indexOf(searchName.toString()) >= 0 === true) {
          sch['operator'] = operator;
          sch['operator_name'] = operator['name'];
        } else {
          sch['operator_name'] = "";
        }

        if (sch.operator_name !== "") {
          return sch;
        } 

        return "novariable";
      })
    }
    
    // .sort((a: any, b: any) => { return Date.parse(a.worked_at) - Date.parse(b.worked_at) }) 

    return {
      data: s.filter(function(element: any) { return element !== "novariable" }),
      success: true,
      total: response.result.length
    }
  }
  
  return []
}
export async function addSchedule(params: ScheduleListItem) {
  return request(`/api/v1/chats/schedules/`, {
    method: 'POST',
    data: {
      ...params
    },
  });
}
export async function deleteSchedule(params: ScheduleListParams) {
  // console.log(params)
  for (var item in params.id) {
    var id = params.id[item]
    request(`/api/v1/chats/schedules/${id}`, {
      method: 'DELETE'
    });
  }
}

export async function updateSchedule(params: ScheduleListParams) {
  return request(`/api/v1/chats/schedules/${params.id}`, {
    method: 'PATCH',
    data: {
      ...params
    },
  });
}
