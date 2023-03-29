import { Button, message, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import UpdateForm from './components/UpdateForm';
import type { HealthListItem } from './data.d';
import { addHealth, deleteHealth, queryHealth, updateHealth } from './service';
import { PlusOutlined } from '@ant-design/icons';
import UploadDragger from '@/components/ImageUploader/index';
import ConfirmDelete from '@/components/Common/ConfirmDelete';
import NewFormСommon from '@/components/Common/NewFormCommon';

/** s
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: HealthListItem) => {
  const hide = message.loading('Добавление');
  try {
    await addHealth({ ...fields });
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
const handleUpdate = async (fields: HealthListItem) => {
  const hide = message.loading('Обновление');
  try {
    await updateHealth({...fields});
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
const handleRemove = async (selectedRows: HealthListItem[]) => {
  const hide = message.loading('Удаление');
  if (!selectedRows) return true;
  try {
    await deleteHealth({
      key: selectedRows.map((row) => row.id),
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

const HealthList: React.FC = () => {
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
  const [currentRow, setCurrentRow] = useState<HealthListItem>();
  const [selectedRowsState, setSelectedRows] = useState<HealthListItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<HealthListItem>[] = [
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
          <span>{dom}</span>
        );
      },
    },
    {
      title: "Изображение",
      dataIndex: "img",
      render: (dom, entity) => {
        if (/^http/.test(entity.img)) {
          return <img src={entity.img} />
        }
        if (/^<svg/.test(entity.img)) {
          return <span dangerouslySetInnerHTML={{ __html: entity.img }} />
        }
        return <span></span>
      }
    },
    {
      title: "Описание",
      dataIndex: "description"
    },
    {
      title: <FormattedMessage id="pages.cure.form.actionLabel" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <>
          <a
            key="config"
            onClick={() => {
              handleUpdateModalVisible(true);
              setCurrentRow(record);
            }}
          >
            <FormattedMessage id="pages.cure.form.edit" defaultMessage="Configuration" />
          </a>
          {/* столбец c Удалить */}
          <ConfirmDelete record={record} actionRef={actionRef} handleRemove={handleRemove} pageName="directory">
            <a key="config">
              <FormattedMessage id="pages.cure.batchDeletion" defaultMessage="Configuration" />
            </a>
          </ConfirmDelete>
      </>
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<HealthListItem>
        headerTitle={intl.formatMessage({
          id: 'pages.directory.health.title',
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
        request={(params, sorter, filter) => queryHealth({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />

      <NewFormСommon 
        handleModalVisible={handleModalVisible} 
        createModalVisible={createModalVisible}
        actionRef={actionRef}
        handleAdd={handleAdd}
      />

      <UpdateForm
        onSubmit={async (value) => {
          value.id = currentRow!.id
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
            <ProDescriptions<HealthListItem>
              column={1}
              title={currentRow?.name}
              request={async () => ({
                data: currentRow || {},
              })}
              params={{
                id: currentRow?.name,
              }}
              columns={columns as ProDescriptionsItemProps<HealthListItem>[]}
            />
          </div>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default HealthList;
