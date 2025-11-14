// func.js
const { v4: uuidv4 } = require("uuid");

// 상태값 허용 목록
const ALLOWED_STATUS = ["pending", "in-progress", "done"];

// ✅ YYYY-MM-DD 형식 + 존재하는 날짜인지 검사
const isValidDueDateFormat = (dueDate) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dueDate)) return false;

  const [year, month, day] = dueDate.split("-").map(Number);
  const date = new Date(dueDate);

  if (Number.isNaN(date.getTime())) return false;
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day
  ) {
    return false;
  }

  return true;
};

// 공통 시간 포맷 (응답에서 사용할 예정)
const getNowString = () => {
  return new Date().toLocaleString();
};

/* 🟦 B. 로깅 미들웨어
   [PUT] /todos/123e4 - 11:03:25 AM 이런 형식으로 찍기 */
const requestLogger = (req, res, next) => {
  const time = new Date().toLocaleTimeString();
  console.log(`[${req.method}] ${req.originalUrl} - ${time}`);
  next();
};

/* 🟥 D. 공통 응답 포맷 미들웨어
   - res.success(message, data, statusCode?)
   - res.fail(message, statusCode?) 추가 */
const responseFormatter = (req, res, next) => {
  res.success = (message, data = null, statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      time: getNowString(),
    });
  };

  res.fail = (message, statusCode = 400) => {
    return res.status(statusCode).json({
      success: false,
      message,
      time: getNowString(),
    });
  };

  next();
};

/* 🟧 A-1. Todo 유효성 검증 미들웨어
   - title 필수
   - status 허용값인지
   - dueDate 형식 YYYY-MM-DD
   - description은 옵션 */
const validateTodo = (req, res, next) => {
  const { title, status, dueDate } = req.body;

  if (!title) {
    return res.fail("title은 필수입니다.", 400);
  }

  if (!status || !ALLOWED_STATUS.includes(status)) {
    return res.fail(
      `status는 ${ALLOWED_STATUS.map((s) => `${s}`).join(
        ", "
      )} 중 하나여야 합니다.`,
      400
    );
  }

  if (!dueDate || !isValidDueDateFormat(dueDate)) {
    return res.fail(
      "dueDate는 YYYY-MM-DD 형식이어야 합니다. 예: 2025-11-30",
      400
    );
  }

  // description은 옵션이라 검사 안 함
  next();
};

/* 🟧 A-2. Subtask 유효성 검증 미들웨어
   - title 필수
   - status 허용값인지 */
const validateSubtask = (req, res, next) => {
  const { title, status } = req.body;

  if (!title) {
    return res.fail("Subtask의 title은 필수입니다.", 400);
  }

  if (!status || !ALLOWED_STATUS.includes(status)) {
    return res.fail(
      `status는 ${ALLOWED_STATUS.map((s) => `${s}`).join(
        ", "
      )} 중 하나여야 합니다.`,
      400
    );
  }

  next();
};

/* 🟩 C. UUID 자동 생성 미들웨어
   - Todo / Subtask 생성 시 req.body.id에 uuid 넣기
   - 필요할 때만 라우트에서 붙여서 사용 */
const addId = (req, res, next) => {
  req.body.id = uuidv4();
  next();
};

/* 🟥 E. 에러 핸들링 미들웨어
   - throw 된 에러, next(err) 된 에러들을 모두 500으로 응답 */
const errorHandler = (err, req, res, next) => {
  console.error("💥 서버 에러:", err);

  // 이미 헤더가 나갔다면 Express 기본 에러 핸들링에 맡김
  if (res.headersSent) {
    return next(err);
  }

  // 여기서는 공통 포맷(res.success/res.fail)을 보장하기 어렵기 때문에
  // responseFormatter보다 나중에 붙는다는 가정 하에 res.fail 사용 가능
  if (res.fail) {
    return res.fail(err.message || "서버 내부 오류가 발생했습니다.", 500);
  }

  // 혹시 res.fail이 세팅되지 않은 상황 대비(안전빵)
  return res.status(500).json({
    success: false,
    message: err.message || "서버 내부 오류가 발생했습니다.",
    time: getNowString(),
  });
};

module.exports = {
  isValidDueDateFormat,
  requestLogger,
  responseFormatter,
  validateTodo,
  validateSubtask,
  addId,
  errorHandler,
  ALLOWED_STATUS,
};
