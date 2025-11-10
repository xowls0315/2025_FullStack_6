const exceljs = require("exceljs");

const readExcel = async () => {
  const Workbook = new exceljs.Workbook();
  await Workbook.xlsx.readFile("data.xlsx");

  const sheet = Workbook.worksheets[0];

  let row = 13;
  while (true) {
    const newRow = sheet.getRow(row);
    console.log(newRow.values[3].richText[1].text);
    row += 10;
    if (row > 154) break;
  }

  //   sheet.getRows(1, 200).forEach((v, i) => {
  //     if (i % 10 == 3) console.log(v.values[i]);
  //   });
};

readExcel();
