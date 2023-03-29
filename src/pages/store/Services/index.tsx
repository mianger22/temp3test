import { Button, message } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import UpdateForm from './components/UpdateForm';
import type { ServicesItem } from './data.d';
import { queryServices, addService, updateServices, removeServices } from './service';
import { PlusOutlined } from '@ant-design/icons';
import ConfirmDelete from '@/components/Common/ConfirmDelete';

const ServicesList: React.FC = () => {
  const intl = useIntl();
  // ХРАНИЛИЩЕ ДАННЫХ

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
  const [currentRow, setCurrentRow] = useState<ServicesItem>();
  const [selectedRowsState, setSelectedRows] = useState<ServicesItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const [titleList, setTitleList] = useState<any>([]);
  
  useEffect(() => {
    // формируем заголовки
    const titleCreateForm = intl.formatMessage({
      id: 'pages.services.new',
      defaultMessage: 'Добавление услуги'
    });

    const titleUpdateForm = intl.formatMessage({
      id: 'pages.services.updateForm.title',
      defaultMessage: 'Изменение услуги'
    });

    if (titleList.length === 0) {
      // сохраняем их
      setTitleList({
        createTitle: titleCreateForm,
        updateTitle: titleUpdateForm
      })
    } 
  }, [titleList])

  /**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: ServicesItem) => {
  const hide = message.loading('Добавление');
  try {
    await addService({ ...fields });
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
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
  const handleRemove = async (selectedRows: ServicesItem[]) => {
    const hide = message.loading('Удаление');
    if (!selectedRows) return true;
    // console.log(selectedRows)
    try {
      await removeServices({
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

  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields: ServicesItem) => {
    const hide = message.loading('Обновление');
    try {
      await updateServices({ ...fields });
      hide();

      message.success('Обновление прошло успешно');
      return true;
    } catch (error) {
      hide();
      message.error('Обновление прошло неудачно, попробуй еще раз');
      return false;
    }
  };

  // СОЗДАЁМ СТОЛБЦЫ
  const columns: ProColumns<ServicesItem>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.services.form.nameLabel"
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
      title: (
        <FormattedMessage
          id="pages.services.form.descriptionLabel"
          defaultMessage="Description"
        />
      ),
      dataIndex: 'description',
    },
    {
      title: (
        <FormattedMessage
          id="pages.services.form.pricelLabel"
          defaultMessage="Price"
        />
      ),
      dataIndex: 'price',
    },
    // столбец c Изменить
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
          <ConfirmDelete record={record} actionRef={actionRef} handleRemove={handleRemove} pageName="storeServices">
            <a key="config">
              <FormattedMessage id="pages.cure.batchDeletion" defaultMessage="Configuration" />
            </a>
          </ConfirmDelete>
        </>
      ],
    }
  ];

  // СОЗДАЁМ ТАБЛИЦУ
  return (
    <PageContainer>
      <ProTable<ServicesItem>
        headerTitle={intl.formatMessage({
          id: 'pages.store.service.title',
          defaultMessage: 'User list',
        })}
        actionRef={actionRef}
        rowKey="id"
        // поле поиска
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
        request={(params, sorter, filter) => queryServices({ ...params, sorter, filter })}
        // показывает столбцы 
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />

      {/* Модальное окно создания записи */}
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
        title={titleList.createTitle}
      />
      {/* Модальное окно обновления записи */}
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
        title={titleList.updateTitle}
      />
    </PageContainer>
  );
};

export default ServicesList;