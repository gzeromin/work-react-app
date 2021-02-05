import React from 'react'
import style from './Footer.module.scss';

function Footer() {
  return (
    <div className={style['my-footer']}>
      <div className={style['my-footer-text']}>　</div>
      <div className={style['my-footer-copyright']}>
        <p>Copyright All rights reserved.	</p>
      </div>
    </div>
  )
}

export default Footer