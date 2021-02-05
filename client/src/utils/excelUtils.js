import XLSX from 'xlsx';
const reader = new FileReader();

const read = (file, header) => new Promise((resolve, reject) => {
  reader.onload = (e) => {

    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, {type: 'array'});
    
    const sheetNameFirst = workbook.SheetNames[0];
    const workSheet = workbook.Sheets[sheetNameFirst];
    
    const json_excel = XLSX.utils.sheet_to_json(
      workSheet, 
      {header}
    );
    
    resolve(json_excel);
  }
  reader.readAsArrayBuffer(file);
}).then(res => {
  return res;
});

export default {
  read
}