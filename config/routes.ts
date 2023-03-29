export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/admin',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/admin/login',
            component: './User/login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            authority: ['admin', 'user'],
            routes: [
              {
                path: '/',
                redirect: '/cure',
              },
              {
                path: '/cure',
                name: 'cure',
                icon: 'smile',
                component: './Cure/',
              },
              {
                path: '/directory',
                name: 'Directory',
                icon: 'read',
                routes: [
                  {
                    path: '/directory/available',
                    name: 'Available',
                    icon: 'smile',
                    component: './directory/available',
                  },
                  {
                    path: '/directory/health',
                    name: 'Health',
                    icon: 'smile',
                    component: './directory/health',
                  },
                  {
                    path: '/directory/nerve',
                    name: 'Nerve',
                    icon: 'smile',
                    component: './directory/nerve',
                  },
                ],
              },
              {
                path: '/store',
                name: 'Store',
                icon: 'shop',
                routes: [
                  {
                    path: '/store/products',
                    name: 'Products',
                    component: './store/Products/'
                  },
                  {
                    path: '/store/categories',
                    name: 'Categories',
                    component: './store/Categories/'
                  }
                  ,
                  {
                    path: '/store/cartshop',
                    name: 'Cartshop',
                    component: './store/Cartshop/'
                  },
                  {
                    path: '/store/service',
                    name: 'Service',
                    component: './store/Services/index.tsx'
                  }
                ]
              },
              {
                path: '/users',
                name: 'Users',
                icon: 'team',
                component: './User/list'
              },
              {
                path: '/system',
                name: 'System',
                icon: 'setting',
                routes: [
                  {
                    path: '/system/opeartors',
                    name: 'Operators',
                    icon: 'team',
                    component: './system/Operators/'
                  },
                  {
                    path: '/system/scheduler',
                    name: 'Scheduler',
                    icon: 'schedule ',
                    component: './system/Scheduler/'
                  }
                ]
              },
              {
                path: '/admins',
                name: 'Администраторы',
                icon: 'team',
                component: './admins/list/',
              },
              // {
              //   name: 'list.table-list',
              //   icon: 'table',
              //   path: '/list',
              //   component: './TableList',
              // },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
