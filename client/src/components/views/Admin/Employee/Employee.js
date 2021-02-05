import React, { memo } from 'react';
import Default from './Default/Default';
import List from './List/List';
import Create from './Create/Create';
import Upload from './Upload/Upload';

function Employee(props) {
  
  let showPage = <Default {...props} />
  if(props.match.params.subFunc === 'list') {
    showPage = <List {...props} />
  } else if(props.match.params.subFunc === 'create'){
    showPage = <Create {...props} />
  } else if(props.match.params.subFunc === 'upload') {
    showPage = <Upload {...props} />
  }
  
  return (
    <div className='overflow-y'>
      {showPage}
    </div>
  )
}

export default memo(Employee);
