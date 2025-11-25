import express from "express";
import dotenv from "dotenv";
import movieRoutes from "./src/routes/movie.routes.js";
import reviewRoutes from "./src/routes/review.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import { responseMiddleware } from "./src/middleware/response.middleware.js";
import { setupSwagger } from "./src/docs/swagger.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3001",
  })
);
app.use(express.json());
app.use(responseMiddleware);

// 라우터
app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);
app.use("/reviews", reviewRoutes);

setupSwagger(app);

app.listen(PORT, () => {
  console.log(`Final 서버가 포트 ${PORT}번에서 실행 중입니다.`);
  console.log(`API 엔드포인트: http://localhost:${PORT}`);
});
