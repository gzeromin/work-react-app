import React, { memo, useEffect, useRef, useState } from 'react';
import style from './Header.module.scss';
import Calendar from '../../../../../commons/Components/Calendar/Calendar';
import { restTime } from '../../../../../commons/Constants/Admin/WorkSheetSettings';
import { Button } from 'antd';
import XLSX from '../../../../../../utils/excelUtils';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '../../../../../../_actions/common_action';
import { CheckCircleOutlined } from '@ant-design/icons';

const importHeader = [
  'day',//1
  'day_of_the_week',//2
  'startTime',//3
  'endTime',//4
  'not1',//5
  'not2',//6
  'late',//7
  'annual',//8
  'half',//9
  'etc',//10
  'attendance',//11
  'not3',//12
  'not4',//13
  'not5',//14
  'biko',//15
  'not6',//16
  'not7',//17
  'not8',
  'not9',
  'not10',
  'not11',
  'not12',
  'not13',
  'not14',
  'not15',
  'not16',
  'not17',
  'not18',
];

function Header(props) {

  const submitAuth = ((props.userData && props.userData._id) 
    === (props.writer && props.writer._id));

  // const approvalAuth = ((props.userData && props.userData._id) 
  //   === (props.writer && props.writer.manager));
  
  const approvalAuth = true;

  const confirmAuth = (props.userData && props.userData.role) === 2;

  const [submit, setSubmit] = useState(props.submit);
  const [approval, setApproval] = useState(props.approval);
  const [confirm, setConfirm] = useState(props.confirm);

  useEffect(() => {
    setSubmit(props.submit);
  }, [props.submit]);

  useEffect(() => {
    setApproval(props.approval);
  }, [props.approval]);

  useEffect(() => {
    setConfirm(props.confirm);
  }, [props.confirm]);

  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const openFileInput = () => {
    fileInputRef.current.click();
  }

  const fileInputHandler = async (e) => {
    dispatch(setIsLoading(true));
    const uploadData = await XLSX.read(e.target.files[0], importHeader);
    props.funcImport(uploadData);
    dispatch(setIsLoading(false));
  }

  return (
    <div className={style.wrapper}>
      <div className={style.calendar}>
        <Calendar month />
      </div>
      <div className={style.info}>
        <table className={style['info-top']}>
          <thead>
            <tr>
              <td>間隔：{ restTime.interval }</td>
              <td style={{minWidth: '40rem'}} >休み：
                { restTime.lunch[0] }~{ restTime.lunch[1] },
                { restTime.dinner[0] }~{ restTime.dinner[1] },
                { restTime.midNight1[0] }~{ restTime.midNight1[1] },
                { restTime.midNight2[0] }~{ restTime.midNight2[1] }
              </td>
              <td>Ver2.00[{ restTime.version }]</td>
            </tr>
          </thead>
        </table>
        <div className={style['info-body']}>
          <div className={style['info-body-left']}>
            <div className={style['info-body-left-title']}>
              勤務報告書
            </div>
            <table className={style['info-body-left-employee']}>
              <thead>
                <tr>
                  <td>チーム長：</td>
                  <td></td>
                </tr>
                <tr>
                  <td>氏名：</td>
                  <td>{ props.writer && props.writer.name }</td>
                </tr>
              </thead>
            </table>
          </div>
          <div className={style['info-body-middle']}>
            <table className={style['info-body-middle-top']}>
              <tbody>
                <tr>
                  <td>
                    <Button
                      className={style['info-body-middle-top-btn']}
                      style={ submitAuth ? { color: '#52c41a', background: '#f6ffed', border: '1px solid #b7eb8f' } : {}}
                      disabled={!submitAuth}
                      onClick={() => props.funcWorkSheetWorkflow('submit')}
                    >
                      本人{submit && 
                        <CheckCircleOutlined className={style.icon} />
                      }
                    </Button>
                  </td>
                  <td>
                    <Button
                      className={style['info-body-middle-top-btn']}
                      style={ approvalAuth ? { color: '#eb2f96', background: '#fff0f6', border: '1px solid #ffadd2' } : {}}
                      disabled={!approvalAuth}
                      onClick={() => props.funcWorkSheetWorkflow('approval')}
                    >
                      承認{approval && 
                        <CheckCircleOutlined className={style.icon} />
                      }
                    </Button>
                  </td>
                  <td>
                    <Button
                      className={style['info-body-middle-top-btn']}
                      style={ confirmAuth ? { color: '#722ed1', background: '#f9f0ff', border: '1px solid #d3adf7' } : {}}
                      disabled={!confirmAuth}
                      onClick={() => props.funcWorkSheetWorkflow('confirm')}
                    >
                      確認{confirm && 
                        <CheckCircleOutlined className={style.icon} />
                      }
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
            <table className={style['info-body-middle-bottom']}>
              <tbody>
                <tr>
                  <th>本年度休暇日数</th>
                  <th>既取得休暇日数</th>
                  <th>今回届出日数<span style={{color: 'red'}}>＊</span></th>
                  <th style={{color: 'red'}}>休暇残日数</th>
                </tr>
                <tr>
                  <td>
                    14
                  </td>
                  <td>
                    4
                  </td>
                  <td>
                    1.5
                  </td>
                  <td>
                    8.5
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={style['info-body-right']}>
            <Button 
              className={style['info-body-right-item']}
              type='primary'
              onClick={openFileInput}
            >
              <input 
                type='file' 
                ref={fileInputRef} 
                onChange={fileInputHandler}
                hidden/>
              Import
            </Button>
            <Button 
              className={style['info-body-right-item']}
              type='primary'
            >
              Export
            </Button>
            <Button 
              className={style['info-body-right-item']}
              type='primary'
              onClick={props.funcSave}
            >
              SAVE
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Header);
