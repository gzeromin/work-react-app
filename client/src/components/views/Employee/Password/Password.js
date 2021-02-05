import React, { memo } from 'react';
import {
  Form,
  Input,
  Button,
  Modal
} from 'antd';
import style from './Password.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setIsLoading } from '../../../../_actions/common_action';
import axios from 'axios';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function Settings(props) {

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const user = useSelector(state => state.user);

  const fields = [];
  if(user && user.userData) {
    for(var key in user.userData) {
      if(key !== 'password') {
        fields.push(
          {
            "name": [
              key
            ],
            "value": user.userData[key]
          }
        );
      }
    }
  }
  

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

  return (
    <div className={style.wrapper}>
      <div className={style.title}>
        <h1>社員情報</h1>
      </div>
      <Form
        {...formItemLayout}
        form={form}
        fields={fields}
        name="register"
        onFinish={onFinish}
        initialValues={{
          residence: ['zhejiang', 'hangzhou', 'xihu'],
          prefix: '86',
        }}
        scrollToFirstError
        className={style.form}
      >
        <Form.Item
          name="employeeNo"
          label="社員番号"
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="name"
          label="氏  名"
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="hurigana"
          label="ﾌﾘｶﾞﾅ"
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="email"
          label="ﾒｰﾙｱﾄﾞﾚｽ"
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('The two passwords that you entered do not match!');
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Modify
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default memo(Settings);
