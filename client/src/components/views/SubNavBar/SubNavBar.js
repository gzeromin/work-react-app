import React, { memo } from 'react'
import style from './SubNavBar.module.scss';
import { Link, withRouter } from 'react-router-dom';
import { Tree, Switch } from 'antd';

import { employee, admin } from './Sections/Constants';
import { useSelector } from 'react-redux';

function SubNavBar(props) {
  const user = useSelector(state => state.user);
  const onSelect = (selectedKeys, info) => {
    if (!info.node.children) {
      selectedKeys.length > 0 && props.history.push(selectedKeys[0]);
    }
  };

  var treeData = employee;
  const expandedKeys = ['/employee/workSheet'];
  if(user.userData && user.userData.isAdmin) {
    treeData = employee.concat(admin);
    expandedKeys.push('/admin/employee');
    expandedKeys.push('/admin/workSheet');
  }

  return (
    <div className={style.subNavBar}>
      <Tree
        showLine={true}
        defaultExpandedKeys={expandedKeys}
        onSelect={onSelect}
        treeData={treeData}
        selectedKeys={[props.location.pathname]}
      />
    </div>
  )
}

export default withRouter(memo(SubNavBar));
