import React, { useState } from 'react';
import style from './ForgetPasswordPage.module.scss';
import { Row, Col, Button } from 'antd';
import { Link } from 'react-router-dom';


function ForgetPasswordPage() {

  const [Email, setEmail] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault(); // prevent page refresh
    let body = {
      email: Email
    }
  
  }

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  }

  return (
    <form 
      className={style['forgetPassword']}
      onSubmit={onSubmitHandler}
    >
      <Row gutter={[16,16]}>
        <Col span={4}>
          <label>Email</label>
        </Col>
        <Col span={20}>
          <input
            className={style['forgetPassword-input']}
            type="email" 
            value={Email} 
            onChange={onEmailHandler} 
          />
        </Col>

      </Row>
      <br/>
      <Row gutter={[16,16]} justify='end'>
        <Col>
          <Button 
            type="primary"
            style={{ width: '9rem'}}
            onClick={onSubmitHandler}
          >
            Send
          </Button>
        </Col>
        <Col>
          <Link
            className={style['forgetPassword-button']}
            to="/login"
          >
            back...
          </Link>
        </Col>
      </Row>
      <br/>
      <br />
    </form>
  )
}

export default ForgetPasswordPage;
