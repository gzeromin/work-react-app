/* eslint-disable default-case */
import React, { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import style from '../../WorkSheet.module.scss';

import { restTime } from '../../../../../commons/Constants/Admin/WorkSheetSettings';
import { diligence, workSheetDay } from '../../../../../commons/Constants/Employee/WorkSheet';

import { stringToDate, numToString } from '../../../../../../utils/timeUtils';

const WEEKDAYS = ['日','月','火','水','木','金','土'];

function Body(props) {
  const [Item, setItem] = useState(workSheetDay);

  const SelectedYear = useSelector(state => state.common.employeeWorksheetYear);
  const SelectedMonth = useSelector(state => state.common.employeeWorksheetMonth);

  const day = new Date(SelectedYear, SelectedMonth, props.index);
  const holiday = (day.getDay() === 0 || day.getDay() === 6) ||
    (props.restDays.indexOf(day.getDate()) !== -1);
  const attendanceTime = new Date(0, 0, 0, 9, 0, 0);
  const leaveTime = new Date(0, 0, 0, 18, 0, 0);
  const unit = restTime.interval * 60 * 1000;
  
  useEffect(() => {
    setItem(calculator(props.item));
  }, [props.item]);
  
  const getBreakTime = ({lunchTime, dinnerTime, midNight1Time, midNight2Time}) => {
    return lunchTime + dinnerTime + midNight1Time + midNight2Time;
  };

  const getOverTime = (endTime, breakTime) => {
    if(endTime > leaveTime) {
      return Math.floor(endTime.getTime()/unit) * unit - leaveTime.getTime() - breakTime;
    }
    return null;
  };

  const calculator = (obj) => {
    const endTime = stringToDate(obj.endTime);
    const startTime = stringToDate(obj.startTime);

    var endTime_corrected = null;
    if(endTime) {
      if(endTime.getTime() - attendanceTime.getTime() > 0) {
        endTime_corrected = endTime;
      } else {
        endTime.setHours(endTime.getHours() + 24);
        endTime_corrected = endTime;
      }
    }

    var totalTime = null;
    if(endTime_corrected && startTime) {
      totalTime = (Math.floor(endTime_corrected.getTime()/unit) - Math.ceil(startTime.getTime()/unit)) * unit;
      obj.totalTime = numToString(totalTime);
    }

    const getTime = (type) => {
      const dateEnd = stringToDate(restTime[type][1]);
      const dateStart = stringToDate(restTime[type][0]);
      if(startTime < dateEnd && endTime_corrected > dateStart) {
        var end = null;
        var start = null;
        if(endTime_corrected > dateEnd) {
          end = dateEnd.getTime();
        } else {
          end = Math.floor(endTime_corrected.getTime()/unit) * unit;
        }

        if(startTime < dateStart) {
          start = dateStart.getTime();
        } else {
          start = Math.ceil(startTime.getTime() / unit) * unit;
        }

        return end - start;
      }
      return null;
    };
    if(totalTime) {
      const lunchTime = getTime('lunch');
      const dinnerTime = getTime('dinner');
      const midNight1Time = getTime('midNight1');
      const midNight2Time = getTime('midNight2');
      const overTime = getOverTime(
        endTime_corrected,
        getBreakTime({
          lunchTime: 0, 
          dinnerTime, 
          midNight1Time,
          midNight2Time
        })
      );
      const breakTime = getBreakTime({ 
        lunchTime, 
        dinnerTime, 
        midNight1Time,
        midNight2Time
      });
      obj.lunchTime = numToString(lunchTime);
      obj.dinnerTime = numToString(dinnerTime);
      obj.midNight1Time = numToString(midNight1Time);
      obj.midNight2Time = numToString(midNight2Time);
      obj.workTime = numToString(totalTime - breakTime)
      obj.overTime = numToString(overTime);
      obj.breakTime = numToString(breakTime);
    } else {
      obj.lunchTime = numToString(0);
      obj.dinnerTime = numToString(0);
      obj.midNight1Time = numToString(0);
      obj.midNight2Time = numToString(0);
      obj.workTime = numToString(0)
      obj.overTime = numToString(0);
      obj.breakTime = numToString(0);
    }

    return obj;
  }

  const inputHandler = (target, value) => {
    const newItem = {...Item};
    switch(target) {
      case 'startTime':
      case 'endTime':
        if(newItem[target]) {
          const invertNum = getLastNum(newItem[target]);
          if(invertNum) {
            value = value.slice(0,3)+invertNum+value.slice(4,5);
          }
        }
        break;
    }
    newItem[target] = value;
    const calculatedItem = calculator(newItem);
    props.funcUpdateWorkSheet(props.index, calculatedItem);
  };

  const getLastNum = (timeStr) => {
    const timeArr = timeStr.split(':');
    return timeArr && timeArr[1] && timeArr[1].slice(-1);
  }

  console.log('rendered');
  const renderSelect = (type) => {
    let options = [];
    Object.keys(diligence[type]).map(keyStr => {
      options.push(
        <option
          key={`${type}-${keyStr}`}
          value={keyStr}
        >
          { diligence[type][keyStr] }
        </option>
      );
    });
    return (
      <select 
        value={Item[type] ? Item[type] : ''}
        onChange={(e) => inputHandler(type, e.target.value)}
      >
        <option value={0}></option>
        { options }
      </select>
    );
  }

  if(props.modify) {
    return (
      <tr>
        <td className={holiday ? style.holiday : ''}>
        { day.getDate() }
        </td>
        <td className={holiday ? style.holiday : ''}>
          { WEEKDAYS[ day.getDay() ] }
        </td>
        <td className={holiday ? style.holiday : ''}>
          <input 
            type='time' 
            value={Item.startTime} onChange={(e) => inputHandler('startTime', e.target.value)}
          />
        </td>
        <td className={holiday ? style.holiday : ''}>
          <input 
            type='time' 
            value={Item.endTime} onChange={(e) => inputHandler('endTime', e.target.value)} 
          />
        </td>
        <td className={holiday ? style.holiday : ''}>
          { Item.totalTime && 
            <input type='text' value={ Item.breakTime } disabled />
          }
        </td>
        <td>
          { Item.totalTime && 
            <input type='text' value={ Item.workTime } disabled />
          }
        </td>
        <td className={holiday ? style.holiday : ''}>
          { renderSelect('late') }
        </td>
        <td className={holiday ? style.holiday : ''}>
          { renderSelect('annual') }
        </td>
        <td className={holiday ? style.holiday : ''}>
          { renderSelect('half') }
        </td>
        <td className={holiday ? style.holiday : ''}>
          { renderSelect('etc') }
        </td>
        <td className={holiday ? style.holiday : ''}>
          { renderSelect('attendance') }
        </td>
        <td>
          <input type='text' value={Item.biko} onChange={(e) => inputHandler('biko', e.target.value)} />
        </td>
        <td>

        </td>
        <td>
          { Item.totalTime && 
            <input type='text' value={ Item.breakTime } disabled />
          }
        </td>
        <td>
        { Item.totalTime && 
            <input type='text' value={ Item.overTime } disabled />
          }
        </td>
      </tr>
    );
  }
  return (
    <tr>
      <td className={holiday ? style.holiday : ''}>{ day.getDate() }</td>
      <td className={holiday ? style.holiday : ''}>{ WEEKDAYS[ day.getDay() ] }</td>
      <td className={holiday ? style.holiday : ''}>{ Item.startTime }</td>
      <td className={holiday ? style.holiday : ''}>{ Item.endTime }</td>
      <td className={holiday ? style.holiday : ''}>{}</td>
      <td>{}</td>
      <td className={holiday ? style.holiday : ''}>{ diligence.late[Item.late] }</td>
      <td className={holiday ? style.holiday : ''}>{ diligence.annual[Item.annual] }</td>
      <td className={holiday ? style.holiday : ''}>{ diligence.half[Item.half] }</td>
      <td className={holiday ? style.holiday : ''}>{ diligence.etc[Item.etc] }</td>
      <td className={holiday ? style.holiday : ''}>{ diligence.attendance[Item.attendance] }</td>
      <td>{ Item.biko }</td>
      <td></td>
      <td>{ Item.breakTime }</td>
      <td>{ Item.overTime }</td>
    </tr>
  )
}

export default memo(Body);
