import React, { useEffect, useState, memo } from 'react';
import axios from 'axios';
import style from './List.module.scss';
import {
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import {
  Modal
} from 'antd';
import Header from './Sections/Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchEmployeeList,
  setEmployee
} from '../../../../../_actions/admin_action';
import { role } from '../../../../commons/Constants/Admin/User';

function List(props) {
  const dispatch = useDispatch();
  const EmployeeList = useSelector(state => state.admin.employeeList);
  const [TotalPage, setTotalPage] = useState(0);
  const [CurrentPage, setCurrentPage] = useState(1);
  
  const count = 12;

  useEffect(() => {
    if(!EmployeeList) {
      getEmployeeList();
    }
  });

  useEffect(() => {
    if(EmployeeList) {
      setTotalPage(Math.floor(EmployeeList.length / count) + 1);
    } else {
      setTotalPage(0);
    }
  }, [EmployeeList]);

  const getEmployeeList = () => {
    dispatch(fetchEmployeeList());
  };

  const pageHandler = (toPage) => {
    const pageInt = parseInt(toPage);
    if(pageInt >= 1 && pageInt <= TotalPage) {
      setCurrentPage(pageInt);
    }
  }

  const clickEmployeeHandler = (id) => {
    var existFlag = false;
    EmployeeList.forEach((employee, index) => {
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
  
  const renderEmployeeList = EmployeeList && EmployeeList.map((employee, index) => {
    if(count*(CurrentPage - 1) > index || index >= count*CurrentPage) return null;

    return (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{employee.manager && employee.manager.name}</td>
        <td 
          onClick={() => clickEmployeeHandler(employee._id)}
        >
          {employee.employeeNo}
        </td>
        <td>{employee.name}</td>
        <td>{employee.email}</td>
        <td>{role[employee.role]}</td>
      </tr>
    )
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
              <th>No</th>
              <th>Manager</th>
              <th>EmployeeNo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            { renderEmployeeList }
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
