const mysql = require("mysql2/promise");
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "koreait",
  connectionLimit: 10,
});

app.get("/boards", async (req, res) => {
  const [data] = await pool.query("select * from boards");
  res.json(data);
});

app.post("/boards", async (req, res) => {
  const { author, title, contents } = req.body;
  const sql = `insert into boards (author, title, contents) values (?, ?, ?)`;

  const [result] = await pool.query(sql, [author, title, contents]);
  res.json({ msg: `${result.insertId} 만들어짐!` });
});

// 게시물 삭제(DELETE): /boards/:boardId
app.delete("/boards/:boardId", async (req, res) => {
  const { boardId } = req.params;

  const [result] = await pool.query("DELETE FROM boards WHERE id = ?", [
    boardId,
  ]);

  if (result.affectedRows === 0) {
    return res.status(404).json({
      message: `id ${boardId}번의 게시물은 없습니다!`,
    });
  }

  // 2️⃣ id 재정렬
  await pool.query("SET @CNT = 0");
  await pool.query("UPDATE boards SET id = (@CNT := @CNT + 1) ORDER BY id");
  await pool.query("ALTER TABLE boards AUTO_INCREMENT = 1");

  return res.status(200).json({
    message: `id ${boardId}번 게시물은 삭제되었습니다.`,
  });
});

// 게시물 내용 수정(PUT): /boards/:boardId => author, title, contents 수정 가능
app.put("/boards/:boardId", async (req, res) => {
  const { boardId } = req.params;
  const { author, title, contents } = req.body;

  const [result] = await pool.execute(
    "UPDATE boards SET author = ?, title = ?, contents = ? WHERE id = ?",
    [author, title, contents, boardId]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({
      message: `${boardId}번의 게시물이 없습니다!`,
    });
  }

  return res.status(200).json({
    message: `id ${boardId}번 게시물이 수정되었습니다.`,
  });
});

// 모든 댓글 조회(GET): /comments
app.get("/comments", async (req, res) => {
  const [data] = await pool.query("select * from comments");
  res.json(data);
});

// 특정 게시물의 댓글 등록(POST): /boards/:boardId/comments => author, comments 등록 (+ id은 자동부여)
app.post("/boards/:boardId/comments", async (req, res) => {
  const { boardId } = req.params;
  const { author, contents } = req.body;

  if (!author || !contents) {
    return res.status(400).json({
      message: "작성자(author)와 내용(contents)는 모두 입력해야 합니다!",
    });
  }

  const [boards] = await pool.query("SELECT * FROM boards WHERE id = ?", [
    boardId,
  ]);

  if (boards.length === 0) {
    return res.status(404).json({
      message: `${boardId}번 게시물을 찾을 수 없습니다.`,
    });
  }

  // 댓글 INSERT
  const [result] = await pool.query(
    "INSERT INTO comments (author, contents, board_id) VALUES (?, ?, ?)",
    [author, contents, boardId]
  );

  return res.status(201).json({
    message: "댓글이 생성되었습니다!",
    commentId: result.insertId,
    boardId: Number(boardId),
    author,
    contents,
  });
});

// 특정 게시물의 댓글 조회(GET): /boards/:boardId/comments => boardId로 특정 게시물의 댓글 조회
// - 없는 경우 404
app.get("/boards/:boardId/comments", async (req, res) => {
  const { boardId } = req.params;
  const [boardRows] = await pool.query(
    "SELECT id, title FROM boards WHERE id = ?",
    [boardId]
  );

  if (boardRows.length === 0) {
    return res.status(404).json({
      message: `${boardId}번 게시물을 찾을 수 없습니다!`,
    });
  }

  const [commentRows] = await pool.query(
    "SELECT * FROM comments WHERE board_id = ? ORDER BY id ASC",
    [boardId]
  );

  return res.status(200).json({
    boardId: Number(boardId),
    title: boardRows[0].title,
    totalComments: commentRows.length,
    comments: commentRows,
  });
});

// 댓글 삭제(DELETE): /comments/:commentId
app.delete("/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const [result] = await pool.query("DELETE FROM comments WHERE id = ?", [
    commentId,
  ]);

  if (result.affectedRows === 0) {
    return res.status(404).json({
      message: `id ${commentId}번의 댓글은 없습니다!`,
    });
  }

  //   // 2️⃣ id 재정렬
  //   await pool.query("SET @CNT = 0");
  //   await pool.query("UPDATE boards SET id = (@CNT := @CNT + 1) ORDER BY id");
  //   await pool.query("ALTER TABLE boards AUTO_INCREMENT = 1");

  return res.status(200).json({
    message: `id ${commentId}번 댓글은 삭제되었습니다.`,
  });
});

// 댓글 수정(PUT): /comments/:commentId => author, contents만 수정 가능
app.put("/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { author, contents } = req.body;

  const [result] = await pool.execute(
    "UPDATE comments SET author = ?, contents = ? WHERE id = ?",
    [author, contents, commentId]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({
      message: `${commentId}번의 댓글이 없습니다!`,
    });
  }

  return res.status(200).json({
    message: `id ${commentId}번 댓글이 수정되었습니다.`,
  });
});

app.listen(3000, () => {
  console.log("게시판 서버 ON!!");
});
