document.getElementById("loginForm").addEventListener("submit", function(e){

e.preventDefault()

let user = document.getElementById("username").value
let pass = document.getElementById("password").value

if(user === "admin" && pass === "1234"){

window.location.href = "complaint.html"

}else{

alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง")

}

})