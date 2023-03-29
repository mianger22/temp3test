import { Button, message, Drawer } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import type { UserListItem } from './data.d';
import { queryUsers, removeUser } from './service';
import ToothMap from '@/components/ToothMap/ToothMap';
import request from '@/utils/request';
import { AvailableListData } from '@/pages/directory/available/data';
import ConfirmDelete from '@/components/Common/ConfirmDelete';

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
      id: selectedRows.map((row) => row.id),
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
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
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
    })();
  }, [props])
  
  const columns: ProColumns<UserListItem>[] = [
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
      render: (_, record) => [
      <>
        {/* столбец c Удалить */}
        <ConfirmDelete record={record} actionRef={actionRef} handleRemove={handleRemove} pageName="users">
          <a key="config">
            <FormattedMessage id="pages.cure.batchDeletion" defaultMessage="Configuration" />
          </a>
        </ConfirmDelete>
      </>
      ],
    }
  ];

  return (
    <PageContainer>
      <ProTable<UserListItem>
        headerTitle={intl.formatMessage({
          id: 'pages.users.title',
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
      <ModalForm
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
            <ToothMap
              availables={avaliables}
              healths={healths}
              nerves={nerves}
              selected={[]}
              canEdit={true}
              data={currentRow.tooths} />
          </div>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default UserList;
