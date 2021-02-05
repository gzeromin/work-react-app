import React, { memo } from 'react';
import style from '../../List.module.scss';
import {
  Space,
  Input
} from 'antd';
const { Search } = Input;

function Header() {

  const onSearch = value => console.log(value);

  
  return (
    <div className={style.header}>
      <Space size={8}>
        <Search
          className={style.search}
          placeholder="input search text"
          onSearch={onSearch}
        />
      </Space>
    </div>
  )
}

export default memo(Header);
