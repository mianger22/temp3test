import request from '@/utils/request';
import type { UserListParams, UserListItem } from './data.d';

export async function queryUsers(params?: UserListParams) {
  // получаем имя из поиска
  let searchName = params?.name && params.name;
  // получаем телефон из поиска
  let searchPhone = params?.phone && params.phone;
  // получаем почту из поиска
  let searchEmail = params?.email && params.email;

  // let response = await request('/api/v1/users/page?filter={"is_admin": true}', {
  //   params,
  // });

  // ATTENTION!!! Выводится список всех администраторов на главной странице
  let response = await request('/api/v1/users/page?filter={"is_admin": true, "is_deleted": false}');

  if (response.error === false) {
    let users: any = [];

    for (let index in response.result.items) {
      let user: UserListItem = response.result.items[index];

      // получаем наименование
      let designation = user.surname + " " + user.name;
      // получаем телефон пользователя
      let userPhone = user.phone;
      // получаем почту пользователя
      let userEmail = user.email;

      if (!searchName && !searchPhone && !searchEmail) {
        const tooth_map = await request(`/api/v1/dentistry/map/${user.id}`)
  
        if (tooth_map.error === false) {
          user.tooths = tooth_map.result.tooths
        }
  
        users.push(user)
      } else if (searchName && designation && designation.indexOf(searchName) >= 0 === true) {
        const tooth_map = await request(`/api/v1/dentistry/map/${user.id}`)
  
        if (tooth_map.error === false) {
          user.tooths = tooth_map.result.tooths
        }

        users.push(user)
      } else if (searchPhone && userPhone && userPhone.indexOf(searchPhone) >= 0 === true) {
        const tooth_map = await request(`/api/v1/dentistry/map/${user.id}`)
  
        if (tooth_map.error === false) {
          user.tooths = tooth_map.result.tooths
        }

        users.push(user)
      } else if (searchEmail && userEmail && userEmail.indexOf(searchEmail) >= 0 === true) {
        const tooth_map = await request(`/api/v1/dentistry/map/${user.id}`)
    
        if (tooth_map.error === false) {
          user.tooths = tooth_map.result.tooths
        }
    
        users.push(user)
      }
    }
      
    return {
      data: users,
      success: true,
      total: response.result.length
    }
  }

  return []
}

export async function removeUser(params: { user_id: string[] }) {
  // удаляем пользователя 
  return request('/api/v1/admin/user', { method: 'DELETE', data: {'user_id': params.user_id[0]}});
}

export async function addUser(params: UserListItem) {
  return request('/api/v1/dentistry/cure/', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function updateUser(params: UserListParams) {
  // делаем из пользователя админа
  const body = {"user_id": params.userId, "is_admin": params.is_admin};

  const result = await request('/api/v1/admin/user', {method: 'PATCH', data: body });
  
  return result;
}