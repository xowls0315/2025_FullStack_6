export const responseMiddleware = (req, res, next) => {
  // 성공 응답
  res.success = (data = null, statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      data,
    });
  };

  // 아래부터는 express-boom 래핑 (실제 응답은 res.boom.* 가 처리)
  res.validationError = (message = "입력 데이터가 유효하지 않습니다.") => {
    return res.boom.badRequest(message);
  };

  res.unAuthorized = (message = "로그인이 필요합니다.") => {
    return res.boom.unauthorized(message);
  };

  res.notFound = (message = "요청하신 리소스를 찾을 수 없습니다.") => {
    return res.boom.notFound(message);
  };

  res.conflict = (message = "리소스가 이미 존재합니다.") => {
    return res.boom.conflict(message);
  };

  next();
};
