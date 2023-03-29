import { Button, message, Drawer, Table } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import UpdateForm from './components/UpdateForm';
import type { CartshopItem, CartshopProductItem } from './data.d';
import { queryCategories, addCategories, removeCategories, closeCartshop } from './service';
import { PlusOutlined } from '@ant-design/icons';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: CartshopItem) => {
  const hide = message.loading('Добавление');
  try {
    await addCategories({ ...fields });
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
const handleUpdate = async (fields: CartshopItem) => {
  const hide = message.loading('Обновление');
  try {
    // await updateCategories({
    //   name: fields.name,
    //   id: fields.id,
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
const handleRemove = async (selectedRows: CartshopItem[]) => {
  const hide = message.loading('Удаление');
  if (!selectedRows) return true;
  try {
    var rows = selectedRows.map((row) => row.id!.toString())
    await removeCategories({
      id: rows
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
  const [currentRow, setCurrentRow] = useState<CartshopItem>();
  const [selectedRowsState, setSelectedRows] = useState<CartshopItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<CartshopItem>[] = [
    {
      // title: (
      //   <FormattedMessage
      //     id="pages.user.form.nameLabel"
      //     defaultMessage="Name"
      //   />
      // ),
      dataIndex: 'id',
      //tip: 'The rule name is the unique key',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            <span>Оформлено товаров {entity.products.length}</span>
          </a>
        );
      },
    },
    {
      title: "Пациент",
      dataIndex: "user_name"
    },
    {
      title: "Телефон",
      dataIndex: "user_phone"
    }
  ];

  return (
    <PageContainer>
      <ProTable<CartshopItem>
        headerTitle={intl.formatMessage({
          id: 'pages.store.cartshop.title',
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
        request={(params, sorter, filter) => queryCategories({ ...params, sorter, filter })}
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
          const success = await handleAdd(value as CartshopItem);
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
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          // const success = await handleUpdate({ id: currentRow?.id, name: value.name });
          // if (success) {
          //   handleUpdateModalVisible(false);
          //   setCurrentRow(undefined);
          //   if (actionRef.current) {
          //     actionRef.current.reload();
          //   }
          // }
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
            <ProDescriptions<CartshopItem>
              column={1}
              title={currentRow?.id}
              request={async () => ({
                data: currentRow || {},
              })}
              params={{
                id: currentRow?.id,
              }}
              columns={columns as ProDescriptionsItemProps<CartshopItem>[]}
            />
            <Table
              columns={[
                { title: 'Name', dataIndex: 'name' },
                { title: "Count", dataIndex: "count" },
                { title: "Amount", dataIndex: "amout" },
              ]}
              dataSource={currentRow.products}
              summary={pageData => {
                var total = pageData.reduce((a, x: CartshopProductItem) => {
                  a += x.amout;
                  return a;
                }, 0)
                return (
                  <>
                    <Table.Summary.Row style={{ backgroundColor: 'lightgray' }}>
                      <Table.Summary.Cell index={0}>Итого</Table.Summary.Cell>
                      <Table.Summary.Cell index={0}>{pageData.length}</Table.Summary.Cell>
                      <Table.Summary.Cell index={0}>{total}</Table.Summary.Cell>
                    </Table.Summary.Row>

                  </>
                );
              }}
            />
            <Button onClick={async x => {
              const success = await closeCartshop({ id: currentRow?.id });
              if (success) {
                setCurrentRow(undefined);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}>Товар отпушен</Button>
          </div>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default UserList;
