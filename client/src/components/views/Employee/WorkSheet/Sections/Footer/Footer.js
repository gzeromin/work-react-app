import React, { memo } from 'react';
import style from './Footer.module.scss';

function Footer() {
  return (
    <div className={style['footer']}>
      <div className={style['footer-title']}>
        記<br/>入<br/>方<br/>法
      </div>
      <div>
        <div className={style['footer-item']}>
          <div className={style['footer-item-section']}>時間</div>
          <div className={style['footer-item-text']}>
          【<span className={style.hightlight}>退勤時間</span>】 は翌日<span className={style.hightlight}>９時</span>を過ぎないようにする。例えば、<span className={style.hightlight}>徹夜をして翌日１２時</span>まで勤務した場合、該当日の勤務時間 <span className={style.hightlight}>９：００～</span><span className={style.hightlight} style={{ textDecoration: 'underline' }}>８：００</span>（翌日の）、翌日の勤務時間は <span className={style.hightlight} style={{ textDecoration: 'underline' }}>８：００</span><span className={style.hightlight}>～１２：００</span> のように<span className={style.hightlight}>２日</span>に分けて記入する。 該当日の備考欄には<span className={style.hightlight}>【徹夜】</span>と記述する。
          </div>
        </div>
        <div className={style['footer-item']}>
          <div className={style['footer-item-section']}>勤怠</div>
          <div className={style['footer-item-text']}>
          【<span className={style.hightlight}>遅刻</span>】 遅刻、早退のある場合記録 「<span className={style.hightlight}>遅</span>」刻、「<span className={style.hightlight}>早</span>」退。　【<span className={style.hightlight}>休出</span>】 休日出勤時記録 休日「<span className={style.hightlight}>出</span>」勤。<br/>
          【<span className={style.hightlight}>年次</span>】 年次時記録 「<span className={style.hightlight}>年</span>」次、無断「<span className={style.hightlight}>欠</span>」勤、「<span className={style.hightlight}>病</span>」欠勤。【<span className={style.hightlight}>半休</span>】 半日年次の場合記録。 午「<span className={style.hightlight}>前</span>」半休、午「<span className={style.hightlight}>後</span>」半休。<br/>
          【<span className={style.hightlight}>其休</span>】 その他休み 「<span className={style.hightlight}>慶</span>」弔休暇、「<span className={style.hightlight}>代</span>」休、「<span className={style.hightlight}>特</span>」別休暇
          </div>
        </div>
        <div className={style['footer-item']}>
          <div className={style['footer-item-section']}>備考</div>
          <div className={style['footer-item-text']}>
          ・特異事項（月例朝会、顧客先訪問など）、勤怠の理由を（<span className={style.hightlight}>【】</span>）で括って記録する。　例）　半休の理由：<span className={style.hightlight}>【家族VISA申請のため】</span><br/>
          ・その日の作業内容を記入。　２行まで入るので少し詳しく記入する。
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Footer);
