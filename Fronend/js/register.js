document.getElementById("registerForm").addEventListener("submit", function(e){

    e.preventDefault()

    const username = document.getElementById("username").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const confirmPassword = document.getElementById("confirmPassword").value

    if(password !== confirmPassword){
        alert("รหัสผ่านไม่ตรงกัน")
        return
    }

    alert("สมัครสมาชิกสำเร็จ")

})
document.getElementById("registerForm").addEventListener("submit", function(e){

    e.preventDefault()

    alert("สมัครสมาชิกสำเร็จ")

})