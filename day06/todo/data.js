const { v4 } = require("uuid");

// id, title, description, status, dueDate(YYYY-MM-DD), createdAt, updatedAt
const todos = [
  {
    id: v4(),
    title: "백엔드 공부",
    description: "CRUD 구축",
    status: "pending",
    dueDate: "2025-11-30",
    createdAt: new Date().toLocaleString(),
    updatedAt: new Date().toLocaleString(),
  },
  {
    id: v4(),
    title: "프론트엔드 공부",
    description: "React 컴포넌트 개념",
    status: "in-progress",
    dueDate: "2025-12-30",
    createdAt: new Date().toLocaleString(),
    updatedAt: new Date().toLocaleString(),
  },
  {
    id: v4(),
    title: "풀스택 공부",
    description: "프론트와 백 연동하기",
    status: "pending",
    dueDate: "2026-01-30",
    createdAt: new Date().toLocaleString(),
    updatedAt: new Date().toLocaleString(),
  },
];

// id, todoId(uuid의 v4()), title, status, createdAt, updatedAt
const subtasks = [];

module.exports = { todos, subtasks };
