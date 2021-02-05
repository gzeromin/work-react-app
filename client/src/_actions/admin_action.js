import axios from 'axios';
import {
  FETCH_EMPLOYEE_LIST,
  SET_EMPLOYEE,
  FETCH_PAID_HOLIDAY_LIST
} from "./types";

export async function fetchEmployeeList() {
  const request = await axios.get('/api/user/employeeList')
    .then(res => res.data );
  return {
    type: FETCH_EMPLOYEE_LIST,
    payload: request
  }
}

export async function setEmployee(employee) {
  return {
    type: SET_EMPLOYEE,
    payload: employee
  }
}

export async function fetchPaidHolidayList(year) {
  const request = await axios.get(`/api/paidHoliday/paidHolidayList?year=${year}`)
    .then(res => res.data );
  return {
    type: FETCH_PAID_HOLIDAY_LIST,
    payload: request
  }
}