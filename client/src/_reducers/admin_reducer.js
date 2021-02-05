import {
  FETCH_EMPLOYEE_LIST,
  SET_EMPLOYEE,
  FETCH_PAID_HOLIDAY_LIST
} from '../_actions/types';

export default function (state={}, action) {
  switch(action.type) {
    case FETCH_EMPLOYEE_LIST:
      const employeeList = action.payload.result;
      const managerList = [{}, ...employeeList.filter(v => v.role === 1)];
      return { 
        ...state, 
        employeeList: employeeList,
        managerList: managerList
      };
    case SET_EMPLOYEE:
      return { ...state, employee: action.payload };
    case FETCH_PAID_HOLIDAY_LIST:
      return { 
        ...state, 
        paidHolidayList: action.payload.result,
      };
    default:
      return { ...state };
  }
}