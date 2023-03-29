import React from 'react';
import { Modal } from 'antd';
import {
  ProFormCheckbox,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';

import type { ProductItem } from '../data.d';
import { queryCategories } from '../../Categories/service';
import UploadDragger from '@/components/ImageUploader'

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<ProductItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<ProductItem>;
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
          name: props.values.name,
          vendor_code: props.values.vendor_code,
          group_id: props.values.group_id,
          price: props.values.price,
          hidden: props.values.hidden
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
        <ProFormText
          name="vendor_code"
          label={intl.formatMessage({
            id: 'pages.product.updateForm.venderCodeLabel',
            defaultMessage: 'Vendor code3',
          })}
          width="md"
        />
        <ProFormText
          name="price"
          label={intl.formatMessage({
            id: 'pages.product.updateForm.priceLabel',
            defaultMessage: 'Price',
          })}
          width="md"
        />
        <ProFormCheckbox
          name="hidden"
          label={'Скрытый'}
          width="md" 
        />
        <ProFormSelect
          name="group_id"
          label={intl.formatMessage({
            id: 'pages.product.updateForm.GroupLabel',
            defaultMessage: 'Group',
          })}
          request={async _ => {
            var s: any = await queryCategories()
            if (s.success) {
              return s.data.map((x: any) => {
                return {
                  value: x.id,
                  label: x.name
                }
              })
            }
            return []
          }}
        />
        {/* <ProFormTextArea
          name="desc"
          width="md"
          label={intl.formatMessage({
            id: 'pages.searchTable.updateForm.ruleDesc.descLabel',
            defaultMessage: '规则描述',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.searchTable.updateForm.ruleDesc.descPlaceholder',
            defaultMessage: '请输入至少五个字符',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.updateForm.ruleDesc.descRules"
                  defaultMessage="请输入至少五个字符的规则描述！"
                />
              ),
              min: 5,
            },
          ]}
        /> */}
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          description: props.values.description,
        }}
        title={intl.formatMessage({
          id: 'pages.searchTable.updateForm.description.title',
          defaultMessage: 'Decription',
        })}
      >
        <ProFormTextArea
          name="description"
          width="xl"
          label={intl.formatMessage({
            id: 'pages.searchTable.updateForm.descriptionLable',
            defaultMessage: 'Description',
          })}
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          image: props.values.image
        }}
        title={intl.formatMessage({
          id: 'pages.searchTable.updateForm.image.title',
          defaultMessage: 'Image',
        })}
      >
       <UploadDragger name="image"/>
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateForm;
