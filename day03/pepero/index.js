// 빼빼로 서버 만들기
// excel
// / => 빼빼로 월드에 오신걸 환영합니다!
// /list => 엑셀 있는 그대로 배열 오브젝트 돌려주기

const express = require("express");
const ExcelJS = require("exceljs");
const app = express();

/** 공통 헬퍼: pepero.xlsx 읽어서 [{ name, price }, ...] 형태로 반환 */
const getPepero = async () => {
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.readFile("pepero.xlsx");
  } catch (err) {
    if (err.code === "ENOENT") {
      const e = new Error("pepero.xlsx 파일을 찾을 수 없습니다.");
      e.status = 404;
      throw e;
    }
    const e = new Error("엑셀 파일을 읽는 중 오류가 발생했습니다.");
    e.status = 500;
    e.detail = err.message;
    throw e;
  }

  // 시트 선택 (이름 우선)
  const sheet =
    workbook.getWorksheet("빼빼로 리스트") || workbook.worksheets[0];
  if (!sheet) {
    const e = new Error("워크시트를 찾을 수 없습니다. (빼빼로 리스트)");
    e.status = 404;
    throw e;
  }

  // 헤더 인덱스 매핑
  const headerRow = sheet.getRow(1);
  const colIndex = { name: null, price: null };
  headerRow.eachCell((cell, colNumber) => {
    const text = String(cell.value ?? "").trim();
    if (text === "빼빼로 이름") colIndex.name = colNumber;
    if (text === "가격") colIndex.price = colNumber;
  });

  if (!colIndex.name || !colIndex.price) {
    const e = new Error(
      "엑셀 헤더가 올바르지 않습니다. (필수: 빼빼로 이름 / 가격)"
    );
    e.status = 400;
    e.found = colIndex;
    throw e;
  }

  // 데이터 파싱 (2행부터)
  const result = [];
  sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return; // 헤더 스킵
    const name = String(row.getCell(colIndex.name).value ?? "").trim();
    const price = Number(row.getCell(colIndex.price).value ?? 0);
    if (!name && !price) return; // 완전 빈 줄 스킵
    if (!name) return; // 이름 비면 스킵
    result.push({ name, price });
  });

  return result;
};

app.get("/", (req, res) => {
  res.send("<h1>빼빼로 월드에 오신걸 환영합니다!</h1>");
});

app.get("/list", async (req, res) => {
  try {
    const list = await getPepero();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({
      error: err.message,
      ...(err.detail ? { detail: err.detail } : {}),
      ...(err.found ? { found: err.found } : {}),
    });
  }
});

// ✅ 동적 파라미터로 특정 번호의 빼빼로 조회
app.get("/list/:abc", async (req, res) => {
  try {
    const index = parseInt(req.params.abc, 10);
    if (Number.isNaN(index) || index < 1) {
      return res
        .status(400)
        .json({ error: "유효한 번호를 입력해주세요. (1 이상의 정수)" });
    }

    const list = await getPepero();
    if (index > list.length) {
      return res
        .status(404)
        .json({ error: `해당 번호(${index})의 빼빼로가 존재하지 않습니다.` });
    }

    res.json(list[index - 1]); // 배열은 0부터 시작
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({
      error: err.message,
      ...(err.detail ? { detail: err.detail } : {}),
    });
  }
});

app.listen(3000, () => {
  console.log("실행~!");
});
