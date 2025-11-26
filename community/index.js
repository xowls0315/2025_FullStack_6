import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import boom from "express-boom";
import { isCelebrateError } from "celebrate";
import { responseMiddleware } from "./src/middleware/response.middleware.js";
import authRoutes from "./src/routes/auth.routes.js";
import postRoutes from "./src/routes/post.routes.js";
import commentRoutes from "./src/routes/comment.routes.js";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(cookieParser());
app.use(express.json());
app.use(boom());
app.use(responseMiddleware);
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

// 라우터
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/", commentRoutes);

app.get("/", (req, res) => {
  res.success({ message: "Community API alive" });
});

// 🔻🔻 celebrate 에러를 express-boom 형식으로 변환
app.use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    // 여러 세그먼트(body, params...) 중 첫 번째 메시지만 뽑기
    const details = [...err.details.values()][0];
    const message = details?.message || "입력 데이터가 유효하지 않습니다.";
    return res.boom.badRequest(message);
  }
  // 다른 에러는 다음 에러 핸들러(or Express 기본 에러)로
  return next(err);
});

app.listen(PORT, () => {
  console.log(`COMMUNITY 서버가 포트 ${PORT}번에서 실행 중입니다.`);
  console.log(`API 엔드포인트: http://localhost:${PORT}`);
});
