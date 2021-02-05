import React, { memo } from 'react';
import style from '../../HolidayList.module.scss';
import {
  Space,
  Input,
  Button
} from 'antd';
import Calendar from '../../../../../../commons/Components/Calendar/Calendar';

const { Search } = Input;

function Header() {

  const onSearch = value => console.log(value);

  
  return (
    <div className={style.header}>
      <Space size={8}>
        <Calendar />
        <Search
          className={style.search}
          placeholder="input search text"
          onSearch={onSearch}
        />
        <Button
          type='primary'
          shape='round'
        >
          自動生成ツール
        </Button>
      </Space>
    </div>
  )
}

export default memo(Header);
