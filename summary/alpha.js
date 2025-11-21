const express = require("express");
const app = express();

// 웹브라우저(주인)
// Request <=> Resposne [HTTPS 방식]
// 웹서버(따까리)는 [생성(POST), 조회(GET), 수정(PUT), 삭제(DELETE)] => CRUD

app.get("/bread", (req, res) => {
  res.json(["소보로빵", "크림빵", "공공칠빵"]);
});

app.get("/caffein", (req, res) => {
  res.json(["아메리카노", "라떼", "카페모카"]);
});

app.listen(3000, () => {
  console.log("서버 시작~!");
});
