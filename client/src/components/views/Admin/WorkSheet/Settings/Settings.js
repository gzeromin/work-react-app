import React, { memo, useEffect, useState } from 'react';
import style from './Settings.module.scss';
import RestTimePage from './Sections/RestTimePage/RestTimePage';
import Body from './Sections/Body/Body';
import { Modal } from 'antd';
import Calendar from '../../../../commons/Components/Calendar/Calendar';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setEmployeeWorksheetYear } from '../../../../../_actions/common_action';
import { PlusCircleOutlined } from '@ant-design/icons';

function Settings() {
  const [RestDays, setRestDays] = useState([]);
  const SelectedYear = useSelector(state => state.common.employeeWorksheetYear);
  const dispatch = useDispatch();

  useEffect(() => {
    let isMount = false;
    if(!isMount && (!SelectedYear)) {
      let date = new Date();
      const thisYear = date.getFullYear();;
      dispatch(setEmployeeWorksheetYear(thisYear));
    }
    return () => {
      isMount = true;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (SelectedYear) {
      fetchRestDays(isMounted);
    }
    return () => { isMounted = false; }
  }, [SelectedYear]);

  const fetchRestDays = (isMounted) => {
    axios.get(`/api/restDay/getRestDays?year=${SelectedYear}`).then(res => {
      if(res.data.success) {
        if (isMounted) setRestDays(res.data.result);
      } else {
        console.log(res.data.err);
      }
    });
  }

  const add = (index) => {
    let newArray = [...RestDays];
    newArray.splice(index + 1, 0, {
      dispOrder: index + 1,
      year: SelectedYear,
      kubun: '',
      month: '',
      day: '',
      n_th: '',
      day_of_the_week: '',
      biko: '',
      mode: 'insert'
    });
    setRestDays(newArray);
  };

  const remove = (index) => {
    const restDay = RestDays[index];
    if(restDay._id) {
      axios.post('/api/restDay/delete', restDay).then(res => {
        if (res.data.success) {
          Modal.success({
            content: '成功的に削除されました。',
          });
          fetchRestDays(true);
        } else {
          Modal.error({
            title: '削除失敗',
            content: res.data.err,
          });
        }
      });
    } else {
      let newArray = [...RestDays];
      newArray.splice(index, 1);
      setRestDays(newArray);
    }

  }
  const renderRestDays = () => RestDays.map((day, index) =>
    <Body
      key={index}
      index={index}
      restDay={day}
      funcAdd={add}
      funcRemove={remove}
      funcUpdateList={fetchRestDays}
    />
  );

  return (
    <div>
      <div className={style.header}>
        <div className={style.title}>休日／平日設定</div>
        <div className={style.calendar}>
          <Calendar />
        </div>
        <div className={style['sub-title']}>※休日設定部分以外は変更しないこと</div>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '2' }}>
          <RestTimePage />
        </div>
        <div style={{ flex: 'auto' }}>
          ※Tooltip
        </div>
      </div>
      <div className={style['date-title']}>日付設定</div>
      <table className={style['date-table']}>
        <thead>
          <tr className={style.tr}>
            <th className={style.th}>区分</th>
            <th className={style.th}>月</th>
            <th className={style.th}>日</th>
            <th className={style.th}>番目</th>
            <th className={style.th}>曜日</th>
            <th className={style.th}>備考</th>
            <th className={style['td-btn']}>
              <PlusCircleOutlined 
                onClick={() => add(-1)} 
              />
            </th>
          </tr>
        </thead>
        <tbody>
          { renderRestDays() }
        </tbody>
      </table>
    </div>
  )
}

export default memo(Settings);
