// 빼빼로 서버 만들기
// excel
// / => 빼빼로 월드에 오신걸 환영합니다!
// /list => 엑셀 있는 그대로 배열 오브젝트 돌려주기

const express = require("express");
const ExcelJS = require("exceljs");
const app = express();

app.get("/", (req, res) => {
  res.send("<h1>빼빼로 월드에 오신걸 환영합니다!</h1>");
});

app.get("/list", async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    // 같은 폴더에 있는 pepero.xlsx 읽기
    await workbook.xlsx.readFile("pepero.xlsx");

    // 시트 가져오기 (이름 우선, 없으면 첫 번째 시트)
    const sheet =
      workbook.getWorksheet("빼빼로 리스트") || workbook.worksheets[0];

    if (!sheet) {
      return res
        .status(404)
        .json({ error: "워크시트를 찾을 수 없습니다. (빼빼로 리스트)" });
    }

    // 1행 헤더에서 컬럼 인덱스 찾기
    const headerRow = sheet.getRow(1);
    const colIndex = { name: null, price: null };

    headerRow.eachCell((cell, colNumber) => {
      const text = String(cell.value ?? "").trim();
      if (text === "빼빼로 이름") colIndex.name = colNumber;
      if (text === "가격") colIndex.price = colNumber;
    });

    // 필수 헤더 검증
    if (!colIndex.name || !colIndex.price) {
      return res.status(400).json({
        error: "엑셀 헤더가 올바르지 않습니다. (필수: 빼빼로 이름 / 가격)",
        found: colIndex,
      });
    }

    // 2행부터 데이터 읽어서 객체 배열 만들기
    const result = [];
    sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return; // 헤더 스킵

      const name = String(row.getCell(colIndex.name).value ?? "").trim();
      const price = String(row.getCell(colIndex.price).value ?? "").trim();

      // 완전히 빈 줄은 스킵
      if (!name && !price) return;

      result.push({ name, price });
    });

    return res.json(result);
  } catch (err) {
    console.error(err);
    if (err.code === "ENOENT") {
      return res
        .status(404)
        .json({ error: "pepero.xlsx 파일을 찾을 수 없습니다." });
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
