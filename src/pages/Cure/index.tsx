import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import UpdateForm from './components/UpdateForm';
import type { CureListItem } from './data.d';
import { queryCure, updateRule, addRule, removeRule } from './service';
import NewCureForm from './components/NewForm';
import ToothMap from '@/components/ToothMap/ToothMap';
import { UserToothItem } from '../User/list/data';
import request from '@/utils/request';
import { AvailableListData } from '../directory/available/data';
import { queryUsers } from '@/pages/User/list/service';
import arraySort from 'array-sort';

// библиотеки для печати
import { Paragraph, Document, Packer } from "docx";
import { saveAs } from "file-saver";
import ConfirmDelete from '@/components/Common/ConfirmDelete';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: CureListItem) => {
  const hide = message.loading('Добавление');
  try {
    await addRule({ ...fields });
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
const handleUpdate = async (fields: CureListItem) => {
  const hide = message.loading('Обновление');
  try {
    await updateRule({ ...fields });
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
const handleRemove = async (selectedRows: CureListItem[]) => {
  const hide = message.loading('Удаление');
  if (!selectedRows) return true;
  try {
    await removeRule({
      id: selectedRows.map((row) => row.id!),
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

const CureList: React.FC = (props) => {
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
  const [currentRow, setCurrentRow] = useState<CureListItem>();
  const [selectedRowsState, setSelectedRows] = useState<CureListItem[]>([]);
  const [avaliables, setAvailables] = useState<AvailableListData[]>([])
  const [healths, setHealths] = useState([])
  const [nerves, setNerves] = useState([])
  const [pacientsList, setPacientsList] = useState([])

  // сохраняем все табличные данные
  const [dataTable, setDataTable] = useState<CureListItem[]>([])

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  useEffect(function fetch() {
    // стираю список пользователей из хранилища, 
    // чтобы при обновлении страницы всегда загружались новые пользователи
    localStorage.removeItem('usersData');
    localStorage.removeItem('doctorsData');

    // заранее загружаем список пациентов для ведения приёмов
    let pacients: any = async () => {
        let newUsersData: any;
        let s: any;
  
        // создаём массив для хранения имён пользователей
        let listUserNames: any = [];
  
        function core(): any {
            if (newUsersData) {
                let nud = JSON.parse(newUsersData);
                let listUserNamesTemp: any = [];
  
                for (let i = 0; i < nud.length; i++) {
                    listUserNamesTemp.push({ id: nud[i].id, name: nud[i].name || "", surname: nud[i].surname || "" })
                }
  
                // сортируем по фамилиям в алфавитном порядке
                listUserNames = arraySort(listUserNamesTemp, 'surname');
            } else {
                let listUserNamesTemp: any = [];
  
                for (let i = 0; i < s.data.length; i++) {
                    listUserNamesTemp.push({ id: s.data[i].id, name: s.data[i].name || "", surname: s.data[i].surname || "" })
                }
  
                // сортируем по фамилиям в алфавитном порядке
                listUserNames = arraySort(listUserNamesTemp, 'surname');
            }
        
            return true;
        }
  
        if (!localStorage.getItem('usersData')) {
            s = await queryUsers();
  
            if (s.success) {
                localStorage.setItem('usersData', JSON.stringify(s.data));
  
                core();
            
                return listUserNames.map((user: any) => {
                    return {
                        value: user.id,
                        label: `${user.surname || 'N'} ${user.name || 'A'}` || 'Не указан'
                    }
                })
            }
        } else {
            newUsersData = localStorage.getItem('usersData');
  
            core();
  
            return listUserNames.map((user: any) => {
                return {
                    value: user.id,
                    label: `${user.surname || 'N'} ${user.name || 'A'}` || 'Не указан'
                }
            })
        }
  
        return []
      }
  
      setPacientsList(pacients);

    (async function () {
      // setBusy(true)
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

    return () => {
      // стираю список пользователей из хранилища, 
      // чтобы при переходе с других страниц всегда загружались новые пользователи
      localStorage.removeItem('usersData');
      localStorage.removeItem('doctorsData');
    };
  }, [props])

  const columns: ProColumns<CureListItem>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.cure.form.nameLabel"
          defaultMessage="Cure name"
        />
      ),
      dataIndex: 'name',
      hideInSearch: true,
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
          id="pages.cure.form.stampLabel"
          defaultMessage="Stamp"
        />
      ),
      filters: true,
      onFilter: true,
      sorter: (a, b) => {
        if (a.stamp.hasOwnProperty('diff')) {
          return a.stamp.diff(b.stamp)
        } else {
          return Date.parse(a.stamp) - Date.parse(b.stamp)
        }
      },
      dataIndex: 'stamp',
      valueType: 'dateRange',
      render: (dom, entity) => {

        // var s = Date.parse(entity.stamp.toString())
        if (entity.stamp.$date) {
          entity.stamp = new Date(entity.stamp.$date)
        }

        return (
          <span>
            {entity.stamp.toLocaleString()}
          </span>
        );
      },
    },
    {
      title: (
        <FormattedMessage
          id="pages.cure.form.userLabel"
          defaultMessage="Pacient"
        />
      ),
      filters: true,
      onFilter: true,
      dataIndex: 'user_name',
    },
    {
      title: (
        <FormattedMessage
          id="pages.cure.form.userPhoneLabel"
          defaultMessage="Pacient Phone"
        />
      ),
      hideInSearch: true,
      dataIndex: 'user_phone',
    },
    {
      title: (
        <FormattedMessage
          id="pages.cure.form.doctorLabel"
          defaultMessage="Doctor"
        />
      ),
      filters: true,
      onFilter: true,
      dataIndex: 'doctor',
    },
    {
      title: (
        <FormattedMessage
          id="pages.cure.form.diagnoseLabel"
          defaultMessage="Diagnose"
        />
      ),
      hideInSearch: true,
      dataIndex: 'diagnose',
    },
    {
      title: (
        <FormattedMessage
          id="pages.cure.form.costLabel"
          defaultMessage="Cost"
        />
      ),
      hideInSearch: true,
      dataIndex: 'cost',
    },
    {
      title: (
        <FormattedMessage
          id="pages.cure.form.costDiscountLabel"
          defaultMessage="Cost with discount"
        />
      ),
      hideInSearch: true,
      dataIndex: 'cost_with_discount',
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
          <ConfirmDelete record={record} actionRef={actionRef} handleRemove={handleRemove} pageName="cure">
            <a key="config">
              <FormattedMessage id="pages.cure.batchDeletion" defaultMessage="Configuration" />
            </a>
          </ConfirmDelete>
        </>
      ],
    },
  ];

  // функционал печати
  const printer = () => {
    let itemsList: any = [], list: object[] = [], doc: any;

    (async function () {
      // получаем все приёмы
      const allCures = await request('/api/v1/dentistry/cure/?pageSize=128');
      // получить всех пользователей
      const allUsers = await request('/api/v1/users');
      
      // 1. получаем и сохраняем id пользователей

      // здесь будем хранить id всех пользователей
      let idUsersList: string[] = [];

      for (let user of allUsers.result) {
        // сохраняем id каждого пользователя
        idUsersList.push(user.id);
      }

      // сравниваем id с id пациента
      // и если равняются, то забираем его имя

      // заносим их в хранилище
      itemsList.push(allCures.result.items);

      for (let el of itemsList[0]) {
        // получаем данные пациента
        const positionId = idUsersList.indexOf(el.user_id); // находит позицию пользователя
        const pacientData = allUsers.result[positionId]; // находим данные конкретного пользователя

        // формируем его имя
        const pacientName = pacientData.name + " " + pacientData.surname;

        list.push({
          text: `Имя записи: ${el.name}, пациент: ${pacientName}, диагноз: ${el.diagnose}, имя доктора: ${el.doctor}, стоимость: ${el.cost}, со скидкой: ${el.cost_with_discount}`,
          bullet: {
            level: 0
          }
        });
      }

      return list;
    })().then(() => {
      try {
        doc = new Document({
          sections: [{
              children: list.map((row: any)=>{
                return new Paragraph(row)
              })
            }]
        });

        Packer.toBlob(doc).then((blob) => {
          saveAs(blob, "example.docx");
        });
      } catch (e) {
        console.error("error: ", e)
      }
  });
  };

  return (
    <PageContainer>
      <button type="button" onClick={printer}>Print</button>

      <ProTable<CureListItem>
        headerTitle={intl.formatMessage({
          id: 'pages.cure.title',
          defaultMessage: 'Cure form',
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
            <PlusOutlined /> <FormattedMessage id="pages.cure.new" defaultMessage="New" />
          </Button>,
        ]}
        request={(params, sorter, filter) => queryCure({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      
      <NewCureForm
        availables={avaliables}
        healths={healths}
        nerves={nerves}
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
      pacientsList={pacientsList}
        availables={avaliables}
        healths={healths}
        nerves={nerves}
        onSubmit={async (value) => {
          value.id = currentRow?.id
          console.log(value)
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
            <ProDescriptions<CureListItem>
              column={2}
              title={currentRow?.name}
              request={async () => ({
                data: currentRow || {},
              })}
              params={{
                id: currentRow?.name,
              }}
              columns={columns as ProDescriptionsItemProps<CureListItem>[]}
            />
            <ToothMap
              data={currentRow.tooths}
              availables={avaliables}
              healths={healths}
              nerves={nerves}
              selected={currentRow.plan_cure.map((x: UserToothItem) => x.position)}
              title={"План лечения"}
              toothsDescription={currentRow.plan_cure}
            />
            { currentRow.result_text && `Описание: ${currentRow.result_text}` }
          </div>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default CureList;
