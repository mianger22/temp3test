import React from 'react';
import { ProFormSelect, ProFormDatePicker } from '@ant-design/pro-form';
import { Modal, Form, DatePicker } from 'antd';
import { ScheduleListItem } from '../data';
import { FormattedMessage } from 'umi';
import { queryOperators } from '../../Operators/service';

export type NewScheduleFormProps = {
    visible: boolean,
    onChangeVisible: (visible: boolean) => void,
    addHandler: (value: ScheduleListItem) => Promise<boolean>,
    reload: () => void,
    title: string
}

const NewScheduleForm: React.FC<NewScheduleFormProps> = (props) => {
    // const actionRef = useRef<ActionType>();
    return (
        <Form
            onFinish={async (value) => {
                await props.addHandler(value as ScheduleListItem);
                props.reload()
            }}
        >
            <Modal
                title={props.title}
                width="400px"
                visible={props.visible}
                onCancel={(e) => {
                    if (e.currentTarget.className === "ant-modal-close" || e.currentTarget.className === "ant-btn ant-btn-default") {
                        // когда кликнули только по крестику
                        props.onChangeVisible(false);
                    } 
                }}
            >
            {/* <ProFormDatePicker
                rules={[
                    {
                        required: true,
                        message: (
                            <FormattedMessage
                                id="pages.user.ruleName"
                                defaultMessage="Rule name is required"
                            />
                        ),
                    },
                ]}
                width="md"
                name="worked_at"
                className='datepick'
                style={{ width: '100%!important' }}
            /> */}
            <DatePicker 
                placeholder='Выберите значение' 
                style={{ width: '100%', marginBottom: 30 }}
                 
                // rules={[
                //     {
                //         required: true,
                //         message: (
                //             <FormattedMessage
                //                 id="pages.user.ruleName"
                //                 defaultMessage="Rule name is required"
                //             />
                //         ),
                //     },
                // ]}
                name="worked_at"
            />
            <ProFormSelect
                // width="md"
                name="operator_id"
                request={async _ => {
                    var s: any = await queryOperators()
                    // console.log(s)
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
        </Modal>
    </Form>
    )
}

export default NewScheduleForm;