const express = require("express");
const app = express();
const morgan = require("morgan");
const joi = require("joi");
const { todos, subtasks } = require("./data");
const { v4 } = require("uuid");
const cors = require("cors");

const {
  isValidDueDateFormat,
  requestLogger,
  responseFormatter,
  validateTodo,
  validateSubtask,
  addId,
  errorHandler,
  ALLOWED_STATUS,
} = require("./func");

// JSON 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 로깅: morgan + 우리가 만든 로거 둘 다 써도 됨
// app.use(morgan("dev"));
app.use(requestLogger);

// 공통 응답 포맷 (res.success, res.fail 추가)
app.use(responseFormatter);

app.get("/", (req, res) => {
  return res.send("<h1>To-do 서비스에 오신걸 환영합니다!</h1>");
});

// Todo 전체 조회(GET): /todos => 전체 Todo 리스트
app.get("/todos", (req, res) => {
  return res.json(todos);
  // return res.success("전체 To-do 리스트입니다.", todos);
});

// Todo 특정 조회(GET): /todos/:todoId => id로 단일 Todo 정보 조회
app.get("/todos/:todoId", (req, res) => {
  const { todoId } = req.params; // URL에서 id 추출
  const targetIndex = todos.findIndex((v) => v.id == todoId);
  if (targetIndex == -1) {
    return res.fail(`${todoId}번의 To-do 항목은 없습니다!`, 404);
  }

  return res.success(`id ${todoId}번 To-do 항목입니다.`, todos[targetIndex]);
});

// Todo 생성(POST): /todos => title, description, status, dueDate 등록 (+ id와 createdAt과 updatedAt은 자동부여)
app.post("/todos", addId, validateTodo, (req, res) => {
  const { title, description, status, dueDate, id } = req.body;

  const newTodo = {
    id, // 이미 addId에서 넣어줌
    title,
    description,
    status,
    dueDate,
    createdAt: new Date().toLocaleString(),
    updatedAt: new Date().toLocaleString(),
  };

  todos.push(newTodo);

  return res.success(
    `'${title}'의 새로운 To-do 항목이 추가되었습니다!`,
    newTodo,
    201
  );
});

// Todo 삭제(DELETE): /todos/:todoId
// - splice() 활용
app.delete("/todos/:todoId", (req, res) => {
  const { todoId } = req.params;
  const targetIndex = todos.findIndex((v) => v.id == todoId);
  if (targetIndex == -1) {
    return res.fail(`id ${todoId}번의 To-do 항목은 없습니다!`, 404);
  }

  todos.splice(targetIndex, 1);

  // 삭제 성공 → 204 No Content, body 없음
  return res.status(204).send();
});

// Todo 수정(PUT): /todos/:todoId => title, description, status, dueDate만 수정 가능 (updatedAt는 수정 시점에 자동으로 new Date())
app.put("/todos/:todoId", (req, res) => {
  const { todoId } = req.params;
  const targetIndex = todos.findIndex((v) => v.id == todoId);
  if (targetIndex == -1) {
    return res.fail(`id ${todoId}번의 To-do 항목은 없습니다!`, 404);
  }

  const { title, description, status, dueDate } = req.body;

  // status가 들어왔으면 검증
  if (status && !ALLOWED_STATUS.includes(status)) {
    return res.fail(
      `status는 ${ALLOWED_STATUS.map((s) => `${s}`).join(
        ", "
      )} 중 하나여야 합니다.`,
      400
    );
  }

  // dueDate가 들어왔으면 검증
  if (dueDate && !isValidDueDateFormat(dueDate)) {
    return res.fail(
      "dueDate는 YYYY-MM-DD 형식이어야 합니다. 예: 2025-11-30",
      400
    );
  }

  todos[targetIndex].title = title || todos[targetIndex].title;
  todos[targetIndex].description =
    description || todos[targetIndex].description;
  todos[targetIndex].status = status || todos[targetIndex].status;
  todos[targetIndex].dueDate = dueDate || todos[targetIndex].dueDate;
  todos[targetIndex].updatedAt = new Date().toLocaleString(); // 수정 시점 갱신

  return res.success(
    `id ${todos[targetIndex].id}번 To-do 항목이 수정되었습니다.`,
    todos[targetIndex]
  );
});

