import React, { ReactNode, useEffect, useState } from 'react';
import { Modal, Input } from 'antd';
import {
  ProFormSelect,
  ProFormText,
  StepsForm,
  ProFormDateTimePicker,
  ProFormDigit,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';
import type { CureListItem, CureToothPlanItem, CureToothItem } from '../data.d';
import ToothMap from '@/components/ToothMap/ToothMap';
import { AvailableListData } from '@/pages/directory/available/data';
import UploadDragger from '@/components/ImageUploader';
import { UserToothItem } from '@/pages/User/list/data';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<CureListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: CureListItem) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<CureListItem>;
  availables: AvailableListData[],
  healths: any[],
  nerves: any[],
  pacientsList: any[]
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([])
  const [userToothMap, setUserToothMap] = useState([])
  const [stamp, setStamp] = useState(new Date())
  const [selectedTeethField, setSelectedTeethFields] = useState<ReactNode[]>([])
  const [selectedIniitalValues, setselectedIniitalValues] = useState({})
  const [resultVisible, setResultVisible] = useState<boolean>(false)
  const [resultText, setResultText] = useState<string>("")
  const [resultCure, setResultCure] = useState<UserToothItem[]>(props.values.result_cure)
  const intl = useIntl();
  const selectFn = (position: number, state: boolean): boolean => {
    if (selectedTeeth.indexOf(position) > -1 && !state) {
      setSelectedTeeth(selectedTeeth.filter(x => x != position))
      return true
    }
    if (selectedTeeth.indexOf(position) == -1 && state) {
      var v = [...selectedTeeth];
      v.push(position)
      setSelectedTeeth(v)
      return true
    }
    return false
  }

  useEffect(() => {
    let vals = props.values;

    if (vals.result_text && vals.result_text !== "") {
      setResultText(vals.result_text);
    } else {
      setResultText("");
    }

    if (vals.stamp && vals.stamp.getTime() < Date.now()) {
      setResultVisible(true);
    }

    if (vals.tooths && vals.tooths.length > 0) {
      (async () => {
        setUserToothMap(vals.tooths);

        if (vals.result_cure.length == 0) {
          setResultCure(vals.tooths)
        } else {
          var r = vals.tooths.map((x: UserToothItem) => {
            var in_result = vals.result_cure.find((j: CureToothItem) => j.position == x.position)
            if(!in_result) {
              return x
            } 
            return in_result
          })
          setResultCure(r)
        }
      })()
    }

    if (vals.plan_cure) {
      var s = vals.plan_cure.map((x: CureToothPlanItem) => x.position)
      setSelectedTeeth(s)
      var init = vals.plan_cure.reduce((a: any, x: CureToothPlanItem) => {
        a[`plan_cure_tooth_${x.position}`] = x.description
        return a
      }, {})
      setselectedIniitalValues(init)
    }
  }, [props])

  useEffect(() => {
    var v = selectedTeeth.map(x => {
      return <ProFormText
        disabled={resultVisible}
        name={`plan_cure_tooth_${x}`}
        key={`plan_cure_tooth_${x}`}
        label={`Описание по зубу ${x}`}
      />
    })
    setSelectedTeethFields(v)
  }, [selectedTeeth])

  useEffect(() => {
    return () => {
      // console.log("cleaned up");
    };
  }, []);

  return (
      <StepsForm
        stepsProps={{
          size: 'small',
        }}
        stepsFormRender={(dom, submitter) => {
          return (
            <Modal
              width={800}
              bodyStyle={{ padding: '32px 40px 48px' }}
              destroyOnClose
              title={intl.formatMessage({
                id: 'pages.searchTable.updateForm.ruleConfig',
                defaultMessage: '规则配置',
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
        onFinish={async (values: any) => {
          var props_ = Object.getOwnPropertyNames(values)
          var plan = props_.filter(x => /plan_cure_tooth/.test(x)).map(x => {
            return {
              "position": x.split("_").filter(x => !isNaN(parseInt(x))).map(x => parseInt(x))[0],
              "description": values[x]
            }
          })
          let result: CureListItem = {
            user_id: values.user_name || props.values.user_id,
            stamp: new Date(values.stamp || props.values.stamp).toISOString(),
            name: values.name || props.values.name,
            plan_cure: plan || props.values.plan_cure,
            rentgen: values.rentgen || props.values.rentgen,
            result_cure: resultCure || props.values.result_cure,
            cost: parseFloat(values.cost) || props.values.cost,
            cost_with_discount: parseFloat(values.cost_with_discount) || props.values.cost_with_discount,
            doctor: values.doctor || props.values.doctor,
            diagnose: values.diagnose || props.values.diagnose,
            step: values.step || props.values.step,
            result_text: values.result_text || props.values.result_text
          }
    
          props.onSubmit(result);
        }}
      >
        <StepsForm.StepForm title="Общая информация" initialValues={props.values}>
          <ProFormText
            label="Название процедуры"
            width="md"
            name="name"
            rules={[{ required: true }]}
          />
          <ProFormDateTimePicker
            proFieldProps={{
            render:()=>{
              return "123"
            }
            }}
            label="Дата приема"
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
            name="stamp"
          />
          <ProFormText
            label="Врач"
            width="md"
            name="doctor"
            rules={[{ required: true }]}
          />
          <ProFormSelect
            showSearch
            label="Пациент"
            width="md"
            name="user_name"
            rules={[{ required: true }]}
            placeholder="Выберите значение"
            request={async () => await props.pacientsList}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm title="План лечения" initialValues={selectedIniitalValues}>
          <ToothMap
            availables={props.availables}
            healths={props.healths}
            nerves={props.nerves}
            data={userToothMap}
            canEdit={false}
            selected={selectedTeeth}
            selectFn={resultVisible ? () => { return false } : selectFn}
            toothsDescription={props.values.plan_cure}
          />
          {selectedTeethField}
        </StepsForm.StepForm>
        <StepsForm.StepForm title="Диагноз" initialValues={props.values}>
          <ProFormText
            label={"Диагноз"}
            name="diagnose"
          />
          <ProFormText
            label={"Этап"}
            name="step"
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm title="Стоимость" initialValues={props.values}>
          <ProFormDigit
            label={"Стоимость"}
            name="cost"
          />
          <ProFormDigit
            label={"Стоимость со скидкой"}
            name="cost_with_discount"
          />
        </StepsForm.StepForm>
        {resultVisible && <StepsForm.StepForm title={"Рентген"} initialValues={{ "rentgen": props.values.rentgen }}>
          <UploadDragger name="rentgen" />
        </StepsForm.StepForm>}
        { resultVisible &&
          <StepsForm.StepForm title="Результат">
            <ToothMap
              data={resultCure}
              availables={props.availables}
              healths={props.healths}
              nerves={props.nerves}
              canEdit={props.values.result_cure && props.values.result_cure.length == 0}
              selected={props.values.plan_cure ? props.values.plan_cure.map((x: UserToothItem) => x.position) : []}
              selectFn={() => { return false }}
              onChange={(position, available, healths, nerve) => {
                var cure = [...resultCure]
                var tooth = cure.find(x => x.position == position)
                if (tooth) {
                  tooth.available_id = available
                  tooth.health_ids = healths
                  tooth.nerve_id = nerve
                  setResultCure(cure)
                } else {
                  cure.push({
                    position,
                    available_id: available,
                    health_ids: [],
                    nerve_id: nerve
                  })
                  setResultCure(cure)
                }
              }}
              toothsDescription={props.values.plan_cure}
            />
            <ProFormText
              label="Описание"
              width="md"
              name="result_text"
              rules={[{ required: true }]}
            >
              <Input 
                defaultValue={resultText} 
                placeholder="Напишите заключение"
              />
            </ProFormText>
          </StepsForm.StepForm>}
      </StepsForm>
  );
};

export default UpdateForm;
