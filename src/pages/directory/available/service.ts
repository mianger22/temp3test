import request from '@/utils/request';
import type { AvailableListParams, AvailableListData } from './data.d';

export async function queryAvailable(params?: AvailableListParams) {
  // получаем наименование из поиска
  let searchName = params?.name && params.name;
  // получаем описание из поиска
  let searchDescription = params?.description && params.description;
  // получаем изображение из поиска
  let searchImg = params?.img && params.img;

  var response = await request('/api/v1/dentistry/tooths/available/', {
    params,
  });
  
  if (response.error == false) {
    let teeth: any = [];

    for (let index in response.result) {
      let teethItem: AvailableListData = response.result[index];
      
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

    return {
      data: teeth,
      success: true,
      total: response.result.length
    }
  }
  return {
    data: [],
    success: false,
    total: 0
  }
}

export async function addAvailable(params: AvailableListData) {
  return request('/api/v1/dentistry/tooths/available/', {
    method: 'POST',
    data: {
      ...params
    },
  });
}


export async function deleteAvailable(params: { id: string[] }) {
  for (var i in params.id) {
    return request(`/api/v1/dentistry/tooths/available/${params.id[i]}`, {
      method: 'DELETE',
      data: {
        ...params
      },
    });
  }
}

export async function updateAvailable(params: AvailableListData) {
  // console.log(params)
  return request(`/api/v1/dentistry/tooths/available/${params.id}`, {
    method: 'PATCH',
    data: {
      ...params
    },
  });
}
