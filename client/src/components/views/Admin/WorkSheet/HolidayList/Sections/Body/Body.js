import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setEmployeeWorksheetMonth } from '../../../../../../../_actions/common_action';
import style from '../../HolidayList.module.scss';
import { Tag } from 'antd';

function Body(props) {
  const [Item, setItem] = useState(props.item);
  const dispatch = useDispatch();
  
  useEffect(() => {
    setItem(props.item);
  }, [props.item]);

  const inputHandler = (target, value) => {
    const newItem = {...Item};
    newItem[target] = value;
    setItem(newItem);
  };

  const goEmployeeWorkSheet = (i) => {
    dispatch(setEmployeeWorksheetMonth(i));
    props.history.push(`/employee/workSheet?id=${Item.userId._id}`);
  }
  return (
    <tr>
      <td>{Item.userId && Item.userId.name}</td>
      <td>
        <input 
          type='number'
          value={Item.thisYearTotal}
          onChange={(e) => inputHandler('thisYearTotal', e.target.value)}
        />
      </td>
      <td>
        <input 
          type='number'
          value={Item.lastYearRemaining}
          onChange={(e) => inputHandler('lastYearRemaining', e.target.value)}
        />
      </td>
      {
        [...Array(12).keys()].map(i => 
          <td
            key={`td-${i}`}
            className={style.month}
            onClick={() => goEmployeeWorkSheet(i)}
          >
            <div className={style.diligence}>
              <div className={style.num}>
                { Item[i] &&
                  Item[i].diligence
                }
              </div>
              <div className={style.tag}>
                { Item[i] && Item[i].submit &&
                  <Tag size='small' color="green">本人</Tag>
                }
                { Item[i] && Item[i].approval &&
                  <Tag color="magenta">承認</Tag>
                }
                { Item[i] && Item[i].confirm &&
                  <Tag color="purple">確認</Tag>
                }
              </div>
            </div>
          </td>
        )
      }
      <td>
        { parseInt(Item.thisYearTotal) - 
          parseInt(Item.totalDiligence)
        }
      </td>
      <td>
        {
          parseInt(Item.lastYearRemaining) + 
          parseInt(Item.thisYearTotal) - 
          parseInt(Item.totalDiligence)
        }
      </td>
    </tr>
  )
}

export default memo(Body);
