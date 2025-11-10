const express = require("express");
const ExcelJS = require("exceljs");
const app = express();

// "/major" major.xlsx에 있는 내용들을 읽어서
// 그 내용들을 객체 형태로 만들기
// [
//   { name: "황태진", major: "컴퓨터공학과", minor: "심리학과" },
//   { name: "박성민", major: "정비학과", minor: "사회복지학과" },
//   { name: "김연준", major: "데이터학과", minor: "수학과" },
// ]; => 이런 형식의 json 형태로 반환해야함
// res.josn로 반환하기

app.get("/major", async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    // 같은 폴더에 있는 major.xlsx 읽기
    await workbook.xlsx.readFile("major.xlsx");

    // 시트 가져오기 (이름 우선, 없으면 첫 번째 시트)
    const sheet =
      workbook.getWorksheet("학과 리스트") || workbook.worksheets[0];

    if (!sheet) {
      return res
        .status(404)
        .json({ error: "워크시트를 찾을 수 없습니다. (학과 리스트)" });
    }

    // 1행 헤더에서 컬럼 인덱스 찾기
    const headerRow = sheet.getRow(1);
    const colIndex = { name: null, major: null, minor: null };

    headerRow.eachCell((cell, colNumber) => {
      const text = String(cell.value ?? "").trim();
      if (text === "이름") colIndex.name = colNumber;
      if (text === "전공") colIndex.major = colNumber;
      if (text === "부전공") colIndex.minor = colNumber;
    });

    // 필수 헤더 검증
    if (!colIndex.name || !colIndex.major || !colIndex.minor) {
      return res.status(400).json({
        error: "엑셀 헤더가 올바르지 않습니다. (필수: 이름 / 전공 / 부전공)",
        found: colIndex,
      });
    }

    // 2행부터 데이터 읽어서 객체 배열 만들기
    const result = [];
    sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return; // 헤더 스킵

      const name = String(row.getCell(colIndex.name).value ?? "").trim();
      const major = String(row.getCell(colIndex.major).value ?? "").trim();
      const minor = String(row.getCell(colIndex.minor).value ?? "").trim();

      // 완전히 빈 줄은 스킵
      if (!name && !major && !minor) return;

      result.push({ name, major, minor });
    });

    return res.json(result);
  } catch (err) {
    console.error(err);
    if (err.code === "ENOENT") {
      return res
        .status(404)
        .json({ error: "major.xlsx 파일을 찾을 수 없습니다." });
    }
    return res.status(500).json({
      error: "엑셀을 읽는 중 오류가 발생했습니다.",
      detail: err.message,
    });
  }
});
app.listen(3000, () => {
  console.log("실행~!");
});
