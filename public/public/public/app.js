const socket = io();

let name = prompt("نام شما چیست؟");
socket.emit("register", { name });

socket.on("welcome", msg => alert(msg));

socket.on("users", users => {
  const div = document.getElementById("users");
  div.innerHTML = "";
  Object.values(users).forEach(u => {
    div.innerHTML += `<div>${u.name}</div>`;
  });
});

socket.on("message", data => {
  const div = document.createElement("div");
  div.innerHTML = `<b>${data.user.name}:</b> ${data.text}`;
  document.getElementById("messages").appendChild(div);
});

function sendMsg(){
  const input = document.getElementById("msgInput");
  socket.emit("message", input.value);
  input.value="";
}
