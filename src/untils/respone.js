const successCode = (res, data, message) => {
  res.status(200).json({
    message,
    content: data,
  });
};

const failCode = (res, data, message) => {
  res.status(400).json({
    message,
    content: data,
  });
};

const errorCode = (res, message) => {
  res.status(500).send(message);
};

module.exports = {
  successCode,
  failCode,
  errorCode,
};
