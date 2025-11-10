const ExcelJS = require("exceljs");

// 1️⃣ 워크북(엑셀 파일) 생성
const workbook = new ExcelJS.Workbook();

// 2️⃣ 시트 추가
const sheet = workbook.addWorksheet("학과 리스트");

// 3️⃣ 데이터 준비
const students = [
  { name: "황태진", major: "컴퓨터공학과", minor: "심리학과" },
  { name: "박성민", major: "정비학과", minor: "사회복지학과" },
  { name: "김연준", major: "데이터학과", minor: "수학과" },
];

// 4️⃣ 컬럼(헤더) 정의
sheet.columns = [
  { header: "이름", key: "name", width: 15 },
  { header: "전공", key: "major", width: 20 },
  { header: "부전공", key: "minor", width: 20 },
];

// 5️⃣ 데이터 추가
students.forEach((student) => {
  sheet.addRow(student);
});

// 6️⃣ 엑셀 파일 저장
workbook.xlsx
  .writeFile("major.xlsx")
  .then(() => {
    console.log("✅ 엑셀 파일이 성공적으로 생성되었습니다!");
  })
  .catch((err) => {
    console.error("❌ 엑셀 생성 중 오류:", err);
  });
