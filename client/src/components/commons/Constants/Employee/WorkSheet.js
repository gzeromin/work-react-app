import { numToString } from '../../../../utils/timeUtils';

const workSheet = {
  year: null,
  month: null,
  writer: '',
  diligence: null,
  submit: null,
  approval: null,
  confirm: null
}

const workSheetDay = {
  startTime: '',
  endTime: '',
  late: '',
  annual: '',
  half: '',
  etc: '',
  attendance: '',
  biko: ''
}

const getDBSchema = (year, month, writer) => {
  let result = {...workSheet};
  result.year = year;
  result.month = month;
  result.writer = writer;
  for (var i=1; i<32; i++) {
    result[i] = workSheetDay;
  }
  return result;
}

const getSchemaData = (writer, data) => {
  console.log(data);
  const newData = data.filter((v, index) => index > 6 && index < 38);

  let result = {...workSheet};
  result.year = data[1].day_of_the_week;
  result.month = data[3].day_of_the_week - 1;
  result.writer = writer;
  for (var i=1; i<32; i++) {
    result[i] = {};
  }
  var totalDiligence = 0;
  newData.map((v, i) => {
    if(typeof(v.day) === 'number') {
      result[v.day].startTime = numToString(v.startTime * 24 * 60 * 60 * 1000);
      result[v.day].endTime = numToString(v.endTime * 24 * 60 * 60 * 1000);
      Object.keys(diligence).map(diligenceKey => {
        var target = late;
        var score = null;
        switch(diligenceKey) {
          case 'late': 
            target = late;
            score = 0.25;
            break;
          case 'annual': 
            target = annual; 
            score = 1;
            break;
          case 'half': 
            target = half; 
            score = 0.5;
            break;
          case 'etc': 
            target = etc; 
            break;
          case 'attendance': 
            target = attendance; 
            break;
          default: break;
        }
        Object.keys(target).map(key => {
          if(target[key] === v[diligenceKey]) {
            result[v.day][diligenceKey] = key;
            if(score) totalDiligence = totalDiligence + score;
          }
        });
      });
      result[v.day].biko = v.biko;
    }
  });
  result.diligence = totalDiligence;
  return result;
}

const late = {
  1: '遅',
  2: '早'
}

const annual = {
  1: '年',
  2: '欠',
  3: '病'
}

const half = {
  1: '前',
  2: '後'
}

const etc = {
  1: '慶',
  2: '代',
  3: '特'
}

const attendance = {
  1: '出',
}

const diligence = {
  late,
  annual,
  half,
  etc,
  attendance
}
export {
  getDBSchema,
  getSchemaData,
  workSheetDay,
  diligence
}