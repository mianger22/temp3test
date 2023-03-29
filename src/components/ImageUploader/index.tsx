import React, { useContext, useEffect, useState } from 'react';
import { Upload, ConfigProvider, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { ProFormFieldItemProps } from '@ant-design/pro-form/lib/interface';
import {createField} from '@ant-design/pro-form/lib/BaseForm/createField';
import { UploadFile } from 'antd/lib/upload/interface';
// import { host } from '@/global';
import { getToken } from '@/utils/authority';

export type ImageUploaderProps = {
    onChange: (file: string) => void
}
export type ProFormDraggerProps = ProFormFieldItemProps<ImageUploaderProps> & {
    value?: string;
};

/**
 * 拖动上传组件
 *
 * @param
 */
const UploadDragger: React.FC<ProFormDraggerProps> = React.forwardRef(
    (
        props,
        ref: any,
    ) => {
        const [value, setValue] = useState<any>(props.value)
        const [fileList, setFileList] = useState<UploadFile[]>([])
        const context = useContext(ConfigProvider.ConfigContext);
        const baseClassName = context.getPrefixCls('upload');
        useEffect(() => {
            var a: UploadFile = { uid: "", name: "image", response: { url: value } };
           
            setFileList([a]);
        }, [value])
        return (
            <div>
                <img src={value} style={{maxWidth:"100%"}}/>
                <div>&nbsp;</div>
                <Upload
                    className={baseClassName}
                    fileList={fileList}
                    ref={ref}
                    itemRender={(originNode: React.ReactElement, file: UploadFile, fileList?: any) => {
                        return <span></span>
                    }}
                    action={`https://swiss.itupme.com/api/v1/upload/`}
                    // action={`http://app.swiss-dental.ru/api/v1/upload/`}
                    maxCount={1}
                    onChange={(info) => {
                        if (props.fieldProps?.onChange && info.file.status == "uploading") {
                            // СДЕЛАТЬ ЗАГРУЗКУ ИМЖ НА СЕРВЕР И ОТВЕТНЫЙ УРЛ ОТПРАВЛЯТЬ ВЫШЕ

                            // 1. загрузка
                            let imgUrl;
                            (async function () {
                                // продключаем либу
                                const axios = require('axios').default;

                                // добавляем токен для того, чтобы сервер принимал запросы
                                axios.defaults.headers.common['Authorization'] = `Bearer ${getToken()}`;
                        
                                // кодируем картинку
                                const formData = new FormData();
                                formData.append('file', info.file.originFileObj);

                                // отправляем её
                                await axios.post(
                                    'https://swiss.itupme.com/api/v1/upload/', formData,
                                    {
                                        headers: {
                                            'Content-Type': 'multipart/form-data'
                                        }
                                    }
                                ).then(
                                    response => {
                                        // получаем ссылку
                                        try {
                                            if (response.status === 200) {
                                                // если сервер успешно обработал наш запрос
                                                imgUrl = response.data.url;
                                            } else {
                                                alert("Ошибка загрузки картинки");
                                            }
                                        } catch (e) {
                                            console.error("error text:", e);
                                        }
                                    }
                                )
                        
                                return imgUrl;
                              })().then((responseData) => {
                            if (responseData) {
                                // 2. отправка
                                    
                                setValue(imgUrl)
                                props.fieldProps?.onChange(imgUrl);
                            }
                            }).catch(e => {
                                console.error("error text:", e);
                            });
                        } 
                    }}
                >
                    <Button icon={<UploadOutlined />}>{value ? "Изменить" : "Загрузить"}</Button>
                </Upload>
            </div>
        );
    },
);

export default createField<ProFormDraggerProps>(UploadDragger);

// const UploadDragger = (val: any)=> {
//     console.clear()
//     console.log("val =", val)
//     return <div>hello</div>
// }

// export default UploadDragger