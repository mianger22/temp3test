import React from 'react';
import { Popconfirm } from 'antd';

const confirm = (record: any, actionRef: any, handleRemove: any, pageName: string) => {
  let selectedItemData: any;
  
  if (pageName === "cure") {
    selectedItemData = [{
      id: record.id,
      user_id: record.user_id,
      stamp: record.stamp,
      name: record.name,
      doctor: record.doctor,
      step: record.step,
      diagnose: record.diagnose,
      cost: record.cost,
      cost_with_discount: record.cost_with_discount,
      rentgen: record.rentgen,
      plan_cure: record.plan_cure,
      result_cure: record.result_cure,
      tooths: record.tooths,
      result_text: record.result_text
    }];  
  } else if (pageName === "directory") {
    selectedItemData = [{
      id: record.id,
      name: record.name,
      description: record.description,
      img: record.img
    }];
  } else if (pageName === "storeProducts") {
    selectedItemData = [{
      id: record.id,
      name: record.name,
      vendor_code: record.vendor_code,
      description: record.description,
      image: record.image,
      group_id: record.group_id,
      price: record.price,
      hidden: record.hidden
    }];
  } else if (pageName === "storeServices") {
    selectedItemData = [{
      id: record.id,
      description: record.description,
      name: record.name,
      price: record.price
    }];
  } else if (pageName === "storeCategories") { 
    selectedItemData = [{
      id: record.id,
      name: record.name,
    }];
  } else if (pageName === "operators") { 
    selectedItemData = [{
      id: record.id,
      name: record.name,
      telegram_id: record.telegram_id,
      image: record.image
    }];
  } else if (pageName === "users") {
    selectedItemData = [{
      id: record.id,
      phone: record.phone,
      name: record.name,
      surname: record.surname,
      email: record.email,
      image_url: record.image_url,
      tooths: record.tooths
    }];    
  }

  handleRemove(selectedItemData);

  if (actionRef.current) {
    actionRef.current.reload();
  }
};

const ConfirmDelete: React.FC = (props: any) => {
  const preConfirm = () => {
    // передаем в основную функцию, если пользователь согласился, запись с данными
    confirm(props.record, props.actionRef, props.handleRemove, props.pageName)
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

export default ConfirmDelete;