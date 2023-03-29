import request from '@/utils/request';
import type { UserListParams, UserListItem } from './data.d';

export async function queryUsers(params?: UserListParams) {
  // получаем имя из поиска
  const searchName = params?.name && params.name;
  // получаем телефон из поиска
  const searchPhone = params?.phone && params.phone;
  // получаем почту из поиска
  const searchEmail = params?.email && params.email;

  const response = await request('/api/v1/users?filter={"is_deleted": false}');

  if (response.error === false) {
    let users: any = [];

    for (let index in response.result) {
      let user: UserListItem = response.result[index];

      // получаем наименование
      const designation = user.surname + " " + user.name;
      // получаем телефон пользователя
      const userPhone = user.phone;
      // получаем почту пользователя
      const userEmail = user.email;

      if (!searchName && !searchPhone && !searchEmail) {
        const tooth_map = await request(`/api/v1/dentistry/map/${user.id}`);

        if (tooth_map.error === false) {
          user.tooths = tooth_map.result.tooths;
        }

        users.push(user);
      } else if (searchName && designation && designation.indexOf(searchName) >= 0 === true) {
        const tooth_map = await request(`/api/v1/dentistry/map/${user.id}`);

        if (tooth_map.error === false) {
          user.tooths = tooth_map.result.tooths;
        }

        users.push(user);
      } else if (searchPhone && userPhone && userPhone.indexOf(searchPhone.slice(1)) >= 0 === true) {
        const tooth_map = await request(`/api/v1/dentistry/map/${user.id}`);

        if (tooth_map.error === false) {
          user.tooths = tooth_map.result.tooths;
        }

        users.push(user);
      } else if (searchEmail && userEmail && userEmail.indexOf(searchEmail) >= 0 === true) {
        const tooth_map = await request(`/api/v1/dentistry/map/${user.id}`);

        if (tooth_map.error === false) {
          user.tooths = tooth_map.result.tooths;
        }

        users.push(user);
      }
    }

    return {
      data: users,
      success: true,
      total: response.result.total
    }
  }

  return []
}

export async function removeUser(params: { id: string[] }) {
  // удаляем пользователя
  const response = await request(`/api/v1/admin/user`, {
    method: 'DELETE',
    data: {
      "user_id": params.id[0]
    }
  });
 
  if (response.error === false) {
    return response;
  } else {
    console.error("Ошибка, связанная с отправкой данных");

    return false;
  }
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
  return request(`/api/v1/dentistry/cure/${params.key}`, {
    method: 'PATCH',
    data: {
      ...params
    },
  });
}
