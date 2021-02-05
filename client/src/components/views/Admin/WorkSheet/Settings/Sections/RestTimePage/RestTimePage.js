import React, { memo } from 'react';
import style from './RestTimePage.module.scss';
import { restTime } from '../../../../../../commons/Constants/Admin/WorkSheetSettings';

import { stringToDate, formattedNum } from '../../../../../../../utils/timeUtils';

function RestTime() {

  const midNight1End =  stringToDate(restTime.midNight1[1]);
  const midNight2Start =  stringToDate(restTime.midNight2[0]);
  const midNight2End =  stringToDate(restTime.midNight2[1]);

  return (
    <table className={style['time-table']}>
      <thead>
        <tr className={style.tr}>
          <th className={style.th}>Date Table Ver.</th>
          <th className={style.th} colSpan={2}>{ restTime.version }</th>
        </tr>
      </thead>
      <tbody>
        <tr className={style.tr}>
          <td className={style.td}>時間間隔（分）</td>
          <td className={style.td}>{ restTime.interval }</td>
          <td style={{
            color: 'aqua', 
            textAlign: 'center', 
            fontWeight: '300',
            borderLeft: '1px solid blue'
          }}>
            { 60 / restTime.interval }
          </td>
        </tr>
        <tr className={style.tr}>
          <td className={style.td}>昼休み時間（から～まで）</td>
          <td className={style.td}>{ restTime.lunch[0] }</td>
          <td className={style.td}>{ restTime.lunch[1] }</td>
        </tr>
        <tr className={style.tr}>
          <td className={style.td}>夕食時間（から～まで）</td>
          <td className={style.td}>{ restTime.dinner[0] }</td>
          <td className={style.td}>{ restTime.dinner[1] }</td>
        </tr>
        <tr className={style.tr}>
          <td className={style.td}>深夜休憩時間（から～まで）</td>
          <td className={style.td}>{ restTime.midNight1[0] }</td>
          <td className={style.td}>
            {`
              ${formattedNum(midNight1End.getHours())}:${formattedNum(midNight1End.getMinutes())}
            `}
          </td>
        </tr>
        <tr className={style.tr}>
          <td className={style.td}>深夜休憩時間（から～まで）</td>
          <td className={style.td}>
          {`
              ${formattedNum(midNight2Start.getHours())}:${formattedNum(midNight2Start.getMinutes())}
            `}
          </td>
          <td className={style.td}>
          {`
              ${formattedNum(midNight2End.getHours())}:${formattedNum(midNight2End.getMinutes())}
            `}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default memo(RestTime);
