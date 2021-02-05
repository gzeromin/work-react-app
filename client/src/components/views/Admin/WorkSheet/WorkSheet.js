import React, { memo } from 'react';
import Default from './Default/Default';
import Settings from './Settings/Settings';
import HolidayList from './HolidayList/HolidayList';

function WorkSheet(props) {

  let showPage = <Default />
  if(props.match.params.subFunc === 'settings') {
    showPage = <Settings />
  } else if(props.match.params.subFunc === 'holidayList') {
    showPage = <HolidayList {...props} />
  }

  return (
    <div>
      {showPage}
    </div>
  )
}

export default memo(WorkSheet);
