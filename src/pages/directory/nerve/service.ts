import request from '@/utils/request';
import type { NerveListData, NerveListItem, NerveListParams } from './data.d';

export async function queryNerve(params?: NerveListParams) {
  // получаем наименование из поиска
  let searchName = params?.name && params.name;
  // получаем описание из поиска
  let searchDescription = params?.description && params.description;
  // получаем изображение из поиска
  let searchImg = params?.img && params.img;

  let response = await request('/api/v1/dentistry/tooths/nerve/', {
    params,
  });

  //console.log(response.result)

  if (response.error == false) {
    let nerves: any = [];

    for (let index in response.result) {
      let nervesItem: NerveListItem = response.result[index];
      
      // получаем наименование
      let itemName = nervesItem.name;
      // получаем описание записи
      let itemDescription = nervesItem.description;
      // получаем изображение записи
      let itemImg = nervesItem.img;
      // получаем id записи
      let itemId = nervesItem.id;
      
      if (!searchName && !searchDescription && !searchImg) {
        nerves.push({
          description: itemDescription,
          id: itemId,
          img: itemImg,
          name: itemName
        })
      } else if (searchName && itemName && itemName.indexOf(searchName) >= 0 === true) {
        nerves.push({
          description: itemDescription,
          id: itemId,
          img: itemImg,
          name: itemName
        })
      } else if (searchDescription && itemDescription && itemDescription.toLowerCase().indexOf(searchDescription.toLowerCase()) >= 0 === true) {
        nerves.push({
          description: itemDescription,
          id: itemId,
          img: itemImg,
          name: itemName
        })
      } else if (searchImg && itemImg && itemImg.indexOf(searchImg) >= 0 === true) {
        nerves.push({
          description: itemDescription,
          id: itemId,
          img: itemImg,
          name: itemName
        })
      }
    }

    return {
      data: nerves,
      success: true,
      total: response.result.length
    }
  }
  return []
}

export async function addNerve(params: NerveListItem) {
  return request('/api/v1/dentistry/tooths/nerve/', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function deleteNerve(params: { id: string[] }) {
  for (var index in params.id)
    return request(`/api/v1/dentistry/tooths/nerve/${params.id[index]}`, {
      method: 'DELETE',
    });
}

export async function updateNerve(params: NerveListItem) {
  // console.log(params)
  return request(`/api/v1/dentistry/tooths/nerve/${params.id}`, {
    method: 'PATCH',
    data: {
      ...params
    },
  });
}
