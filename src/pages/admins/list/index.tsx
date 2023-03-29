import { Button, message, Drawer, Tooltip } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea, ProFormSelect } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import type { UserListItem } from './data.d';
import { queryUsers, removeUser } from './service';
import request from '@/utils/request';
import { AvailableListData } from '@/pages/directory/available/data';
import adminsStyles from "./admins.module.css";
import { updateUser } from '@/pages/admins/list/service';
import OwnConfirmDelete from './components/OwnConfirmDelete';

// названия всплывающих подсказок
const tooltipAdminDel = <span>Лишить пользователя прав администратора</span>;
const tooltipUserDel = <span>Удалить пользователя из системы</span>;

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: UserListItem) => {
  const hide = message.loading('Добавление');
  try {
    // await addRule({ ...fields });
    hide();
    message.success('Добавление прошло успешно');
    return true;
  } catch (error) {
    hide();
    message.error('Добавление прошло неудачно, попробуйте еще раз');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Обновление');
  try {
    // await updateRule({
    //   name: fields.name,
    //   desc: fields.desc,
    //   key: fields.key,
    // });
    hide();

    message.success('Обновление прошло успешно');
    return true;
  } catch (error) {
    hide();
    message.error('Обновление прошло неудачно, попробуй еще раз');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: UserListItem[]) => {
  const hide = message.loading('Удаление');

  if (!selectedRows) return true;

  try {
    await removeUser({
      user_id: selectedRows.map((row) => row.id),
    });

    hide();
    message.success('Удаление прошло успешно, обновляем список');
    return true;
  } catch (error) {
    hide();
    message.error('Удаление прошло неудачно, попробуйте еще раз');
    return false;
  }
};

const UserList: React.FC = (props) => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */

  // для модального окна информации об админе
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  // для модального окна создания админа
  const [visibleModalAdminCreate, showModalAdminCreate] = useState<boolean>(false);
  // для хранения всех пользователей
  const [usersNamesList, setUsersNamesList] = useState<any>([]);
  // для хранения всех id пользователей
  const [usersIdList, setUsersIdList] = useState<any>([]);

  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<UserListItem>();
  const [selectedRowsState, setSelectedRows] = useState<UserListItem[]>([]);
  const [avaliables, setAvailables] = useState<AvailableListData[]>([])
  const [healths, setHealths] = useState([])
  const [nerves, setNerves] = useState([])
  const [linkOperationName, setLinkOperationName] = useState<string>("Удалить администратора")
  const [linkOperationNameDel, setLinkOperationNameDel] = useState<string>("Удалить аккаунт")
  // const [healths, setHealths] = useState<AvailableListData[]>([])
  // const [nerves, setNerves] = useState<AvailableListData[]>([])
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const intl = useIntl();

  useEffect(function fetch() {
    (async function () {
      // setBusy(true)
      // let avAvailable, avHealth, avNerve
      var av = await request('/api/v1/dentistry/tooths/available/')
      if (!av.error) {
        setAvailables(av.result)
      }
      var av = await request('/api/v1/dentistry/tooths/health/')
      if (!av.error) {
        setHealths(av.result)
      }
      var av = await request('/api/v1/dentistry/tooths/nerve/')
      if (!av.error) {
        setNerves(av.result)
      }
      // setBusy(false)

      // ATTENTION!!! Выводится список всех пользователей в модалке Создания админа
      // сохранить всех пользователей
      const listAllUsers = await request('/api/v1/users?filter={"is_admin": false, "is_deleted": false}');
      // const listAllUsers = await request('/api/v1/users?filter={"is_admin": false}');
      const listUsers = listAllUsers.result;

      let resultNamesList = [];
      let resultIdList = [];

      for (let i = 0; i < listUsers.length; i++) {
        let userName = {
          value: `${listUsers[i].name} ${listUsers[i].surname}`
        };

        let userId = {
          id: listUsers[i].id
        };

        resultNamesList.push(userName);
        resultIdList.push(userId);
      }

      setUsersNamesList(resultNamesList);
      setUsersIdList(resultIdList);
    })()
  }, [props])
  
  // если есть фото, то показываем в модальном окне информацию вместе с фото, иначе - без него
  const columns: ProColumns<UserListItem>[] = currentRow?.image_url ? [
    {
      title: (
        <FormattedMessage
          id="pages.user.form.nameLabel"
          defaultMessage="Name"
        />
      ),
      dataIndex: 'name',
      //tip: 'The rule name is the unique key',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
              setLinkOperationName("Закрыть");
              setLinkOperationNameDel("");
            }}
          >
            {entity.surname} {entity.name}
          </a>
        );
      },
    },
    {
      title: (
        <FormattedMessage
          id="pages.user.form.phoneLabel"
          defaultMessage="Phone"
        />
      ),
      dataIndex: 'phone',
    },
    {
      title: (
        <FormattedMessage
          id="pages.user.form.emailLabel"
          defaultMessage="Email"
        />
      ),
      dataIndex: 'email',
    },
    { 
      title: (
        <FormattedMessage
          id="pages.user.form.photoLabel"
          defaultMessage="Photo"
        />
      ),
      hideInTable: true,
      hideInSetting: true,
      hideInSearch: true,
      dataIndex: 'image_url',
      renderText: (text) => {
        return <img src={"data:image/jpeg;base64," + text} width="50%" />
      }
    },
    {
      title: <FormattedMessage id="pages.cure.form.actionLabel" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [<>
        <Tooltip placement="top" title={linkOperationName !== "Закрыть" && tooltipAdminDel}>
          <a
            key="config"
            onClick={() => {
              let selectedItemData = [{
                id: record.id,
                phone: record.phone,
                name: record.name,
                surname: record.surname,
                email: record.email,
                image_url: record.image_url,
                tooths: record.tooths
              }];    

              // если графа назыается 'Удалить администратора', то запускаем удаление, иначе - закрытие
              if (linkOperationName === "Удалить администратора") {
                // handleRemove(selectedItemData);
                adminDelete(selectedItemData)
              } else {
                setLinkOperationName("Удалить администратора");
                setLinkOperationNameDel("Удалить аккаунт");
                setShowDetail(false);
              }

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }}
          >
            {linkOperationName}
          </a>
        </Tooltip>
        <Tooltip placement="top" title={linkOperationNameDel !== "" && tooltipUserDel}>
          <a
            key="config"
            onClick={() => {
              let selectedItemData = [{
                id: record.id,
                phone: record.phone,
                name: record.name,
                surname: record.surname,
                email: record.email,
                image_url: record.image_url,
                tooths: record.tooths
              }];    

              // если графа назыается 'Удалить', то запускаем удаление, иначе - ничего
              if (linkOperationNameDel === "Удалить аккаунт") {
                handleRemove(selectedItemData);
              } else {
                // setLinkOperationNameDel("Удалить аккаунт");
                // setShowDetail(false);
              }

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }}
          >
            {linkOperationNameDel}
          </a>
        </Tooltip>
      </>
      ],
    }
  ] : [
    {
      title: (
        <FormattedMessage
          id="pages.user.form.nameLabel"
          defaultMessage="Name"
        />
      ),
      dataIndex: 'name',
      //tip: 'The rule name is the unique key',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
              setLinkOperationName("Закрыть");
              setLinkOperationNameDel("");
            }}
          >
            {entity.surname} {entity.name}
          </a>
        );
      },
    },
    {
      title: (
        <FormattedMessage
          id="pages.user.form.phoneLabel"
          defaultMessage="Phone"
        />
      ),
      dataIndex: 'phone',
    },
    {
      title: (
        <FormattedMessage
          id="pages.user.form.emailLabel"
          defaultMessage="Email"
        />
      ),
      dataIndex: 'email',
    },
    {
      title: <FormattedMessage id="pages.cure.form.actionLabel" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <>
          {/* столбец c Удалить */}
          <OwnConfirmDelete 
            record={record} 
            actionRef={actionRef} 
            handleRemove={handleRemove} 
            pageName="delAdmin" 
            linkOperationName={linkOperationName}
            adminDelete={adminDelete}
            setShowDetail={setShowDetail}
            setLinkOperationName={setLinkOperationName}
            setLinkOperationNameDel={setLinkOperationNameDel}
          >
            <Tooltip placement="top" title={linkOperationName !== "Закрыть" && tooltipAdminDel}>
              <a key="config">
                {linkOperationName}
              </a>
            </Tooltip>
          </OwnConfirmDelete>
          {/* столбец c Удалить */}
          <OwnConfirmDelete 
            record={record} 
            actionRef={actionRef} 
            handleRemove={handleRemove} 
            pageName="delMan" 
            linkOperationNameDel={linkOperationNameDel}
          >
            <Tooltip placement="top" title={linkOperationNameDel !== "" && tooltipUserDel}>
              <a key="config">
                {linkOperationNameDel}
              </a>
            </Tooltip>
          </OwnConfirmDelete>
        </>
      ],
    }
  ];

  // событие создания админа
  const showFunctionaladminCreate = () => {
    // сделать показ модального окна при клике на Добавить
    showModalAdminCreate(true);
  }

  // функция создания администратора из обычного пользователя
  async function adminCreate(values: any) {
    // создаём место для хранения id пользователя
    let userId: string;

    // теперь перебираем массив на нахождение пользователя и взятия его id
    for (let i = 0; i < usersNamesList.length; i++) {
      if (usersNamesList[i].value === values.userName) {
        userId = usersIdList[i].id;
      } 
    }

    // отправляем запрос на изменении прав пользователя и ждём ответ сервера
    const rootsChange = await updateUser({userId: userId, is_admin: true});

    if (rootsChange.error === false) {
      // если сервер успешно обработал наш запрос
      // закрываем модальное окно
      showModalAdminCreate(false);
  
      // показываем процесс повышения прав
      const hide = message.loading('Пытаемся сделать пользователя администратором...');

      try {
        hide();
        message.success('Пользователь успешно стал администратором');
      } catch (error) {
        hide();
        message.error('Не получилось сделать из пользователя администратора, попробуйте еще раз');
      }

      // обновляем список
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error('Не получилось сделать из пользователя администратора, попробуйте еще раз');
    }
  };

  // функция понижения администратора до обычного пользователя
  async function adminDelete(selectedRows: UserListItem[]) {
    // получаем id пользователя
    let userId = selectedRows.map((row) => row.id);

    // отправляем запрос на изменении прав администратора и ждём ответ сервера
    const rootsChange = await updateUser({userId: userId[0], is_admin: false});

    if (rootsChange.error === false) {
      // если сервер успешно обработал наш запрос
      // показываем процесс понижения прав
      const hide = message.loading('Пытаемся сделать администратора обычным пользователем...');

      try {
        hide();
        message.success('Теперь администратор стал рядовым пользователем');
      } catch (error) {
        hide();
        message.error('Не получилось перевести администратора в пользователи, попробуйте еще раз');
      }

      // обновляем список
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error('Не получилось перевести администратора в пользователи, попробуйте еще раз');
    }
  };

  return (
    <PageContainer>
      <ProTable<UserListItem>
        headerTitle={intl.formatMessage({
          id: 'pages.admins.title',
          defaultMessage: 'User list',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          // <Button
          //   type="primary"
          //   key="primary"
          //   onClick={() => {
          //     handleModalVisible(true);
          //   }}
          // >
          //   <PlusOutlined /> <FormattedMessage id="pages.user.new" defaultMessage="New" />
          // </Button>,
        ]}
        request={(params, sorter, filter) => queryUsers({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />

      <Button type="primary" className={adminsStyles.createBtn} onClick={showFunctionaladminCreate}>
        Добавить администратора
      </Button>

      {/* модальное окно информации об админе */}
      {/* <ModalForm
        title={intl.formatMessage({
          id: 'pages.user.createForm.newRule',
          defaultMessage: 'New rule',
        })}
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value as UserListItem);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.user.ruleName"
                  defaultMessage="Rule name is required"
                />
              ),
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormTextArea width="md" name="desc" />
      </ModalForm> */}
      
      {/* модальное окно создания админа */}
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.admins.createForm.newRule',
          defaultMessage: 'New rule',
        })}
        width="400px"
        visible={visibleModalAdminCreate}
        onVisibleChange={showModalAdminCreate}
        onFinish={adminCreate}
      >
        {/* Поле с выпадающим списком всех пользователей */}
        <ProFormSelect
          name="userName"
          request={() => usersNamesList}
        />
      </ModalForm>

      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setLinkOperationName("Удалить администратора");
          setLinkOperationNameDel("Удалить аккаунт");
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <div>
            <ProDescriptions<UserListItem>
              column={1}
              title={currentRow?.name}
              request={async () => ({
                data: currentRow || {},
              })}
              params={{
                id: currentRow?.name,
              }}
              columns={columns as ProDescriptionsItemProps<UserListItem>[]}
            />
          </div>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default UserList;
