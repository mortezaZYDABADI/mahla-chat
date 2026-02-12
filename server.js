const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.static("public"));

const server = http.createServer(app);
const io = socketIo(server);

let users = {};
let leader = null;

io.on("connection", (socket) => {

  socket.on("register", (user) => {
    users[socket.id] = {
      ...user,
      warnings: 0,
      muted: false
    };

    if (!leader) leader = socket.id;

    io.emit("users", users);
    socket.emit("welcome", 
      `سلام ${user.name}! به چت روم مهلا خوش آمدید. لطفا ادب را رعایت کنید و با هم چت کنید.`
    );
  });

  socket.on("message", (msg) => {
    if (users[socket.id]?.muted) return;

    io.emit("message", {
      id: socket.id,
      user: users[socket.id],
      text: msg
    });
  });

  socket.on("warn", (id) => {
    if (socket.id === leader && users[id]) {
      users[id].warnings++;
      if (users[id].warnings >= 3) {
        users[id].muted = true;
        setTimeout(() => {
          users[id].muted = false;
          users[id].warnings = 0;
        }, 180000);
      }
    }
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("users", users);
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Mahla Chat running...");
});