// 특정 Todo의 Subtask 생성(POST): /todos/:todoId/subtasks => title, status 등록 (+ id와 createdAt과 updatedAt은 자동부여)
app.post("/todos/:todoId/subtasks", addId, validateSubtask, (req, res) => {
  const { todoId } = req.params;
  const { id, title, status } = req.body;

  const target = todos.findIndex((v) => v.id == todoId);
  if (target == -1) {
    return res.fail(`해당 ${todoId}번 Todo는 존재하지 않습니다.`, 404);
  }

  const newSubtask = {
    id,
    todoId,
    title,
    status,
    createdAt: new Date().toLocaleString(),
    updatedAt: new Date().toLocaleString(),
  };

  subtasks.push(newSubtask);

  return res.success(
    `id ${todoId}번의 Subtask가 생성되었습니다!`,
    newSubtask,
    201
  );
});

// 특정 Todo의 전체 Subtask 조회(GET): /todos/:todoId/subtasks => todoId로 특정 Todo의 전체 Subtask 조회
app.get("/todos/:todoId/subtasks", (req, res) => {
  const { todoId } = req.params;
  const targetIndex = todos.findIndex((v) => v.id == todoId);
  if (targetIndex == -1) {
    return res.fail(`해당 ${todoId}번의 Todo는 없습니다!`, 404);
  }

  const targets = subtasks.filter((v) => v.todoId == todoId);

  return res.success(`id ${todoId}번 Todo의 Subtask 리스트입니다.`, targets);
});

// 특정 Todo의 특정 Subtask 조회(GET): /subtasks/:subtaskId
app.get("/subtasks/:subtaskId", (req, res) => {
  const { subtaskId } = req.params;
  const targetIndex = subtasks.findIndex((v) => v.id == subtaskId);
  if (targetIndex == -1) {
    return res.fail(`해당 ${subtaskId}번의 Subtask는 없습니다!`, 404);
  }

  return res.success(`id ${subtaskId}번 Subtask입니다.`, subtasks[targetIndex]);
});

// Subtask 삭제(DELETE): /subtasks/:subtaskId
// - splice() 활용
app.delete("/subtasks/:subtaskId", (req, res) => {
  const { subtaskId } = req.params;
  const targetIndex = subtasks.findIndex((v) => v.id == subtaskId);
  if (targetIndex == -1) {
    return res.fail(`${subtaskId}번의 Subtask는 없습니다!`, 404);
  }

  subtasks.splice(targetIndex, 1);

  return res.status(204).send();
});

// Subtask 수정(PUT): /subtasks/:subtaskId => title, status만 수정 가능 (updatedAt는 수정 시점에 자동으로 new Date())
app.put("/subtasks/:subtaskId", (req, res) => {
  const { subtaskId } = req.params;
  const targetIndex = subtasks.findIndex((v) => v.id == subtaskId);
  if (targetIndex == -1) {
    return res.fail(`${subtaskId}번의 Subtask는 없습니다!`, 404);
  }

  const { title, status } = req.body;

  // status가 들어왔으면 검증
  if (status && !ALLOWED_STATUS.includes(status)) {
    return res.fail(
      `status는 ${ALLOWED_STATUS.join(", ")} 중 하나여야 합니다.`,
      400
    );
  }

  subtasks[targetIndex].title = title || subtasks[targetIndex].title;
  subtasks[targetIndex].status = status || subtasks[targetIndex].status;
  subtasks[targetIndex].updatedAt = new Date().toLocaleString();

  return res.success(
    `id ${subtaskId}번 Subtask가 수정되었습니다.`,
    subtasks[targetIndex]
  );
});

// ❗ 라우트들보다 항상 뒤에 있어야 함
app.use(errorHandler);

app.listen(3001, () => {
  console.log("To-do 서비스 실행중~!");
});
