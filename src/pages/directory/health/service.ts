import request from '@/utils/request';
import type { HealthListParams, HealthListItem } from './data.d';

export async function queryHealth(params?: HealthListParams) {
  // получаем наименование из поиска
  let searchName = params?.name && params.name;
  // получаем описание из поиска
  let searchDescription = params?.description && params.description;
  // получаем изображение из поиска
  let searchImg = params?.img && params.img;

  let response = await request('/api/v1/dentistry/tooths/health/', {
    params,
  });
  // console.log(response.result)
  
  if (response.error == false) {
    let teeth: any = [];

    for (let index in response.result) {
      let teethItem: HealthListItem = response.result[index];
      
      // получаем наименование
      let itemName = teethItem.name;
      // получаем описание записи
      let itemDescription = teethItem.description;
      // получаем изображение записи
      let itemImg = teethItem.img;
      // получаем id записи
      let itemId = teethItem.id;
      
      if (!searchName && !searchDescription && !searchImg) {
        teeth.push({
          description: itemDescription,
          id: itemId,
          img: itemImg,
          name: itemName
        })
      } else if (searchName && itemName && itemName.indexOf(searchName) >= 0 === true) {
          teeth.push({
            description: itemDescription,
            id: itemId,
            img: itemImg,
            name: itemName
          })
      } else if (searchDescription && itemDescription && itemDescription.toLowerCase().indexOf(searchDescription.toLowerCase()) >= 0 === true) {
        teeth.push({
          description: itemDescription,
          id: itemId,
          img: itemImg,
          name: itemName
        })
      } else if (searchImg && itemImg && itemImg.indexOf(searchImg) >= 0 === true) {
        teeth.push({
          description: itemDescription,
          id: itemId,
          img: itemImg,
          name: itemName
        })
      }
    }

    // return {
    //   data: response.result,
    //   success: true,
    //   total: response.result.length
    // }

    return {
      data: teeth,
      success: true,
      total: teeth.length
    }
  }
  return []
}

export async function addHealth(params: HealthListItem) {
  return request('/api/v1/dentistry/tooths/health/', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function deleteHealth(params: {key: string[]}) {
  for (var i in params.key)  {
    request(`/api/v1/dentistry/tooths/health/${params.key[i]}`, {
      method: 'DELETE',
      data: {
        ...params
      },
    });
  }
}

export async function updateHealth(params: HealthListItem) {
  return request(`/api/v1/dentistry/tooths/health/${params.id}`, {
    method: 'PATCH',
    data: {
      ...params
    },
  });
}
