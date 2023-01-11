const get_User = require("../../src/index"); 

module.exports = (io) => {
  const chat_app = async (socket) => {
      //send and get message
      socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = get_User.getUser(receiverId);
        io.to(user.socketId).emit("getMessage", {
          senderId,
          text,
        });
      });

  };
  return { chat_app };
};
