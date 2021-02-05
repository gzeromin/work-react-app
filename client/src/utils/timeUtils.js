
const stringToDate = (str) => {
  const strSplit = stringToArray(str);
  if (!strSplit) return null;
  return new Date(0,0,0, strSplit[0], strSplit[1], 0);
}


const numToString = (num) => {
  if(!num) return '';
  var hours = Math.floor(num / 1000 / 60 / 60);
  num -= hours * 1000 * 60 * 60;
  var minutes = Math.floor(num / 1000 / 60);
  return `${formattedNum(hours, 2)}:${formattedNum(minutes, 2)}`;
}

const getTimeQuantityHM = (timeStr) => {
  const strSplit = stringToArray(timeStr);
  if (!strSplit) return null;

  return strSplit[0] * 60 + strSplit[1];
}

const numToStringHM = (num) => {
  if(!num) return '';
  var hours = Math.floor(num / 60);
  num -= hours * 60;
  var minutes = Math.floor(num);
  return `${hours > 100 ? hours : formattedNum(hours, 2)}:${formattedNum(minutes, 2)}`;
}

const formattedNum = (num, digit = 2) => {
  return ('0000000000' + num).slice(digit * -1);
}

export {
  stringToDate,
  numToString,
  numToStringHM,
  formattedNum,
  getTimeQuantityHM
}

const stringToArray = (str) => {
  if (!str) return null;
  if (str.indexOf(':') === -1) return null;
  const strSplit = str.split(':');
  if(strSplit.length !== 2) return null;
  const hour  = strSplit[0];
  const minute = strSplit[1];
  return [parseInt(hour, 10), parseInt(minute, 10)];
}