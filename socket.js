const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("./src/models/User");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  const onlineUsers = new Map();

 
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("No token"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) return next(new Error("User not found"));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.user.name);


    onlineUsers.set(socket.user._id.toString(), socket.id);

    io.emit("onlineUsers", Array.from(onlineUsers.keys()));

    
    socket.join(socket.user._id.toString());

 
    socket.on("noteUpdated", (data) => {
      socket.to(socket.user._id.toString()).emit("noteUpdated", data);
    });

  
    socket.on("disconnect", () => {
      onlineUsers.delete(socket.user._id.toString());
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      console.log("User disconnected:", socket.user.name);
    });
  });
};
