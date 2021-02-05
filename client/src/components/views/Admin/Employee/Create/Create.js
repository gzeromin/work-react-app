import React, { memo } from 'react';
import {
  Form,
  Input,
  Button,
  Modal
} from 'antd';
import style from './Create.module.scss';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '../../../../../_actions/common_action';
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

function Create(props) {

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onFinish = (values) => {
    dispatch(setIsLoading(true));
    console.log('Received values of form: ', values);
    axios.post('/api/user/create', values)
      .then(res => {
        dispatch(setIsLoading(false));
        if(res.data.success) {
          Modal.success({
            content: '登録されました。',
          });
          setTimeout(() => {
            props.history.push('/admin/employee/list');
          }, 3000);
        } else {
          console.log(res.data.err);
          Modal.error({
            title: '登録失敗',
            content: '管理者に問い合わせしてください。',
          });
        }
      });
  };

  return (
    <div className={style.wrapper}>
      <div className={style.title}>
        <h1>社員登録</h1>
      </div>
      <Form
        {...formItemLayout}
        form={form}
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
          rules={[{ required: true, message: '社員番号を入力してください。' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="name"
          label="氏  名"
          rules={[{ required: true, message: '氏名を入力してください。' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="hurigana"
          label="ﾌﾘｶﾞﾅ"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="ﾒｰﾙｱﾄﾞﾚｽ"
          rules={[
            {
              type: 'email',
              message: 'E-mail!形式ではありません。',
            },
            {
              required: true,
              message: 'E-mailを入力してください。',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            SAVE
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default memo(Create);
