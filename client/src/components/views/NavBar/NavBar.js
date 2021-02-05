/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import style from './NavBar.module.scss';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logoImg from '../../../assets/images/kissco-logo.PNG';
import { logoutUser } from '../../../_actions/user_action';
import { Button } from 'antd';

function NavBar(props) {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logoutUser()).then(res => {
      if(res.payload.success) {
        props.history.push("/login");
      } else {
        alert("fail to logout");
      }
    });
  }

  return (
    <div className={style['nav']}>
      <Link to='/'>
      </Link>
      {user.userData && user.userData.isAuth
        &&
        <div className={style['nav-user']}>
          <div className={style['nav-user-name']}>
            {user.userData.name} 様
          </div>
          <Button
            shape='round'
            onClick={logoutHandler}
            className={style['nav-user-logout']}
          >
            logout
          </Button>
        </div>
      }
    </div>
  )
}

export default withRouter(NavBar)
