import request from '@/utils/request';
import type { UserListParams, CartshopItem, CartshopProductItem } from './data.d';

export async function queryCategories(params?: UserListParams) {
  // получаем наименование из поиска
  let searchIdAsName = params?.id && params.id;
  // получаем имя пациента из поиска
  let searchPacient = params?.user_name && params.user_name;
  // получаем телефон из поиска
  let searchPhone = params?.user_phone && params.user_phone;

  let s;

  let response = await request('/api/v1/cartshop/list', { params })
  let users = await request('/api/v1/users')
  let products = await request('/api/v1/store/products/')
  
  if (response.error == false) {
    if (!searchIdAsName && !searchPacient && !searchPhone) {
      s = response.result
        .filter((x: CartshopItem) => x.products.length > 0)
        .map((sch: CartshopItem) => {
          let user = users.result.find((x: any) => x.id == sch.user_id)
          sch['products'] = sch.products.map(
            (p: CartshopProductItem) => {
              let product = products.result.find((x: any) => x.id == p.product_id)
              p.name = product['name']
              p.price = product['price']
              p.amout = (p.price || 0) * p.count
              return p
            }
          )
          if (user) {
            sch['user'] = user
            sch['user_name'] = `${user['surname']} ${user['name']}`
            sch['user_phone'] = user['phone']
            return sch
          } else {
            return null;
          }

        }).filter((x: any) => x != null)
    } else {
      s = response.result
        .filter((x: CartshopItem) => x.products.length > 0)
        .map((sch: CartshopItem) => {
          let user = users.result.find((x: any) => x.id == sch.user_id)

          sch['products'] = sch.products.map(
            (p: CartshopProductItem) => {
              let product = products.result.find((x: any) => x.id == p.product_id)

              p.name = product['name']
              p.price = product['price']
              p.amout = (p.price || 0) * p.count

              return p
            }
          )

          if (user) {
            let serverPacient = `${user['surname']} ${user['name']}`;

            let lastSymbol;

            if (searchIdAsName) {
              lastSymbol = +searchIdAsName.substr(searchIdAsName.length - 1)
            }

            if (searchIdAsName && lastSymbol === +sch['products'].length) {
              sch['user'] = user
              sch['user_name'] = serverPacient
              sch['user_phone'] = user['phone']
            } else if (searchPacient && serverPacient.toLowerCase().indexOf(searchPacient.toLowerCase()) >= 0 === true) {
              sch['user'] = user
              sch['user_name'] = serverPacient
              sch['user_phone'] = user['phone']
            } else if (searchPhone && user['phone'].toString().indexOf(searchPhone.toString()) >= 0 === true) {
              sch['user'] = user
              sch['user_name'] = serverPacient
              sch['user_phone'] = user['phone']
            } else {
              sch['user_name'] = "";
            }

            if (sch.user_name !== "") {
              return sch;
            } 
    
            return null;
          } else {
            return null;
          }

         }).filter((x: any) => x != null)
    }
    
    console.log("Формируем массив данных")

    return {
      data: s,
      success: true,
      total: response.result.length
    }
  }

  return { data: [], succces: false, total: 0 }
}

export async function removeCategories(params: { id: string[] }) {
  for (let id in params.id) {
    return request(`/api/v1/store/categories/${params.id[id]}`, {
      method: 'DELETE'
    });
  }
}

export async function closeCartshop(params: { id: string }) {
  return request(`/api/v1/cartshop/close/${params.id}`, {
    method: 'DELETE'
  });
}

export async function addCategories(params: CartshopItem) {
  return request('/api/v1/store/categories/', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function updateCategories(params: CartshopItem) {
  return request(`/api/v1/store/categories/${params.id}`, {
    method: 'PATCH',
    data: {
      ...params
    },
  });
}
