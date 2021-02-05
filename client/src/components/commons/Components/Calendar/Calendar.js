/* eslint-disable no-loop-func */
import React, { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import style from './Calendar.module.scss';
import  { setEmployeeWorksheetYear, setEmployeeWorksheetMonth } from '../../../../_actions/common_action';

function Calendar(props) {
  let date = new Date();
  const thisYear = date.getFullYear();
  const dispatch = useDispatch();
  let years = [];
  for(var i=0; i<2; i++) {
    years.push(thisYear - i);
  }
  const months = [
    'Jan','Feb','Mar',
    'Apr','May','Jun',
    'Jul','Aug','Sep',
    'Oct','Nov','Dec',
  ];

  const SelectedYear = useSelector(state => state.common.employeeWorksheetYear);
  const SelectedMonth = useSelector(state => state.common.employeeWorksheetMonth);

  const handleChangeYear = (e) => {
    dispatch(setEmployeeWorksheetYear(e.target.value));
  }

  const handleChangeMonth = (month) => {
    dispatch(setEmployeeWorksheetMonth(month));
  }

  const renderOptions = () => years.map(year =>
    <option
      value={year} 
      key={year} 
    >
      {year}
    </option>
  );

  const monthList = [];
  for(var i=0; i<4; i++) {
    const i0 = 3*i;
    const i1 = 3*i + 1;
    const i2 = 3*i + 2;
    const nth_td = (nth) => (
      <td 
        key={nth}
        className={style.td}
        onClick={() => handleChangeMonth(nth)}
      >
        <span className={nth === SelectedMonth ? style.selected : ''}>
          {months[nth]}
        </span>
      </td>
    );
    monthList.push(
      <tr className={style.tr} key={i}>
        {
          [nth_td(i0), nth_td(i1), nth_td(i2)]
        }
      </tr>
    );
  }

  return (
    <div>
      <div className={props.month ? style.calendar : style.simple}>
        <div className={style.header}>
          <select 
            className={style.year}
            value={SelectedYear}
            onChange={handleChangeYear}
          >
            { renderOptions() }
          </select>
        </div>
        { props.month &&
          <div className={style.panel}>
            <table className={style.table}>
              <tbody>
                { monthList }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  )
}

export default memo(Calendar);
