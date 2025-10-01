import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';

// Syscraft check file-saver import from @types/file-saver ?
// Which will be add from file-saver itself.
import * as fs from 'file-saver';
import moment from 'moment';

// Syscraft comment
// import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ExcelFormatService {

  constructor() {}

  generateExcel(excelData: any, reportName: any, reportDate: any) {

  // Excel Title, Header, Data
    const title = reportName;
    const header = ['CMP No', 'Area', 'Asset Id', 'Alarm Color', 'Primary Issues', 'Secondary Issues', 'Recommendations', 'Sap No', 'Priority'];

    const data = this.dataCreation(excelData);

    // Create workbook and worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Short CM Report');


  // Add Row and formatting
      const titleRow = worksheet.addRow([title]);
      titleRow.font = { size: 16, underline: 'double', bold: true };
      worksheet.addRow([]);
      const subTitleRow = worksheet.addRow(['Date : ' + moment(reportDate).format('DD MMMM, yyyy')]);

  // Blank Row
      worksheet.addRow([]);

  // Add Header Row
      const headerRow = worksheet.addRow(header);

  // Cell Style : Fill and Border
    headerRow.eachCell((cell: any, number: any) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF' },
        bgColor: { argb: 'FFFFFF' }
      };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });



// Add Data and Conditional Formatting
    data.forEach((d: any) => {
      const row = worksheet.addRow(d);
      const qty = row.getCell(4);
      let cellColor = "2A8947";
      if (qty.value == "Yellow") {
        cellColor = "FFFF00"
      }else if(qty.value == "Red"){
        cellColor = "FF0000";
      }else {
        cellColor = "2A8947";
      }
      
      qty.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: cellColor }
      };
    }

);

  worksheet.getColumn(2).width = 20;
  worksheet.getColumn(3).width = 50;
  worksheet.getColumn(4).width = 15;
  worksheet.getColumn(5).width = 45;
  worksheet.getColumn(6).width = 30;
  worksheet.getColumn(7).width = 70;
  worksheet.getColumn(8).width = 20;
  worksheet.getColumn(9).width = 20;
  worksheet.getColumn(3).alignment = {wrapText: true };
  worksheet.getColumn(5).alignment = {wrapText: true };
  worksheet.getColumn(7).alignment = {wrapText: true };
  worksheet.addRow([]);

// Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Short CM Report.xlsx');
    });

  }

  dataCreation(data: any){
    let excelData: any = [];
    data.map((data: any) => {
      data.excelData = [
        data.companyNo, data.companyArea, data.assetId, 
        data.alarmColorName, data.primaryIssue, 
        data.secondaryIssue?data.secondaryIssue:'None', 
        data.recommendations, data.sapNo, data.priority
      ]
      excelData.push(data.excelData);
    });
    return excelData;
  }
}
