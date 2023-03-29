import React from 'react';
import { Modal } from 'antd';
import {
  ProFormText,
} from '@ant-design/pro-form';
import UploadDragger from '@/components/ImageUploader'
import type { HealthListItem } from '../data.d';
import { Form } from 'antd';

export type FormValueType = {
  name?: string;
  description?: string;
  img?: string;
} & Partial<HealthListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: HealthListItem) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<HealthListItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    // получаем все поля ввода
    const fieldsInput: NodeListOf<HTMLInputElement> | undefined = document.getElementById("dynamic_rule")?.querySelectorAll("input");

    if (fieldsInput) {
      // собираем значения
      const itemName = fieldsInput[0].value;
      const itemDescription = fieldsInput[1].value;
      const itemId = props.values.id;
      const itemImg = document.querySelectorAll("img")[4].src;

      // заносим значения в отправляемый объект
      const result = {
        id: itemId,
        img: itemImg,
        name: itemName,
        description: itemDescription
      }

      // отправляем объект на сервер
      props.onSubmit(result)
    }
  };

  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="Изменение состояния зуба"
      visible={props.updateModalVisible}
      okText="Сохранить"
      cancelText="Отменить"
      onOk={handleOk}
      onCancel={(e) => {
        if (e.currentTarget.className === "ant-modal-close") {
          // когда кликнули только по крестику
        props.onCancel();
        }
      }}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <Form 
        form={form} 
        name="dynamic_rule" 
        layout="vertical" 
        initialValues={{
          name: props.values.name,
          description: props.values.description,
          img: props.values.img
        }}
      >
        <ProFormText
          name="name"
          label="Наименование"
          width="xl"
        />
        <ProFormText
          name="description"
          label="Описание"
          width="xl"
        />
        <UploadDragger name="img" />
      </Form>
    </Modal>
  );
};

export default UpdateForm;
