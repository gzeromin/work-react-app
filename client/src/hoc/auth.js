import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

export default function (SpecificComponent, option, adminRoute = null) {

  /**
   * option:
   *  null => anyone
   *  true => login user
   *  false => not login user
   * 
   * adminRoute:
   *  true => admin user
   */

  function AuthenticationCheck(props) {
    const dispatch = useDispatch();

    useEffect(() => {
    
      dispatch(auth()).then(res => {
        if(!res.payload.isAuth) {
          // not login
          if(option) {
            props.history.push("/login");
          }
        } else {
          // login
          if(adminRoute && !res.payload.isAdmin) {
            props.history.push("/");
          } else {
            if(!option) {
              props.history.push("/");
            }
          }
        }
      });
    
    }, [dispatch, props.history]);

    return (
      <SpecificComponent {...props}/>
    )
  }


  return AuthenticationCheck;
}