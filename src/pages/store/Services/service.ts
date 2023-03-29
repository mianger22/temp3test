import request from '@/utils/request';
import type { UserListParams, ServicesItem } from './data.d';

export async function queryServices(params?: UserListParams) {
  // получаем наименование из поиска
  let searchName = params?.name && params.name;
  // получаем описание из поиска
  let searchDescription = params?.description && params.description;
  // получаем цену из поиска
  let searchPrice = params?.price && params.price;

  let response = await request('/api/v1/store/services/', {
    params,
  });

  // let groups = await request('/api/v1/store/categories/');

  let s;

  if (response.error == false) {
    if (!searchName && !searchDescription && !searchPrice) {
      s = response.result
        .map((sch: ServicesItem) => {
          return sch
        })
      // .sort((a: any, b: any) => { return Date.parse(a.worked_at) - Date.parse(b.worked_at) })
    } else {
      s = response.result
        .map((sch: ServicesItem) => {
          return sch;
        })
    }

    let newArray = [];

    for (let i = 0; i < s.length; i++) {
      if (searchName && s[i].name.toLowerCase().indexOf(searchName.toLowerCase()) >= 0 === true) {
        newArray.push(s[i])
      } else if (searchDescription && s[i].description.toLowerCase().indexOf(searchDescription.toLowerCase()) >= 0 === true) {
        newArray.push(s[i])
      } else if (searchPrice && s[i].price.toString().indexOf(searchPrice.toString()) >= 0 === true) {
        newArray.push(s[i])
      } 
    }

    return {
      data: newArray.length > 0 ? newArray.filter(function(element: any) { return element !== "novariable" }) : s,
      success: true,
      total: response.result.length
    }
  }

  return []
}

export async function removeServices(params: { id: string[] }) {
  // console.log(params)
  for (let index in params.id) {
    return request(`/api/v1/store/services/${params.id[index]}`, {
      method: 'DELETE'
    });
  }
}

export async function addService(params: ServicesItem) {
  return request('/api/v1/store/services/', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function updateServices(params: ServicesItem) {
  return request(`/api/v1/store/services/${params.id}`, {
    method: 'PATCH',
    data: {
      ...params
    },
  });
}
