const {addNewUser, removeUser, getUser} = require("../index"); 

module.exports = (io) => {
  const chat_app = async (socket) => {
      //send and get message
      socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        io.to(user.socketId).emit("getMessage", {
          senderId,
          text,
        });
      });

  };
  return { chat_app };
};
