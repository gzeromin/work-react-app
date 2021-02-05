import {
  EMPLOYEE_WORKSHEET_MONTH,
  EMPLOYEE_WORKSHEET_YEAR,
  IS_LOADING
} from '../_actions/types';

export default function(state={}, action) {
  switch(action.type) {
    case IS_LOADING:
      return { ...state, isLoading: action.payload };
    case EMPLOYEE_WORKSHEET_YEAR:
      return { ...state, employeeWorksheetYear: action.payload };
    case EMPLOYEE_WORKSHEET_MONTH:
      return { ...state, employeeWorksheetMonth: action.payload };
    default:
      return {...state};
  }
}