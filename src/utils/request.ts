/** Request 网络请求工具 更详细的 api 文档: https://github.com/umijs/umi-request */
import { extend } from 'umi-request';
import { notification } from 'antd';
import { getToken } from './authority';

const codeMessage: Record<number, string> = {
  200: 'Сервер успешно вернул запрошенные данные.',
  201: 'Новые или измененные данные успешно.',
  202: 'Запрос попал в фоновую очередь (асинхронная задача).',
  204: 'Данные были успешно удалены.',
  400: 'В отправленном запросе была ошибка, и сервер не создавал и не изменял данные.',
  401: 'У пользователя нет полномочий (токен, имя пользователя, пароль неверный).',
  403: 'Пользователь авторизован, но доступ запрещен.',
  404: 'Отправленный запрос относился к несуществующей записи, и сервер не работал.',
  406: 'Запрошенный формат недоступен.',
  410: 'Запрошенный ресурс удален без возможности восстановления и больше не будет доступен',
  422: 'При создании объекта произошла ошибка проверки.',
  500: 'Произошла ошибка на сервере, проверьте сервер.',
  502: 'Ошибка шлюза.',
  503: 'Служба недоступна, сервер временно перегружен или обслуживается.',
  504: 'Истекло время ожидания шлюза.',
};

/**
 * @zh-CN 异常处理程序
 * @en-US Exception handler
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `Request error ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: 'Your network is abnormal and cannot connect to the server',
      message: 'Network anomaly',
    });
  }
  return response;
};

/**
 * @en-US Configure the default parameters for request
 * @zh-CN 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // default error handling
  credentials: 'include', // Does the default request bring cookies
  headers: {
    'Authorization': `Bearer ${getToken()}`
  }
});

export default request;
