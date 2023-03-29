import React from "react"
import UploadDragger from '@/components/ImageUploader/index';
import { Modal, Form, Input } from 'antd';
import { useIntl } from 'umi';

export type NewFormProps = {
    handleModalVisible: (visible: boolean) => void,
    createModalVisible: boolean,
    actionRef: any,
    handleAdd: any
}

const NewForm: React.FC<NewFormProps> = (props) => {
    const nameItem = React.useRef(null);
    const intl = useIntl();

    const [nameEmpty, setNameEmpty] = React.useState<boolean>(false);
    
    return (
      <Modal
          title={intl.formatMessage({
            id: 'pages.user.createForm.newRule',
            defaultMessage: 'New rule',
          })}
          width="400px"
          visible={props.createModalVisible}
          onOk={
            async () => {
              const name = nameItem.current && nameItem.current.input.value;

              if (name === "") {
                // ворнингируем пустое поле
                setNameEmpty(true);
              } else {
                setNameEmpty(false);
        
                const success = await props.handleAdd({
                  name: name,
                });

                if (success) {
                  props.handleModalVisible(false);
                  if (props.actionRef.current) {
                    props.actionRef.current.reload();
                  }
                }
              }
            }
          }
          onCancel={(e) => {
            if (e.currentTarget.className === "ant-modal-close" || 
                  e.currentTarget.className === "ant-btn ant-btn-default") {
                // когда кликнули только по крестику
                props.handleModalVisible(false)
            } 
          }}
        >
        <Form>
          {
            nameEmpty ?
            <>
              <Input 
                width="xl"
                ref={nameItem}
                placeholder="Введите значение"
                status="error"
              />
              <div style={{color: "red"}}>Необходимо заполнить поле</div>
            </> :
            <Input 
              width="md"
              placeholder="Введите значение"
              ref={nameItem}
            />
          }
        </Form>
      </Modal>
    )
}

export default NewForm;