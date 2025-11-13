const express = require("express");
const app = express();
const { feeds, comments } = require("./data");
const { v4 } = require("uuid");
const cors = require("cors");

// JSON 본문 파싱 가능하게 해줌
app.use(express.json());
// HTML form에서 전송된 데이터를 서버에서 읽을 수 있도록 옵션 설정 true
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  return res.send("<h1>트위터에 오신걸 환영합니다!</h1>");
});

// 트윗 전체 조회(GET): /feeds => 전체 트윗 리스트
app.get("/feeds", (req, res) => {
  // 쿼리가 없으면 전체 리스트 반환
  return res.json(feeds);
});

// 트윗 특정 조회(GET): /feeds/:feedId => id로 단일 트윗 정보 조회
// - 없는 경우 404
app.get("/feeds/:feedId", (req, res) => {
  const { feedId } = req.params; // URL에서 id 추출
  const targetIndex = feeds.findIndex((v) => v.id == feedId);
  if (targetIndex == -1) {
    res.status(404).json({
      message: `${feedId}번의 트윗은 없습니다!`,
    });
    return;
  }

  return res.status(200).json(feeds[targetIndex]);
});

// 트윗 등록(POST): /feeds => author, content 등록 (+ id와 createdAt은 자동부여)
app.post("/feeds", (req, res) => {
  const { author, content } = req.body;

  if (!author || !content) {
    return res.status(400).json({
      error: "작성자(author), 내용(content)을 모두 입력해야 합니다.",
    });
  }

  if (feeds.some((v) => v.author === author)) {
    return res.status(409).json({
      error: `이미 '${author}'이라는 이름의 작성자가 존재합니다.`,
    });
  }

  const newFeed = {
    id: v4(),
    author,
    content,
    createdAt: new Date(),
  };

  feeds.push(newFeed);

  return res.status(201).json({
    message: `'${author}'의 새로운 트윗이 추가되었습니다!`,
    newFeed,
  });
});

// 트윗 삭제(DELETE): /feeds/:feedId
// - splice() 활용
app.delete("/feeds/:feedId", (req, res) => {
  const { feedId } = req.params;
  const targetIndex = feeds.findIndex((v) => v.id == feedId);
  if (targetIndex == -1) {
    res.status(404).json({
      message: `${feedId}번의 트윗은 없습니다!`,
    });
    return;
  }
  const [deletedFeed] = feeds.splice(targetIndex, 1);

  // // ✅ 남은 항목들 id를 0부터 재정렬 (현재 순서를 기준으로)
  // feeds.forEach((item, i) => (item.id = i));

  // console.log(feeds);

  return res.status(200).json({
    message: `id ${feedId}번 '${deletedFeed.author}' 작성자의 피드가 삭제되었습니다.`,
    deleted: deletedFeed,
  });
});

// 트윗 내용 수정(PUT): /feeds/:feedId => author, content만 수정 가능
app.put("/feeds/:feedId", (req, res) => {
  const { feedId } = req.params;
  const targetIndex = feeds.findIndex((v) => v.id == feedId);
  if (targetIndex == -1) {
    res.status(404).json({
      message: `${feedId}번의 게시물은 없습니다!`,
    });
    return;
  }

  // 트윗의 author나 content를 바꿀 수 있는 로직 구성하기
  const { author, content } = req.body;
  feeds[targetIndex].author = author || feeds[targetIndex].author;
  feeds[targetIndex].content = content || feeds[targetIndex].content;
  feeds[targetIndex].createdAt = new Date();

  return res.status(200).json({
    message: `id ${feeds[targetIndex].id}번 트윗 정보가 수정되었습니다.`,
    updated: feeds[targetIndex],
  });
});

// 특정 트윗에 댓글 등록(POST): /feeds/:feedId/comments => author, content 등록 (+ id와 createdAt은 자동부여)
app.post("/feeds/:feedId/comments", (req, res) => {
  const { feedId } = req.params;
  const { author, content } = req.body;

  if (!author || !content) {
    res
      .status(400)
      .json({ message: "작성자(author)나 내용(content)를 입력해주세요!" });
    return;
  }

  const target = feeds.findIndex((v) => v.id == feedId);
  if (target == -1) {
    res.status(404).json({ message: "해당 피드는 존재하지 않습니다." });
    return;
  }

  comments.push({
    id: v4(),
    feedId,
    author,
    content,
    createdAt: new Date(),
  });

  return res.status(201).json({ message: "댓글이 생성되었습니다!" });
});

// 특정 트윗의 댓글 조회(GET): /feeds/:feedId/comments => feedId로 특정 트윗의 댓글 조회
// - 없는 경우 404
app.get("/feeds/:feedId/comments", (req, res) => {
  const { feedId } = req.params;
  const targetIndex = feeds.findIndex((v) => v.id == feedId);
  if (targetIndex == -1) {
    res.status(404).json({
      message: `해당 피드는 없습니다!`,
    });
    return;
  }

  const targets = comments.filter((v) => v.feedId == feedId);
  return res.status(200).json(targets);
});

// 댓글 삭제(DELETE): /comments/:commentId
// - splice() 활용
app.delete("/comments/:commentId", (req, res) => {
  const { commentId } = req.params;
  const targetIndex = comments.findIndex((v) => v.id == commentId);
  if (targetIndex == -1) {
    res.status(404).json({
      message: `${commentId}번의 작성자의 댓글은 없습니다!`,
    });
    return;
  }
  const [deletedComment] = comments.splice(targetIndex, 1);

  return res.status(200).json({
    message: `id ${commentId}번 '${deletedComment.author}' 작성자의 댓글이 삭제되었습니다.`,
    deleted: deletedComment,
  });
});

// 댓글 수정(PUT): /comments/:commentId => author, content만 수정 가능
app.put("/comments/:commentId", (req, res) => {
  const { commentId } = req.params;
  const targetIndex = comments.findIndex((v) => v.id == commentId);
  if (targetIndex == -1) {
    res.status(404).json({
      message: `${commentId}번의 작성자의 댓글은 없습니다!`,
    });
    return;
  }

  // 댓글의 author나 content를 바꿀 수 있는 로직 구성하기
  const { author, content } = req.body;
  comments[targetIndex].author = author || comments[targetIndex].author;
  comments[targetIndex].content = content || comments[targetIndex].content;
  comments[targetIndex].createdAt = new Date();

  return res.status(200).json({
    message: `id ${commentId}번 댓글 정보가 수정되었습니다.`,
    updated: comments[targetIndex],
  });
});

app.listen(3000, () => {
  console.log("Twitter World 실행중~!");
});
