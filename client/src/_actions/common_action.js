import {
  IS_LOADING,
  EMPLOYEE_WORKSHEET_YEAR,
  EMPLOYEE_WORKSHEET_MONTH,
} from "./types";

export function setIsLoading(isLoading) {
  return {
    type: IS_LOADING,
    payload: isLoading
  }
}

export function setEmployeeWorksheetYear(year) {
  return {
    type: EMPLOYEE_WORKSHEET_YEAR,
    payload: year
  }
}

export function setEmployeeWorksheetMonth(month) {
  return {
    type: EMPLOYEE_WORKSHEET_MONTH,
    payload: month
  }
}