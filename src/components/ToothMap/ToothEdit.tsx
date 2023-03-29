import { AvailableListData } from '@/pages/directory/available/data';
import { HealthListItem } from '@/pages/directory/health/data';
import { NerveListItem } from '@/pages/directory/nerve/data';
import { UserToothItem } from '@/pages/User/list/data';
import { PlusOutlined } from '@ant-design/icons';
import ProForm, { ProFormSelect } from '@ant-design/pro-form';
import { Button, Modal, Form} from 'antd';
import React, { useEffect, useState } from 'react';

export type ToothEditProps = {
    nerves: NerveListItem[],
    availables: AvailableListData[],
    healths: HealthListItem[],
    visible: boolean,
    localtion: string,
    onVisisbleChange: (value: React.SetStateAction<boolean>) => void
    onFinish: (formData: any) => Promise<boolean | void>
    item: UserToothItem
}

const ToothEdit: React.FC<ToothEditProps> = (props) => {
    const [form] = Form.useForm();
    const [health, setHealth] = useState<string[]>([]);
    const [healthField, updateHealths] = useState<JSX.Element[]>([]);

    // отслеживаем значение поля Зуб
    const selectedTooth = Form.useWatch('available', form);
    // отслеживаем значение поля Корень
    const selectedDentalRoot = Form.useWatch('nerve', form);

    // отслеживаем значение полей Описание
    // 1. создаём переменные-хранилища
    let selectedDescription0: any, selectedDescription1: any, selectedDescription2: any, selectedDescription3: any, selectedDescription4: any, selectedDescription5: any, selectedDescription6: any, selectedDescription7: any, selectedDescription8: any, selectedDescription9: any;

    // 2. помещаем их в массив, чтобы ими управлять
    let listSelectedDescriptions = new Array(
        selectedDescription0, selectedDescription1, selectedDescription2, selectedDescription3, selectedDescription4,
        selectedDescription5, selectedDescription6, selectedDescription7, selectedDescription8, selectedDescription9);

    // 3. наполняем каждую просмотром за своим полем описания
    for (let i = 0; i < 9; i++) {
        listSelectedDescriptions[i] = Form.useWatch('health_id_' + i, form);
    }

    // конец

    const healthReuqst = async () => {
        return props.healths
            .filter((x: HealthListItem) => { return x.name.indexOf(props.localtion)>-1 })
            .map((x: HealthListItem) => {
                return {
                    value: x.id,
                    label: x.description
                }
            })
    }

    useEffect(() => {
        if (props.item) {
            setHealth(props.item.health_ids)
        }
    }, [props])

    useEffect(() => {
        let fields = health.map((x, i) => {
            return <ProFormSelect name={`health_id_${i}`} key={`health_id_${i}`} initialValue={x} request={healthReuqst} />
        })

        updateHealths(fields)
    }, [health])

    const handleOk = () => {
        // получаем выбранные описания
        let plan = [];

        for (let i = 0; i < listSelectedDescriptions.length; i++) {
            if (listSelectedDescriptions[i] !== undefined) {
                plan.push(listSelectedDescriptions[i]);
            }
        }

        // сохраняем их в набор данных
        const values = {
            available: selectedTooth,
            nerve: selectedDentalRoot,
            plan
        }

        // скрываем форму
        props.onVisisbleChange(false);
                    
        // отправляем данные
        return props.onFinish({
            available_id: values.available,
            nerve_id: values.nerve,
            health_ids: values.plan
        })
    };

    const handleCancel = () => {
        // скрываем форму
        props.onVisisbleChange(false);
    };

    return (
        <Modal
            destroyOnClose
            title="Редактирование"
            visible={props.visible}
            okText="Сохранить"
            cancelText="Отменить"
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Form 
                form={form} 
                name="editInfoTooth" 
                layout="vertical"  
            >
                    <ProFormSelect
                        label="Зуб"
                        request={async () => {
                            return props.availables.filter(x => x.name.indexOf(props.item.position.toString()) > -1).map((x: any) => {
                                return {
                                    value: x.id,
                                    label: x.description
                                }
                            })
                        }}
                        initialValue={props.item.available_id}
                        onMetaChange={()=>alert('grow')}
                        name="available" />

                    <ProFormSelect
                        label="Корень"
                        request={async () => {
                           return props.nerves.filter(x => (x.name.indexOf(props.item.position.toString()) > -1 || x.name.indexOf(props.localtion) > -1)).map((x: any) => {
                                return {
                                    value: x.id,
                                    label: x.description
                                }
                            })
                        }}
                        initialValue={props.item.nerve_id}
                        name="nerve" />

                    <ProForm.Group title="Описание">
                        {healthField}
                        <br />
                    </ProForm.Group>
                    <Button type="primary" onClick={() => {
                        var s = [...health]
                        s.push("")
                        setHealth(s)
                    }}>
                        <PlusOutlined /> Добавить
                    </Button>
            </Form>
      </Modal>
   )
}
export default ToothEdit