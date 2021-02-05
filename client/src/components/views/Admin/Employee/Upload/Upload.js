import React, { memo, useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import style from './Upload.module.scss';
import { Button, Modal } from 'antd';
import { Link } from 'react-router-dom';
import XLSX from '../../../../../utils/excelUtils';
import axios from 'axios';

function Upload(props) {
  const [TableData, setTableData] = useState([]);
  const [CanUpload, setCanUpload] = useState(false);

  useEffect(() => {
    var duplicated = false;
    TableData.map(v => {
      if(v.duplicated) {
        duplicated = true;
      } 
    });
    setCanUpload(!duplicated);
  }, [TableData]);

  const onDrop = async (files) => {
    const header = [
      'no', 
      'employeeNo', 
      'name', 
      'hurigana', 
      'email'
    ];
    const uploadData = await XLSX.read(files[0], header);
    uploadData.splice(0,1);
    axios.post('/api/user/duplicateCheck', uploadData).then(res => {
      if(res.data.success) {
        setTableData(res.data.uploadData);
      } else {
        alert(res.data.err);
      }
    });

  }

  const renderBody = () => {
    const deleteRow = (data) => {
      const index = TableData.indexOf(data);
      var newData = [...TableData];
      newData.splice(index,1);
      setTableData(newData);
    };

    const overrideRow = (data) => {
      const index = TableData.indexOf(data);
      var newData = [...TableData];
      newData[index].override = true;
      newData[index].duplicated = false;
      setTableData(newData);
    };

    return TableData.map((data, index) => {
      return (
        <tr 
          key={index}
          className={`${style.tr} ${data.duplicated && style.duplicated}`}
        >
          <td className={style.td}>{data.no}</td>
          <td className={style.td}>{data.employeeNo}</td>
          <td className={style.td}>{data.name}</td>
          <td className={style.td}>{data.hurigana}</td>
          <td className={style.td}>{data.email}</td>
          <td className={style.td}>
            { data.duplicated &&
              <Button onClick={() => deleteRow(data)}>
                Delete
              </Button>
            }
          </td>
          <td className={style.td}>
            { data.duplicated &&
              <Button onClick={() => overrideRow(data)}>Override</Button>
            }
          </td>
        </tr>
      )
    });
  }

  const onSubmitHandler = () => {
    axios.post('/api/user/uploadEmployees', TableData).then(res => {
      if(res.data.success) {
        Modal.success({
          content: '登録されました。',
        });
        setTimeout(() => {
          props.history.push('/admin/employee/list');
        }, 1000);
      } else {
        console.log(res.data.err);
        Modal.error({
          title: '登録失敗',
          content: '管理者に問い合わせしてください。',
        });
      }
    });
  };

  return (
    <div className={style.wrapper}>
      <div className={style.tools}>
        <Link 
          to='/templates/employee_template.xlsx'
          target='_blank'
          download
        >
          <Button
            type='primary'
            shape='round'
          >
            Download Template
          </Button>
        </Link>
      </div>
      {TableData.length === 0 &&     
        <div className={style.drop}>
          <Dropzone
            onDrop={onDrop}
            multiple={false}
            maxSize={800000000}
            >
              {({getRootProps, getInputProps}) => (
                <div className={style['drop-box']} {...getRootProps()}>
                  <input type="text" {...getInputProps()}/>
                  <i className={`material-icons ${style['drop-icon']}`}>add</i>
                </div>
              )}
          </Dropzone>
        </div>
      }
      {TableData.length !== 0 &&
        <div className={style.preview}>
          {
            !CanUpload &&
            <h2
              style={{textAlign: 'center', color: 'red'}}
            >
              重複されているデータがあります。
            </h2>
          }
          <table className={style.table}>
            <thead>
              <tr className={style.tr}>
                <th className={style.th}></th>
                <th className={style.th}>社員番号</th>
                <th className={style.th}>氏  名</th>
                <th className={style.th}>ﾌﾘｶﾞﾅ</th>
                <th className={style.th}>ﾒｰﾙｱﾄﾞﾚｽ</th>
                <th className={style.th}></th>
                <th className={style.th}></th>
              </tr>
            </thead>
            <tbody>
              { renderBody() }
            </tbody>
          </table>
          <div className={style.uploadBtn}>
            <Button
              type='primary'
              shape='round'
              disabled={!CanUpload}
              onClick={onSubmitHandler}
            >
              Upload
            </Button>
          </div>
        </div>
      }
    </div>
  )
}

export default memo(Upload);
