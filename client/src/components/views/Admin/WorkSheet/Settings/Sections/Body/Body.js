import React, { memo, useEffect, useState } from 'react';
import { 
  MinusCircleOutlined, 
  PlusCircleOutlined, 
  EditOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined
} from '@ant-design/icons';
import style from '../../Settings.module.scss';
import { Modal } from 'antd';
import {

} from '@ant-design/icons';
import axios from 'axios';

function Body(props) {

  const [RestDay, setRestDay] = useState({});

  useEffect(() => {
    setRestDay(props.restDay);
  }, [props.restDay]);

  const inputHandler = (target, value) => {
    const newRestDay = {...RestDay};
    newRestDay[target] = value;
    setRestDay(newRestDay);
  };

  const addHandler = () => {
    props.funcAdd(props.index);
  }

  const removeHandler = () => {
    if(RestDay._id) {
      Modal.confirm({
        title: '確認',
        icon: <ExclamationCircleOutlined />,
        content: '削除しますか？',
        okText: '削除',
        cancelText: '取消',
        onOk: () => props.funcRemove(props.index),
        onCancel: () => {}
      });
    } else {
      props.funcRemove(props.index);
    }
  }

  const editHandler = () => {
    const newRestDay = {...RestDay};
    newRestDay['mode'] = 'update';
    setRestDay(newRestDay);
  }

  const onSubmitHandler = () => {
    if(RestDay._id) {
      axios.post('/api/restDay/update', RestDay).then(res => {
        if(res.data.success) {
          setRestDay(res.data.result);
          Modal.success({
            content: '成功的に変更されました。',
          });
        } else {
          Modal.error({
            title: '保存失敗',
            content: res.data.err,
          });
        }
      });
    } else {
      axios.post('/api/restDay/save', RestDay).then(res => {
        if(res.data.success) {
          Modal.success({
            content: '成功的に保存されました。',
          });
          props.funcUpdateList(true);
        } else {
          Modal.error({
            title: '保存失敗',
            content: res.data.err,
          });
        }
      });
    }
  }

  if(!RestDay.mode) {
    return (
      <tr className={style.tr}>
        <td className={style.td}>{ RestDay.kubun }</td>
        <td className={style.td}>{ RestDay.month }</td>
        <td className={style.td}>{ RestDay.day }</td>
        <td className={style.td}>{ RestDay.n_th }</td>
        <td className={style.td}>{ RestDay.day_of_the_week }</td>
        <td className={style.td}>{ RestDay.biko }</td>
        <td className={style['td-btn']}>
          <PlusCircleOutlined 
            onClick={addHandler} 
          />
        </td>
        <td className={style['td-btn']}>
          <MinusCircleOutlined 
            onClick={removeHandler} 
          />
        </td>
        <td className={style['td-btn']}>
          <EditOutlined
            onClick={editHandler} 
          />
        </td>
      </tr>
    );
  }
  return (
    <tr className={style.tr}>
      <td className={style.td}>
        <input 
          className={style.input}
          type='number' 
          value={ RestDay.kubun }
          onChange={ (e) => inputHandler('kubun', e.target.value) }
        />
      </td>
      <td className={style.td}>
        <input 
          className={style.input}
          type='number' 
          value={ RestDay.month }
          onChange={ (e) => inputHandler('month', e.target.value) }
        />
      </td>
      <td className={style.td}>
        <input 
          className={style.input}
          type='number' 
          value={ RestDay.day }
          onChange={ (e) => inputHandler('day', e.target.value) }
        />
      </td>
      <td className={style.td}>
        <input 
          className={style.input}
          type='number' 
          value={ RestDay.n_th }
          onChange={ (e) => inputHandler('n_th', e.target.value) }
        />
      </td>
      <td className={style.td}>
        <input 
          className={style.input}
          type='number' 
          value={ RestDay.day_of_the_week }
          onChange={ (e) => inputHandler('day_of_the_week', e.target.value) }
        />
      </td>
      <td className={style.td}>
        <input 
          type='text' 
          value={ RestDay.biko }
          style={{ border: '1px solid lightgrey' }}
          onChange={ (e) => inputHandler('biko', e.target.value) }
        />
      </td>
      <td className={style['td-btn']}>
        <PlusCircleOutlined 
          onClick={addHandler} 
        />
      </td>
      <td className={style['td-btn']}>
        <MinusCircleOutlined 
          onClick={removeHandler} 
        />
      </td>
      <td className={style['td-btn']}>
        <CheckCircleOutlined 
          style={{color: 'black'}}
          onClick={onSubmitHandler}
        />
      </td>
    </tr>
  );
}

export default memo(Body);
