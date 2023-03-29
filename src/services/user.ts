import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/api/v1/users');
}

export async function queryCurrent(): Promise<any> {
  // return request('/api/v1/user');

  // получаем информацию из токена
  function parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  };

  if (localStorage.getItem('user-token')) {
    // берём токен пользователя
    const token = localStorage.getItem('user-token');
    // получаем данные из токена
    const tokenData = token && parseJwt(token);
    // забираем user id
    const userId = tokenData && tokenData.user_id;

    return request(`/api/v1/admin/user/${userId}`);
  } else {
    // когда пользователь заходит в первый раз, у него ещё нет в хранилище токена, и вот в таких случаях появляется коварная ошибка, которая рушит всё приложение; поэтому я и добавил возврат конкретного значения, чтобы приложение функционировало
    return false;
  }
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
