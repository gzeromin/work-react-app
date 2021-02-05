import React, { useEffect, useState } from 'react';
import style from './Collapse.module.scss';

function Collapse(props) {
  const [Open, setOpen] = useState(false);

  useEffect(() => {
    if(props.open) {
      setOpen(props.open);
    }
  }, []);

  return (
    <div className={style.wrapper}>
      <div
        className={`${style.header} ${Open ? style['header-open'] : style['header-closed']}`}
        onClick={() => setOpen(!Open)}
      >
        {props.header}
      </div>
      {Open &&
        <div
          className={style.contents}
        >
          {props.contents}
        </div>
      }
    </div>
  )
}

export default Collapse;
