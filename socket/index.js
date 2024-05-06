import { Server } from "socket.io";

const io = new Server({ cors: { origin: "http://localhost:5173" } });
let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("new connection: ", socket.id);

  //listen to a new connection
  socket.on("addNewUser", (userId, userName) => {
    if (!userId) return;
    if (!onlineUsers.some((user) => user.userId === userId)) {
      onlineUsers.push({
        userName,
        userId,
        socketId: socket.id,
      });
    }
    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("sendMessage", (data) => {
    const onlineRecipient = onlineUsers.find(
      (user) => user.userId === data.recipientId
    );
    // if user online we send the message to them
    if (onlineRecipient) {
      io.to(onlineRecipient.socketId).emit("getMessage", data.newMessage);
      io.to(onlineRecipient.socketId).emit("getNotification", {
        senderId: data.newMessage.senderId,
        isRead: false,
        date: data.newMessage.createdAt,
      });
    }
  });
});

io.listen(3000);
