import React, { memo, useEffect, useState } from 'react';
import {
  getTimeQuantityHM,
  numToStringHM 
} from '../../../../../../utils/timeUtils';

function BodyTotal(props) {

  const lastDay = props.lastDay;

  const [Total, setTotal] = useState({
    breakTime: 0,
    workTime: 0,
    late: 0,
    annual: 0,
    half: 0,
    etc: 0,
    attendance: 0,
    overTime: 0
  });

  useEffect(() => {
    calculateTotal(props.workSheet);
  }, [props.workSheet]);
  
  const calculateTotal = (updatedWorkSheet) => {
    const total = {
      breakTime: 0,
      workTime: 0,
      late: 0,
      annual: 0,
      half: 0,
      etc: 0,
      attendance: 0,
      overTime: 0
    }

    for(var i = 1; i<= lastDay.getDate(); i++) {
      const item = (Object.keys(updatedWorkSheet).indexOf(String(i)) !== -1) ? updatedWorkSheet[i] : {};
      if(item.breakTime) {
        total.breakTime = total.breakTime + getTimeQuantityHM(item.breakTime);
      }
      if(item.workTime) {
        total.workTime = total.workTime + getTimeQuantityHM(item.workTime);
      }
      if(item.late && parseInt(item.late) !== 0) {
        total.late = total.late + 1;
      }
      if(item.annual && parseInt(item.annual) !== 0) {
        total.annual = total.annual + 1;
      }
      if(item.half && parseInt(item.half) !== 0) {
        total.half = total.half + 1;
      }
      if(item.etc && parseInt(item.etc) !== 0) {
        total.etc = total.etc + 1;
      }
      if(item.attendance && parseInt(item.attendance) !== 0) {
        total.attendance = total.attendance + 1;
      }
      if(item.overTime) {
        total.overTime = total.overTime + getTimeQuantityHM(item.overTime);
      }
    }
    props.funcUpdateDiligence(
      total.late * 0.25 +
      total.half * 0.5 +
      total.annual
      ////////////////////////etc★
      ////////////////////////attendance★
    );
    setTotal(total);
  }
  
  return (
    <tr 
      key={'last'}
    >
      <td></td>
      <td></td>
      <td></td>
      <td>合&nbsp;計</td>
      <td>
        <input 
          type='text' 
          value={ numToStringHM(Total.breakTime) }
          disabled
        />
      </td>
      <td>
        <input 
          type='text' 
          value={ numToStringHM(Total.workTime) }
          disabled
        />
      </td>
      <td>
        <input 
          type='number' 
          value={Total.late}
          disabled
        />
      </td>
      <td>
        <input 
          type='number' 
          value={Total.annual}
          disabled
        />
      </td>
      <td>
        <input 
          type='number' 
          value={Total.half}
          disabled
        />
      </td>
      <td>
        <input 
          type='number' 
          value={Total.etc}
          disabled
        />
      </td>
      <td>
        <input 
          type='number' 
          value={Total.attendance}
          disabled
        />
      </td>
      <td></td>
      <td></td>
      <td>
        <input 
          type='text' 
          value={ numToStringHM(Total.breakTime) }
          disabled
        />
      </td>
      <td>
        <input 
          type='text' 
          value={ numToStringHM(Total.overTime) }
          disabled
        />
      </td>
    </tr>
  )
}

export default memo(BodyTotal);

