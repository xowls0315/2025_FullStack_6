const exceljs = require("exceljs");

const workbook = new exceljs.Workbook();
const peperoWorkbook = workbook.addWorksheet("빼빼로 과자 리스트");
peperoWorkbook.columns = [
  { header: "빼빼로 이름", key: "name" },
  { header: "맛", key: "flavor" },
  { header: "칼로리", key: "kcal" },
];

peperoWorkbook.addRow({ name: "누드", flavor: "부드러운 초코", kcal: "300" });
peperoWorkbook.addRow({ name: "오리지널", flavor: "뻑뻑한 초코", kcal: "230" });

const icecreamWorkbook = workbook.addWorksheet("아이스크림 리스트");
icecreamWorkbook.columns = [
  { header: "아이스크림 이름", key: "name" },
  { header: "맛", key: "flavor" },
  { header: "칼로리", key: "kcal" },
];

icecreamWorkbook.addRow({ name: "월드콘", flavor: "바닐라", kcal: "300" });
icecreamWorkbook.addRow({ name: "빠삐코", flavor: "초코", kcal: "230" });

workbook.xlsx.writeFile("pepero.xlsx");
