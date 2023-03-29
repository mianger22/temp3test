import { Button, message, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import type { ScheduleListItem } from './data.d';
import { querySchedule, addSchedule, deleteSchedule } from './service';
import { PlusOutlined } from '@ant-design/icons';
import NewScheduleForm from './components/NewForm';

/** s
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (value: ScheduleListItem) => {
  const hide = message.loading('Добавление');
  try {
    await addSchedule({ ...value });
    hide();
    message.success('Добавление прошло успешно');
    // console.log("return")
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
const handleRemove = async (selectedRows: ScheduleListItem[]) => {
  const hide = message.loading('Удаление');
  if (!selectedRows) return true;
  // console.log(selectedRows)
  try {
    await deleteSchedule({
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

const UserList: React.FC = () => {
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
  const [currentRow, setCurrentRow] = useState<ScheduleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<ScheduleListItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<ScheduleListItem>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.user.form.nameLabel"
          defaultMessage="Stamp"
        />
      ),
      dataIndex: 'worked_at',
      //tip: 'The rule name is the unique key',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: (
        <FormattedMessage
          id="pages.user.form.telegramLabel"
          defaultMessage="Operator"
        />
      ),
      dataIndex: 'operator_name',
    }
  ];

  return (
    <PageContainer>
      <ProTable<ScheduleListItem>
        headerTitle={intl.formatMessage({
          id: 'pages.system.scheduler.title',
          defaultMessage: 'User list',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.user.new" defaultMessage="New" />
          </Button>,
        ]}
        request={(params, sorter, filter) => querySchedule({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      <NewScheduleForm
        title={intl.formatMessage({
          id: 'pages.user.createForm.newRule',
          defaultMessage: 'New rule',
        })}
        visible={createModalVisible}
        onChangeVisible={(value) => {
          handleModalVisible(value)
        }}
        addHandler={handleAdd}
        reload={() => {
          actionRef.current?.reload()
          handleModalVisible(false)
        }}
      />
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
        {currentRow?.id && (
          <div>
            <ProDescriptions<ScheduleListItem>
              column={1}
              title={currentRow?.id}
              request={async () => ({
                data: currentRow || {},
              })}
              params={{
                id: currentRow?.id,
              }}
              columns={columns as ProDescriptionsItemProps<ScheduleListItem>[]}
            />

            <Button
              type="primary"
              key="primary"
              onClick={() => {
                handleModalVisible(true);
              }}
            >
              <PlusOutlined /> <FormattedMessage id="pages.user.new" defaultMessage="New" />
            </Button>

          </div>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default UserList;
