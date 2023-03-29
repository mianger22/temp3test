import * as react from 'react';
import styles from './tooth.less';
import ToothItemBottom from './ToothItemBottom';
import ToothItemTop from './ToothItemTop';
import { UserToothItem } from '@/pages/User/list/data';
import { AvailableListData } from '@/pages/directory/available/data';

export type ToothMapProps = {
    data: UserToothItem[],
    canEdit?: boolean,
    selected?: number[],
    selectFn?: (poistion: number, state: boolean) => boolean
    title?: string,
    onChange?: (position: number, available: string, helaths: any[], nerve: string) => void
    availables: AvailableListData[],
    healths: any[],
    nerves: any[],
    toothsDescription: object[]
}

const ToothMap: React.FC<ToothMapProps> = (props) => {
    const [avaliables] = react.useState<AvailableListData[]>(props.availables)
    const [healths] = react.useState(props.healths)
    const [nerves] = react.useState(props.nerves)
    // const [busy, setBusy] = react.useState(false)
    const [canEdit, _] = react.useState(props.canEdit)

    // порядок расположения зубов на плане лечения
    const firstTopList = [11, 12, 13, 14, 15, 16, 17, 18],
         secondTopList = [21, 22, 23, 24, 25, 26, 27, 28],
       firstBottomList = [41, 42, 43, 44, 45, 46, 47, 48],
      secondBottomList = [31, 32, 33, 34, 35, 36, 37, 38];

    return <div>
        <h2>{props.title || "Зубная карта"}</h2>
        <div className={styles.container}>
            <div className={styles.side}>
                {
                    firstTopList.map( item => <ToothItemTop
                        availables={avaliables}
                        healths={healths}
                        nerves={nerves}
                        canEdit={canEdit}
                        selectFn={props.selectFn}
                        selected={props.selected!.indexOf(item) > -1}
                        onChange={props.onChange}
                        item={props.data.find(x => x.position == item) as UserToothItem}
                        toothsDescription={props.toothsDescription} 
                    /> )   
                }
                {
                    secondTopList.map( item => <ToothItemTop
                        availables={avaliables}
                        healths={healths}
                        nerves={nerves}
                        canEdit={canEdit}
                        selectFn={props.selectFn}
                        selected={props.selected!.indexOf(item) > -1}
                        onChange={props.onChange}
                        item={props.data.find(x => x.position == item) as UserToothItem} 
                        toothsDescription={props.toothsDescription} 
                    /> ) 
                }
            </div>
            <div className={styles.side}>
                {
                    firstBottomList.map( item => <ToothItemBottom
                        availables={avaliables}
                        healths={healths}
                        nerves={nerves}
                        canEdit={canEdit}
                        selectFn={props.selectFn}
                        selected={props.selected!.indexOf(item) > -1}
                        onChange={props.onChange}
                        item={props.data.find(x => x.position == item) as UserToothItem} 
                        toothsDescription={props.toothsDescription} 
                    /> ) 
                }
                {
                    secondBottomList.map( item => <ToothItemBottom
                        availables={avaliables}
                        healths={healths}
                        nerves={nerves}
                        canEdit={canEdit}
                        selectFn={props.selectFn}
                        selected={props.selected!.indexOf(item) > -1}
                        onChange={props.onChange}
                        item={props.data.find(x => x.position == item) as UserToothItem} 
                        toothsDescription={props.toothsDescription} 
                    /> ) 
                }
            </div>
        </div>
    </div>
}

export default ToothMap;