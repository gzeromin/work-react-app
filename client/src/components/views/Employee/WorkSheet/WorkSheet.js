import React, { memo, useEffect, useState } from 'react';
import style from './WorkSheet.module.scss';
import Header from './Sections/Header/Header';
import Body from './Sections/Body/Body';
import BodyTotal from './Sections/Body/BodyTotal';
import Footer from './Sections/Footer/Footer';

import { useDispatch, useSelector } from 'react-redux';
import { getQueryString } from '../../../../utils/stringUtils';

import { restDay } from '../../../commons/Constants/Admin/WorkSheetSettings';

import { getDBSchema, getSchemaData } from '../../../commons/Constants/Employee/WorkSheet';
import  { setEmployeeWorksheetYear, setEmployeeWorksheetMonth } from '../../../../_actions/common_action';

import axios from 'axios';
import { Modal } from 'antd';

function WorkSheet(props) {
  const dispatch = useDispatch();

  const user = useSelector(state => state.user);
  
  const SelectedYear = useSelector(state => state.common.employeeWorksheetYear);
  const SelectedMonth = useSelector(state => state.common.employeeWorksheetMonth);
  
  const [WorkSheet, setWorkSheet] = useState(getDBSchema());

  var totalDiligence = 0;

  const lastDay = new Date(SelectedYear, SelectedMonth + 1, 0);
  
  const restDays = [];
  restDay.map(v => {
    if(v.month === SelectedMonth + 1) {
      if(v.kubun === 1) {
        restDays.push(v.day);
      } else if(v.kubun === 2) {
        restDays.push((7 * v.n_th) + v.day_of_the_week - 2);
      }
    }
  });

  useEffect(() => {
    let isMount = false;
    if(!isMount && (!SelectedYear || !SelectedMonth)) {
      let date = new Date();
      const thisYear = date.getFullYear();
      const thisMonth = date.getMonth();
      dispatch(setEmployeeWorksheetYear(thisYear));
      dispatch(setEmployeeWorksheetMonth(thisMonth));
    }
    return () => {
      isMount = true;
    }
  }, []);

  useEffect(() => {
    fetchWorkSheet(getWriter());
  }, [SelectedYear , SelectedMonth]);

  const getWriter = () => {
    const id = getQueryString(props.location.search)['id'];
    if (id) {
      return id;
    } else if (user.userData) {
      return user.userData._id;
    } else {
      return;
    }
  }

  const fetchWorkSheet = (writer) => {
    axios.get(`/api/workSheet/getWorkSheet?writer=${writer}&year=${SelectedYear}&month=${SelectedMonth}`).then(res => {
      if (res.data.success) {
        if (res.data.result) {
          setWorkSheet(res.data.result);
        } else {
          setWorkSheet(getDBSchema( SelectedYear, SelectedMonth, writer ));
        }
      } else {
        console.log(res.data.err);
      }
    })
  }

  const workflowHander = (target) => {
    const obj = {
      target,
      action : !WorkSheet[target],
      workSheetId : WorkSheet._id
    };
    axios.post('/api/workSheet/workflow', obj).then(res => {
      if(res.data.success) {
        const newWorkSheet = {...WorkSheet};
        newWorkSheet[target] = obj.action;
        setWorkSheet(newWorkSheet);
      } else {
        console.log(res.data.err);
      }
    });
  }

  const updateWorkSheet = (index, item) => {
    const newWorkSheet = {...WorkSheet};
    newWorkSheet[index] = item;
    setWorkSheet(newWorkSheet);
  }

  const updateDeilgence = (value) => {
    totalDiligence = value;
  }

  const importFormExcel = (data) => {
    save(getSchemaData(getWriter(), data));
  };
  
  const save = (workSheet) => {
    axios.post('/api/workSheet/save', workSheet).then(res => {
      if (res.data.success) {
        console.log(res.data);
        dispatch(setEmployeeWorksheetYear(res.data.result.year));
        dispatch(setEmployeeWorksheetMonth(res.data.result.month));
        Modal.success({
          content: '保存されました。',
        });
      } else {
        console.log(res.data.err);
        Modal.error({
          title: '保存失敗',
          content: '管理者に問い合わせしてください。',
        });
      }
    })
  };

  const renderRows = () => {
    const tBody = [];
    for(var i = 1; i<= lastDay.getDate(); i++) {
      const item = (Object.keys(WorkSheet).indexOf(String(i)) !== -1) ? WorkSheet[i] : {};
      tBody.push(
        <Body
          key={i}
          index={i}
          item={item}
          restDays={restDays}
          funcUpdateWorkSheet={updateWorkSheet}
          modify
        />
      );
    }
    return tBody;
  }

  return (
    <div className='overflow-y'>
      <Header 
        userData={user.userData}
        writer={WorkSheet.writer}
        submit={WorkSheet.submit}
        approval={WorkSheet.approval}
        confirm={WorkSheet.confirm}
        funcSave={() => save({...WorkSheet, diligence: totalDiligence})}
        funcWorkSheetWorkflow={workflowHander}
        funcImport={importFormExcel}
      />
      <table className={style.workSheet}>
        <thead>
          <tr style={{borderRight: '1px solid white'}}>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th
              colSpan={5}
              style={{
                border: '1px solid black',
                textAlign: 'center',
                backgroundColor: 'rgb(192, 192, 192)'
              }}
            >
              勤怠
            </th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
          <tr>
            <th>日</th>
            <th>曜<br/>日</th>
            <th>出勤<br/>時間</th>
            <th>退勤<br/>時間</th>
            <th>休み<br/>時間</th>
            <th>勤務<br/>時間</th>
            <th>遅<br/>刻</th>
            <th>年<br/>次</th>
            <th>半<br/>休</th>
            <th>其<br/>休</th>
            <th>休<br/>出</th>
            <th>備考(産業内容)</th>
            <th></th>
            <th>休み時間(自動計算)</th>
            <th>残業<br/>時間</th>
          </tr>
        </thead>
        <tbody>
          { renderRows() }
          <BodyTotal
            workSheet={WorkSheet}
            lastDay={lastDay}
            funcUpdateDiligence={updateDeilgence}
          />
        </tbody>
      </table>
      <Footer />
    </div>
  )
}

export default memo(WorkSheet);
