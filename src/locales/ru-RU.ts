import component from './ru-RU/component';
import globalHeader from './ru-RU/globalHeader';
import menu from './ru-RU/menu';
import pwa from './ru-RU/pwa';
import settingDrawer from './ru-RU/settingDrawer';
import settings from './ru-RU/settings';
import pages from './ru-RU/pages';

export default {
  'navBar.lang': 'Языки',
  'layout.user.link.help': 'Помощь',
  'layout.user.link.privacy': 'Конфендициальность',
  'layout.user.link.terms': 'Условия',
  'app.preview.down.block': 'Скачать эту страницу',
  'app.welcome.link.fetch-blocks': 'Получить все блоки',
  'app.welcome.link.block-list': 'Быстрое создание стандартных страниц на основе блочной разработки',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...pages,
};
