import React from 'react';
import { Popconfirm } from 'antd';

const confirm = (
  record: any, 
  actionRef: any, 
  handleRemove: any, 
  pageName: string, 
  linkOperationName: any, 
  adminDelete: any,
  setShowDetail: any,
  setLinkOperationName: any,
  setLinkOperationNameDel: any,
  linkOperationNameDel: any
) => {
  let selectedItemData: any;
  
  if (pageName === "delAdmin") {
    selectedItemData = [{
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
      setShowDetail(false);
      setLinkOperationName("Удалить администратора");
      setLinkOperationNameDel("Удалить аккаунт");
    }
  } else if (pageName === "delMan") {
    selectedItemData = [{
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
    } 
  }

  if (actionRef.current) {
    actionRef.current.reload();
  }
};

const OwnConfirmDelete: React.FC = (props: any) => {
  const preConfirm = () => {
    // передаем в основную функцию, если пользователь согласился, запись с данными
    confirm(
      props.record, 
      props.actionRef, 
      props.handleRemove, 
      props.pageName, 
      props.linkOperationName, 
      props.adminDelete, 
      props.setShowDetail,
      props.setLinkOperationName,
      props.setLinkOperationNameDel,
      props.linkOperationNameDel
    )
  }

  return <Popconfirm
    title="Уверены?"
    onConfirm={preConfirm}
    okText="Да"
    cancelText="Нет"
  >
    {props.children}
  </Popconfirm>
};

export default OwnConfirmDelete;