import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import {
  ProFormText,
} from '@ant-design/pro-form';
import type { ServicesItem } from '../data.d';
import { Form } from 'antd';
import { useIntl, FormattedMessage } from 'umi';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<ServicesItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<ServicesItem>;
  title: string;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [form] = Form.useForm();
  const intl = useIntl();

  // место хранения корректного заголовка
  const [formTitle, upgradeFormTitle] = useState<any>([]);
  
  useEffect(() => {
    if (props.title === "Новая запись") {
      const resultTitle = intl.formatMessage({
        id: 'pages.services.new',
        defaultMessage: 'Добавление услуги'
      });

      upgradeFormTitle(resultTitle);
    } 
    
    if (props.title === "Изменение услуги") {
      const resultTitle = intl.formatMessage({
        id: 'pages.services.updateForm.title',
        defaultMessage: 'Изменение услуги'
      });

      upgradeFormTitle(resultTitle);
    }
  });

  const handleOk = () => {
    // получаем все поля ввода
    const fieldsInput: NodeListOf<HTMLInputElement> | undefined = document.getElementById("dynamic_rule")?.querySelectorAll("input");

    if (fieldsInput) {
      // собираем значения
      const itemId = props.values.id;
      const itemName = fieldsInput[0].value;
      const itemPrice = fieldsInput[2].value;
      const itemDescription = fieldsInput[1].value;

      // заносим значения в отправляемый объект
      const result = {
        id: itemId,
        name: itemName,
        price: +itemPrice,
        description: itemDescription,
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
      title={formTitle}
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
          price: props.values.price,
        }}
      >
        <ProFormText
          name="name"
          label={intl.formatMessage({
            id: 'pages.services.updateForm.nameLabel',
            defaultMessage: 'Name',
          })}
          width="md"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.field.notEmpty"
                  defaultMessage="This field cannot be empty"
                />
              ),
            },
          ]}
        />
        <ProFormText
          name="description"
          label={intl.formatMessage({
            id: 'pages.services.updateForm.descriptionLabel',
            defaultMessage: 'Description',
          })}
          width="md"
        />
        <ProFormText
          name="price"
          label={intl.formatMessage({
            id: 'pages.services.updateForm.priceLabel',
            defaultMessage: 'Price',
          })}
          width="md"
        />        
      </Form>
    </Modal>
  );
};

export default UpdateForm;