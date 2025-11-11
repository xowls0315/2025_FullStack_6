const ExcelJS = require("exceljs");

// 1️⃣ 워크북(엑셀 파일) 생성
const workbook = new ExcelJS.Workbook();

// 2️⃣ 시트 추가
const sheet = workbook.addWorksheet("빼빼로 리스트");

// 3️⃣ 데이터 준비
const peperos = [
  { name: "초코빼빼로", price: 1000 },
  { name: "아몬드빼빼로", price: 1500 },
  { name: "초코필드빼빼로", price: 1500 },
  { name: "화이트쿠키빼빼로", price: 1500 },
];

// 4️⃣ 컬럼(헤더) 정의
sheet.columns = [
  { header: "빼빼로 이름", key: "name", width: 20 },
  { header: "가격", key: "price", width: 15 },
];

// 5️⃣ 데이터 추가
peperos.forEach((pepero) => {
  sheet.addRow(pepero);
});

// 6️⃣ 엑셀 파일 저장
workbook.xlsx
  .writeFile("pepero.xlsx")
  .then(() => {
    console.log("✅ 엑셀 파일이 성공적으로 생성되었습니다!");
  })
  .catch((err) => {
    console.error("❌ 엑셀 생성 중 오류:", err);
  });
