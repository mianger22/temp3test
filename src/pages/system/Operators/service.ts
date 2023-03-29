import request from '@/utils/request';
import type { OperatorsListParams, OperatorsListItem } from './data.d';

export async function queryOperators(params?: OperatorsListParams) {
  // получаем наименование из поиска
  let searchName = params?.name && params.name;
  // получаем описание из поиска
  let searchTelegramId = params?.telegram_id && params.telegram_id;
  // получаем изображение из поиска
  let searchImg = params?.image && params.image;

  let response = await request('/api/v1/chats/operators/', {
    params,
  });

  //  console.log(response.result)
  if (response.error == false) {
    let operators: any = [];

    for (let index in response.result) {
      let operatorItem: OperatorsListItem = response.result[index];
      
      // получаем наименование
      let itemName = operatorItem.name;
      // получаем контакт записи
      let itemTelegramId = operatorItem.telegram_id;
      // получаем изображение записи
      let itemImg = operatorItem.image;
      // получаем id записи
      let itemId = operatorItem.id;
      
      if (!searchName && !searchTelegramId && !searchImg) {
        operators.push({
          id: itemId,
          image: itemImg,
          name: itemName,
          telegram_id: itemTelegramId,
        })
      } else if (searchName && itemName && itemName.indexOf(searchName) >= 0 === true) {
        operators.push({
          id: itemId,
          image: itemImg,
          name: itemName,
          telegram_id: itemTelegramId,
        })
      } else if (searchTelegramId && itemTelegramId && itemTelegramId.toLowerCase().indexOf(searchTelegramId.toLowerCase()) >= 0 === true) {
        operators.push({
          id: itemId,
          image: itemImg,
          name: itemName,
          telegram_id: itemTelegramId,
        })
      } else if (searchImg && itemImg && itemImg.indexOf(searchImg) >= 0 === true) {
        operators.push({
          id: itemId,
          image: itemImg,
          name: itemName,
          telegram_id: itemTelegramId,
        })
      }
    }

    return {
      data: operators,
      success: true,
      total: response.result.length
    }
  }
  return []
}
// export async function deleteUser(params: OperatorsListParams) {
//   return request(`/api/v1/chats/operators/${params.key}`, {
//     method: 'DELETE',
//     data: {
//       ...params
//     },
//   });
// }

export async function deleteUser(params: { id: string[] }) {
  return request(`/api/v1/chats/operators/${params.id}`, {
    method: 'DELETE'
  });
}

export async function updateUser(params: OperatorsListParams) {
  return request(`/api/v1/chats/operators/${params.key}`, {
    method: 'PATCH',
    data: {
      ...params
    },
  });
}
