import React from "react"
import UploadDragger from '@/components/ImageUploader/index';
import { Modal, Form, Input } from 'antd';
import { useIntl } from 'umi';

export type NewFormCommonProps = {
    handleModalVisible: (visible: boolean) => void,
    createModalVisible: boolean,
    actionRef: any,
    handleAdd: any
}

const NewFormСommon: React.FC<NewFormCommonProps> = (props) => {
    const nameItem = React.useRef(null);
    const descItem = React.useRef(null);
    const srcItem = React.useRef(null);
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
              const description = descItem.current && descItem.current.input.value;
              const src = srcItem.current && srcItem.current.fileList[0].response.url;

              let success: any;

              if (name === "") {
                // ворнингируем пустое поле
                setNameEmpty(true);
              } else {
                setNameEmpty(false);
        
                success = await props.handleAdd({
                  name: name,
                  description: description,
                  img: src
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
          <div style={{marginBottom: 10, display: "flex"}}>
            <div style={{color: 'red', marginRight: 5}}>*</div>Наименование:
          </div>
          {
            nameEmpty ?
            <>
              <Input 
                width="xl"
                ref={nameItem}
                status="error"
              />
              <div style={{color: "red"}}>Необходимо заполнить поле</div>
            </> :
            <Input 
              width="xl"
              ref={nameItem}
            />
          }

          <div style={{marginBottom: 10, marginTop: 20}}>Описание:</div>
          <Input 
            width="xl"
            ref={descItem}
          />

          <div style={{marginBottom: 10, marginTop: 20}}>Изображение</div>
          <UploadDragger 
            width="xl" 
            name="img" 
            fieldRef={srcItem}
          />
        </Form>
      </Modal>
    )
}

export default NewFormСommon;