const { v4 } = require("uuid");

// id, author, content, createdAt
const feeds = [
  {
    id: v4(),
    author: "황태진",
    content: "수능 화이팅 ㅎㅎ",
    createdAt: new Date(),
  },
  {
    id: v4(),
    author: "김연준",
    content: "수능이 뭐라고!!",
    createdAt: new Date(),
  },
  {
    id: v4(),
    author: "박찬",
    content: "앞으로의 대학생활을 응원합니당",
    createdAt: new Date(),
  },
];

// id, feedId, author, content, createdAt
const comments = [];

module.exports = { feeds, comments };
