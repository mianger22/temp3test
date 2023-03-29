import request from '@/utils/request';
import type { UserListParams, ProductItem } from './data.d';

export async function queryProducts(params?: UserListParams) {
  // получаем наименование из поиска
  let searchName = params?.name && params.name;
  // получаем имя группы из поиска
  let searchGroupName = params?.group_name && params.group_name;
  // получаем скрытый из поиска
  let searchHidden = params?.hidden && params.hidden;
  // получаем цену из поиска
  let searchPrice = params?.price && params.price;
  // получаем номер заказа из поиска
  let searchVendorCode = params?.vendor_code && params.vendor_code;

  let response = await request('/api/v1/store/products/', {
    params,
  });

  let groups = await request('/api/v1/store/categories/');

  let s;

  if (response.error == false) {
    if (!searchName && !searchGroupName && !searchPrice && !searchVendorCode && !searchHidden) {
      s = response.result
        .map((sch: ProductItem) => {
          let group = groups.result.find((x: any) => x.id == sch.group_id)

          sch['group'] = group
          sch['group_name'] = group['name']
          return sch
        })
      // .sort((a: any, b: any) => { return Date.parse(a.worked_at) - Date.parse(b.worked_at) })
    } else {
      let result = response.result;

      s = result
        .map((sch: ProductItem) => {
          let group = groups.result.find((x: any) => x.id == sch.group_id)
         
          sch['group'] = group
          sch['group_name'] = group['name']

          return sch;
        })
    }

    let newArray = [];

    for (let i = 0; i < s.length; i++) {
      if (searchName && s[i].name.toLowerCase().indexOf(searchName.toLowerCase()) >= 0 === true) {
        newArray.push(s[i])
      } else if (searchGroupName && s[i].group.name.toLowerCase().indexOf(searchGroupName.toLowerCase()) >= 0 === true) {
        newArray.push(s[i])
      } else if (searchPrice && s[i].price.toString().indexOf(searchPrice.toString()) >= 0 === true) {
        newArray.push(s[i])
      } else if (searchVendorCode && s[i].vendor_code.toLowerCase().indexOf(searchVendorCode.toLowerCase()) >= 0 === true) {
        newArray.push(s[i])
      } else if (searchHidden && s[i].hidden.toString() === searchHidden.toString()) { 
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

export async function removeProduct(params: { id: string[] }) {
  // console.log(params)
  for (let index in params.id) {
    return request(`/api/v1/store/products/${params.id[index]}`, {
      method: 'DELETE'
    });
  }
}

export async function addProduct(params: ProductItem) {
  return request('/api/v1/store/products/', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function updateProduct(params: ProductItem) {

  return request(`/api/v1/store/products/${params.id}`, {
    method: 'PATCH',
    data: {
      ...params
    },
  });
}
