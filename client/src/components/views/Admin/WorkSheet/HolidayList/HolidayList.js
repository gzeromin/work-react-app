import React, { useEffect, useState, memo } from 'react';
import axios from 'axios';
import style from './HolidayList.module.scss';
import {
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import {
  Modal
} from 'antd';
import Header from './Sections/Header/Header';
import Body from './Sections/Body/Body';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchPaidHolidayList,
  setEmployee
} from '../../../../../_actions/admin_action';
import { role } from '../../../../commons/Constants/Admin/User';
import { setEmployeeWorksheetYear } from '../../../../../_actions/common_action';

function List(props) {
  const SelectedYear = useSelector(state => state.common.employeeWorksheetYear);
  const dispatch = useDispatch();
  const PaidHolidayList = useSelector(state => state.admin.paidHolidayList);
  const [TotalPage, setTotalPage] = useState(0);
  const [CurrentPage, setCurrentPage] = useState(1);
  
  const count = 12;

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
    getPaidHolidayList(SelectedYear);
  }, [SelectedYear]);

  useEffect(() => {
    if(PaidHolidayList) {
      setTotalPage(Math.floor(PaidHolidayList.length / count) + 1);
    } else {
      setTotalPage(0);
    }
  }, [PaidHolidayList]);
  //localStorage.getItem('userId')

  const getPaidHolidayList = () => {
    dispatch(fetchPaidHolidayList(SelectedYear));
  };

  const pageHandler = (toPage) => {
    const pageInt = parseInt(toPage);
    if(pageInt >= 1 && pageInt <= TotalPage) {
      setCurrentPage(pageInt);
    }
  }

  const clickEmployeeHandler = (id) => {
    var existFlag = false;
    PaidHolidayList.forEach((employee, index) => {
      if(!existFlag && employee._id === id) {
        existFlag = true;
        dispatch(setEmployee(employee));
      }
    });

    if(!existFlag) {
      Modal.error({
        title: 'エラー',
        content: '存在しない社員です。'
      });
    } else {
      props.history.push('/admin/employee/home');
    }
  };
  
  const renderPaidHolidayList = PaidHolidayList && PaidHolidayList.map((paidHoliday, index) => {
    if(count*(CurrentPage - 1) > index || index >= count*CurrentPage) return null;
    let totalDiligence = 0;
    [...Array(12).keys()].map(i => {
      if(paidHoliday[i] && paidHoliday[i].diligence) {
        totalDiligence = totalDiligence + paidHoliday[i].diligence;
      }
    });
    paidHoliday.totalDiligence = totalDiligence;
    return <Body
      {...props}
      key={index}
      item={paidHoliday}
    />
  });

  const renderPage = [];
  for(var i=1; i <= TotalPage; i++) {
    renderPage.push(
      <li 
        key={`page${i}`}
        onClick={(e) => pageHandler(e.target.outerText)}
        className={CurrentPage === i ? style.currentPage : ''}
      >
        {i}
      </li>
    );
  }
  return (
    <div className={style.wrapper}>
      <Header />
      <div className={style.list}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>{SelectedYear}年度<br/>付与有休</th>
              <th>{SelectedYear-1}年<br/>残有休</th>
              {
                [...Array(12).keys()].map(i => 
                  <th 
                    key={`th-${i}`}
                  >
                    {i + 1}月
                  </th>
                )
              }
              <th>{SelectedYear}年有休残<br/>使用可能日数</th>
              <th>{SelectedYear}年有休使用後<br/>繰越からの可能日数</th>
            </tr>
          </thead>
          <tbody>
            { renderPaidHolidayList }
          </tbody>
        </table>
      </div>
      <ul className={style.pageNav}>
        <li 
          key='left'
          onClick={(e) => pageHandler(CurrentPage - 1)}
        >
          <LeftOutlined />
        </li>

          { renderPage }

        <li 
          key='right'
          onClick={(e) => pageHandler(CurrentPage + 1)}
        >
          <RightOutlined />
        </li>
      </ul>
    </div>
  )
}

export default memo(List);
