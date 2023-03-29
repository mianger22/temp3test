import { stringify } from 'querystring';
import type { Reducer, Effect } from 'umi';
import { history } from 'umi';

import { loginAccount } from '@/services/login';
import { setAuthority, setToken } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';
import { sha256 } from 'js-sha256';

export type StateType = {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
};

export type LoginModelType = {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
};

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      payload.phone = payload.phone
      .replace(/\D/g, '')
      .replace(/7(\d{1,3})(\d{1,3})?(\d{1,2})?(\d{1,2})?/g, function (txt, f, s, t,v) {
        // console.log(txt)
        if (t) {
          if(v) {
            return `+7(${f})${s}-${t}-${v}`
          }
          return `+7(${f})${s}-${t}`
        } else if (s) {
          return `+7(${f})${s}`
        } else if (f) {
          return `+7(${f})`
        }
      });
      payload.password = sha256(payload.password)
      // console.log(payload)
      const response = yield call(loginAccount, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          result: response,
          type: "account",
          status: "ok"
        },
      });

      // Login successfully
      if (response.error === false) {
        // const urlParams = new URL(window.location.href);
        // const params = getPageQuery();
        message.success('🎉 🎉 🎉  Вход выполнен успешно!');
        // let { redirect } = params as { redirect: string };
        // if (redirect) {
        //   const redirectUrlParams = new URL(redirect);
        //   if (redirectUrlParams.origin === urlParams.origin) {
        //     redirect = redirect.substr(urlParams.origin.length);
        //     if (window.routerBase !== '/') {
        //       redirect = redirect.replace(window.routerBase, '/');
        //     }
        //     if (redirect.match(/^\/.*#/)) {
        //       redirect = redirect.substr(redirect.indexOf('#') + 1);
        //     }
        //   } else {
        //     window.location.href = '/';
        //     return;
        //   }
        // }
        // window.location.href = '/';
        // history.replace('/');
      } 
      
      if (response.ok === false) {
        message.error('У вас нет прав доступа');
      }
    },

    logout() {
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/admin/login' && !redirect) {
        history.replace({
          pathname: '/admin/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      if (payload.result.error === false) {
        setAuthority("admin");
        setToken(payload.result.result.token);

        window.location.href = '/';
        history.replace('/');
      } else {
        setAuthority(null);
        setToken(null);

        // если новый пользователь, перебрасываем на страницу авторизации
        window.location.href = '/admin/login';
        history.replace('/admin/login');
      }

      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;
