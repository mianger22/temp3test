import request from '@/utils/request';
import type { UserListParams, CategorieItem } from './data.d';

export async function queryCategories(params?: UserListParams) {
  // получаем наименование из поиска
  let searchName = params?.name && params.name;

  let response = await request('/api/v1/store/categories/', {
    params,
  })

  if (response.error == false) {
    let categories: any = [];

    for (let index in response.result) {
      let categoriesItem: CategorieItem = response.result[index];
      
      // получаем наименование записи
      let itemName = categoriesItem.name;
      // получаем id записи
      let itemId = categoriesItem.id;
      
      if (!searchName) {
        categories.push({
          id: itemId,
          name: itemName
        })
      } else if (searchName && itemName && itemName.toLowerCase().indexOf(searchName.toLowerCase()) >= 0 === true) {
        categories.push({
          id: itemId,
          name: itemName
        })
      } 
    }

    return {
      data: categories,
      success: true,
      total: response.result.length
    }
  }

  return []
}

export async function removeCategories(params: { id: string[] }) {
  for (var id in params.id) {
    return request(`/api/v1/store/categories/${params.id[id]}`, {
      method: 'DELETE'
    });
  }
}

export async function addCategories(params: CategorieItem) {
  return request('/api/v1/store/categories/', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function updateCategories(params: CategorieItem) {
  return request(`/api/v1/store/categories/${params.id}`, {
    method: 'PATCH',
    data: {
      ...params
    },
  });
}
