const successCode = (res, data, message) => {
  res.status(200).json({
    message,
    content: data,
  });
};

const failCode = (res, data, message) => {
  res.status(401).json({
    message,
    data,
  }).end();
};

const errorCode = (res, message) => {
  res.status(500).send(message);
};

module.exports = {
  successCode,
  failCode,
  errorCode,
};
