import React, { useState, memo } from 'react'
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';
import { setIsLoading } from '../../../_actions/common_action';
import { withRouter } from 'react-router-dom';
import { Row, Col, Button } from 'antd';
import style from './LoginPage.module.scss';
import axios from 'axios';
import {
  Modal
} from 'antd';

function LoginPage(props) {
  const dispatch = useDispatch();

  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault(); // prevent page refresh
    dispatch(setIsLoading(true));
    if(Email === 'create@new.email') {
      const values = {
        employeeNo: 0,
        name: 'aaa',
        hurigana: 'aaa',
        email: 'aaa@aaa.aaa',
        role: 2
      };
      axios.post('/api/user/create', values)
      .then(res => {
        dispatch(setIsLoading(false));
        if(res.data.success) {
          Modal.success({
            content: 'email: aaa@aaa.aaa, pw: aaa',
          });
        } else {
          console.log(res.data.err);
          Modal.error({
            title: '登録失敗',
            content: '管理者に問い合わせしてください。',
          });
        }
      });
    } else  {
      let body = {
        email: Email,
        password: Password
      }
  
      dispatch(loginUser(body))
        .then(res => {
          dispatch(setIsLoading(false));
  
          if(res.payload.success) {
            window.localStorage.setItem('userId', res.payload.data._id);
            props.history.push('/');
          } else {
            alert(res.payload.message);
          }
        });
    }
  }

  return (
    <form 
      className={style['login']}
      onSubmit={onSubmitHandler}
    >
      <Row gutter={[16,16]}>
        <Col span={8}>
          <label>Email</label>
        </Col>
        <Col span={16}>
          <input
            className={style['login-input']}
            type="email" 
            value={Email} 
            onChange={onEmailHandler} 
          />
        </Col>

      </Row>
      <Row gutter={[16,16]}>
        <Col span={8}>
          <label>Password</label>
        </Col>
        <Col span={16}>
          <input 
            className={style['login-input']}
            type="password" 
            value={Password} 
            onChange={onPasswordHandler} 
          />
        </Col>
      </Row>
      <br/>
      <Row gutter={[16,16]} justify='end'>
        <Col>
          <Button 
            type="submit"
            onClick={onSubmitHandler}
          >
            Login
          </Button>
        </Col>
        <Col>
          <Link
            className={style['login-button']}
            to="/forgetPassword"
          >
            forget password...
          </Link>
        </Col>
      </Row>
      <br/>
      create account cheat key: create@new.account
      <br />
    </form>
  )
}

export default withRouter(memo(LoginPage));
