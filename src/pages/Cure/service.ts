import request from '@/utils/request';
// import { isArray } from 'lodash';
import type { CureListParams, CureListItem } from './data.d';

export async function queryCure(params?: CureListParams) {
  // if (params?.stamp && isArray(params.stamp)) {
  //   params['fromDate'] = params.stamp[0]
  //   params['toDate'] = params.stamp[1]
  // } 

  // if (params?.sorter && Object.keys(params?.sorter).length === 0) {
  //   params['sorter'] = {"stamp":"ascend"}
  // }

  // получаем имя из поиска
  let searchDoc = params?.doctor && params.doctor;
  // получаем телефон из поиска
  let searchName = params?.user_name && params.user_name;
  // получаем диапазон дат из поиска
  let searchDate = params?.stamp && params.stamp;

  const response = await request('/api/v1/dentistry/cure/?sorter={"stamp": "descend"}&pageSize=20&current=' + params?.current);
  const users = await request('/api/v1/users');

  if (response.error === false) {
    let usersNew: any = [];

    const s = response.result.items.map((sch: CureListItem) => {
      let user = users.result.find((x: any) => x.id == sch.user_id);

      if (user) {
        sch['user'] = user;
        sch['user_name'] = `${user['surname']} ${user['name']}`;
        sch['user_phone'] = user['phone'];

        if (params?.stamp) {
          const filterByDate = (date: Date, stamp: Object) => {
            // получаем даты До, После
            let start = stamp[0], end = stamp[1];

            // приводим к понятному виду
            start = start ? new Date(start) : null;
            end = end ? new Date(end) : null;
            date = new Date(date);

            // возвращаем ответ - входит ли дата юзера в присланный диапазон stamp
            return !((start && start > date) || (end && end < date));
          };
          
          // получаем - подходит ли дата пользователя диапазону из поиска
          const suitableDate = filterByDate(sch['stamp'].$date, params.stamp);

          if (suitableDate === true) {
            sch['suitableDate'] = true;
          } else {
            sch['suitableDate'] = false;
          }
        }

        return sch;
      } else {
        return null;
      }
    }).filter((x: any) => x != null)

    for (let index in response.result.items) {
      let user: CureListItem = response.result.items[index];

      // получаем имя доктора, пациента и диапазон дат
      let doctorName = user.doctor, userName = user.user_name, suitableDate = user.suitableDate;

      // приводим к одному регистру
      userName = userName && userName.toLowerCase()
      searchName = searchName && searchName.toLowerCase()
      doctorName = doctorName && doctorName.toLowerCase()
      searchDoc = searchDoc && searchDoc.toLowerCase()

      if (!searchName && !searchDoc && !searchDate) {
        const tooth_map = await request(`/api/v1/dentistry/map/${user.id}`);

        if (tooth_map.error === false) {
          user.tooths = tooth_map.result.tooths;
        }

        usersNew = s;
      } else if (searchDoc && doctorName && doctorName.indexOf(searchDoc) >= 0 === true) {
        const tooth_map = await request(`/api/v1/dentistry/map/${user.id}`);

        if (tooth_map.error === false) {
          user.tooths = tooth_map.result.tooths;
        }

        usersNew.push(user);
      } else if (searchName && userName && userName.indexOf(searchName) >= 0 === true) {
        const tooth_map = await request(`/api/v1/dentistry/map/${user.id}`);

        if (tooth_map.error === false) {
          user.tooths = tooth_map.result.tooths;
        }

        usersNew.push(user);
      } else if (searchDate && suitableDate && suitableDate === true) {
        const tooth_map = await request(`/api/v1/dentistry/map/${user.id}`);

        if (tooth_map.error === false) {
          user.tooths = tooth_map.result.tooths;
        }

        usersNew.push(user);
      }
    }

    return {
      data: usersNew,
      success: true,
      total: response.result.total
    }
  }

  return []
}

export async function removeRule(params: { id: string[] }) {
  for (var id in params.id) {
    return request(`/api/v1/dentistry/cure/${params.id[id]}`, {
      method: 'DELETE'
    });
  }
}

export async function addRule(params: CureListItem) {
  return request('/api/v1/dentistry/cure/', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function updateRule(params: CureListItem) {
  return request(`/api/v1/dentistry/cure/${params.id}`, {
    method: 'PATCH',
    data: {
      ...params
    },
  });
}
