import React from 'react';
import { Modal } from 'antd';
import {
  ProFormText,
  StepsForm,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';

import type { CategorieItem } from '../data.d';

export type FormValueType = {
  id: string,
  name: string;
} & Partial<CategorieItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<CategorieItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  return (
    <StepsForm
      stepsProps={{
        size: 'small',
      }}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            width={640}
            bodyStyle={{ padding: '32px 40px 48px' }}
            destroyOnClose
            title={intl.formatMessage({
              id: 'pages.product.updateForm.title',
              defaultMessage: 'Product',
            })}
            visible={props.updateModalVisible}
            footer={submitter}
            onCancel={(e) => {
              if (e.currentTarget.className === "ant-modal-close") {
                // когда кликнули только по крестику
              props.onCancel();
              }
            }}
          >
            {dom}
          </Modal>
        );
      }}
      onFinish={props.onSubmit}
    >
      <StepsForm.StepForm
        initialValues={{
          name: props.values.name
        }}
        title={intl.formatMessage({
          id: 'pages.product.updateForm.basicConfig',
          defaultMessage: 'Information',
        })}
      >
        <ProFormText
          name="name"
          label={intl.formatMessage({
            id: 'pages.product.updateForm.nameLabel',
            defaultMessage: 'Name',
          })}
          width="md"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.product.updateForm.nameNotEmpty"
                  defaultMessage="Name cannot be empty"
                />
              ),
            },
          ]}
        />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateForm;
