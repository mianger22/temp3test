import { Button, message, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import UpdateForm from './components/UpdateForm';
import type { ProductItem } from './data.d';
import { queryProducts, addProduct, removeProduct, updateProduct } from './service';
import { PlusOutlined } from '@ant-design/icons';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import ConfirmDelete from '@/components/Common/ConfirmDelete';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: ProductItem) => {
  const hide = message.loading('Добавление');
  try {
    await addProduct({ ...fields });
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
const handleUpdate = async (fields: ProductItem) => {
  const hide = message.loading('Обновление');
  try {
    await updateProduct({ ...fields });
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
const handleRemove = async (selectedRows: ProductItem[]) => {
  const hide = message.loading('Удаление');
  if (!selectedRows) return true;
  // console.log(selectedRows)
  try {
    await removeProduct({
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

const ProductList: React.FC = () => {
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
  const [currentRow, setCurrentRow] = useState<ProductItem>();
  const [selectedRowsState, setSelectedRows] = useState<ProductItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<ProductItem>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.product.form.nameLabel"
          defaultMessage="Name"
        />
      ),
      dataIndex: 'name',
      //tip: 'The rule name is the unique key',
      render: (dom, entity) => {
        // console.log(entity)
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {entity.name}
          </a>
        );
      },
    },
    {
      title: 'Скрытый',
      dataIndex: 'hidden',
      render:(dom, entity) => {
        return <Checkbox checked={entity.hidden}/>
      },

  disable: true,
  filters: true,
  onFilter: true,
  ellipsis: true,
  valueType: 'select',
  valueEnum: {
    true: {
      text: 'Скрыто',
      status: 'Success',
    },
    false: {
      text: 'Нет',
      status: 'Success',
    },
  },
   

    },
    {
      title: (
        <FormattedMessage
          id="pages.product.form.vendorCodeLabel"
          defaultMessage="Vendor Code2"
        />
      ),
      dataIndex: 'vendor_code',
    },
    {
      title: (
        <FormattedMessage
          id="pages.product.form.groupLabel"
          defaultMessage="Group"
        />
      ),
      dataIndex: 'group_name',
    },
    {
      title: (
        <FormattedMessage
          id="pages.product.form.pricelLabel"
          defaultMessage="Price"
        />
      ),
      dataIndex: 'price',
    },
    {
      title: (
        <FormattedMessage
          id="pages.product.form.photoLabel"
          defaultMessage="Photo"
        />
      ),
      hideInTable: true,
      hideInSetting: true,
      hideInSearch: true,
      dataIndex: 'image',
      renderText: (text) => {
        if (/http/.test(text)) {
          return <img src={text} width="50%" />
        }
        return <img src={"data:image/jpeg;base64," + text} width="50%" />
      }
    },
    {
      title: (
        <FormattedMessage
          id="pages.product.form.photoLabel"
          defaultMessage="Description"
        />
      ),
      hideInTable: true,
      hideInSetting: true,
      hideInSearch: true,
      dataIndex: 'description',
      renderText: (text) => {
        return <div dangerouslySetInnerHTML={{ __html: text }}></div>
      }
    },
    {
      title: <FormattedMessage id="pages.cure.form.actionLabel" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [<>
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
        <ConfirmDelete record={record} actionRef={actionRef} handleRemove={handleRemove} pageName="storeProducts">
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
      <ProTable<ProductItem>
        headerTitle={intl.formatMessage({
          id: 'pages.product.title',
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
            <PlusOutlined /> <FormattedMessage id="pages.product.new" defaultMessage="New" />
          </Button>,
        ]}
        request={(params, sorter, filter) => queryProducts({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      <UpdateForm
        onSubmit={async (value: any) => {
          // console.log(value)
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleModalVisible(false);
        }}
        updateModalVisible={createModalVisible}
        values={{}}
      />
      <UpdateForm
        onSubmit={async (value: any) => {
          value.id = currentRow?.id
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
            <ProDescriptions<ProductItem>
              column={1}
              title={currentRow?.name}
              request={async () => ({
                data: currentRow || {},
              })}
              params={{
                id: currentRow?.name,
              }}
              columns={columns as ProDescriptionsItemProps<ProductItem>[]}
            />
          </div>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ProductList;
