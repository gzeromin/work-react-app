import React, { memo, useEffect, useState } from 'react';
import {
  Row,
  Col,
  Button,
  Modal
} from 'antd';
import style from './Default.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setIsLoading } from '../../../../../_actions/common_action';
import { role } from '../../../../commons/Constants/Admin/User';
import axios from 'axios';
import { fetchEmployeeList } from '../../../../../_actions/admin_action';

const formTemplate = {
  employeeNo: 'input',
  name: 'input',
  hurigana: 'input',
  email: 'input',
  role: 'select',
  manager: 'select'
}

const label = {
  employeeNo: '社員番号',
  name: '氏  名',
  hurigana: 'ﾌﾘｶﾞﾅ',
  email: 'ﾒｰﾙｱﾄﾞﾚｽ',
  role: 'ロール',
  manager: 'チーム長'
}

function Default(props) {
  const dispatch = useDispatch();

  const employee = useSelector(state => state.admin.employee);
  const ManagerList = useSelector(state => state.admin.managerList);

  const [Employee, setEmployee] = useState(label);
  
  useEffect(() => {
    if(employee) {
      setEmployee(employee);
    }
  }, [employee]);

  const onFinish = (values) => {
    dispatch(setIsLoading(true));
    console.log('Received values of form: ', values);
    // axios.post('/api/user/create', values)
    //   .then(res => {
    //     dispatch(setIsLoading(false));

    //     if(res.data.success) {
    //       Modal.success({
    //         content: '登録されました。',
    //       });
    //       setTimeout(() => {
    //         props.history.push('/admin/employee/list');
    //       }, 3000);
    //     } else {
    //       console.log(res.data.err);
    //       Modal.error({
    //         title: '登録失敗',
    //         content: '管理者に問い合わせしてください。',
    //       });
    //     }
    //   });
  };

  const modifyEmployee = () => {
    if(!Employee) return;
    axios.post('/api/user/updateEmployee', Employee).then(res => {
      if(res.data.success) {
        Modal.success({
          content: '更新しなした。',
        });
        dispatch(fetchEmployeeList());
      } else {
        console.log(res.data.err);
        Modal.error({
          title: '更新失敗',
          content: '管理者に問い合わせしてください。',
        });
      }
    })
  }

  const inputHandler = (target, value) => {
    const newEmployee = {...Employee};
    newEmployee[target] = value;
    setEmployee(newEmployee);
  }

  const renderRoleList = () => Object.keys(role).map(key => 
    <option 
      key={`role-${key}`}
      value={key}
    >
      { role[key] }
    </option>
  );

  const renderManagerList = () => ManagerList && ManagerList.map((manager, index) => 
    <option
      key={`manager-${index}`}
      value={manager._id}
    >
      {manager.name}
    </option>
  );

  const renderForm = () => Object.keys(formTemplate).map(key => {
    let renderInput = null;
    if (formTemplate[key] === 'input') {
      renderInput = (
        <input 
          value={Employee && Employee[key]}
          onChange={(e) => inputHandler(key, e.target.value)}
        />
      )
    } else if(formTemplate[key] === 'select') {
      let listFunc = null;
      switch(key) {
        case 'role':
          listFunc = renderRoleList;
          break;
        case 'manager':
          listFunc = renderManagerList;
          break;
        default:
          ///
          listFunc = renderRoleList;
          break;
      }
      renderInput = (
        <select
          value={Employee && Employee[key]}
          onChange={(e) => inputHandler(key, e.target.value)}
        >
          { listFunc() }
        </select>
      )
    }

    return (
      <Row key={`formTemplate-${key}`} gutter={[8,24]}>
        <Col 
          span={6}
          className={style.label}
        >
          { label[key] }：
        </Col>
        <Col
          xs={24}
          sm={18}
        >        
          { renderInput }
        </Col>
      </Row>
    )
  })

  const goBack = () => {
    props.history.goBack();
  }
  return (
    <div className={style.wrapper}>
      <div className={style.title}>
        <h1>{employee && employee.name}様</h1>
      </div>
      <div className={style.form}>
        { renderForm() }
        <Row
          justify='center'
        >
          <Button 
            style={{ marginLeft: '.8rem'}}
            type="primary" 
            onClick={modifyEmployee}
          >
            Modify
          </Button>
          <Button
            style={{ marginLeft: '.8rem'}}
            type="primary" 
            danger
            htmlType="button"
          >
            Delete
          </Button>
          <Button
            style={{ marginLeft: '.8rem'}}
            onClick={goBack}
            htmlType="button"
          >
            Cancel
          </Button>
        </Row>
      </div>
    </div>
  )
}

export default memo(Default);
