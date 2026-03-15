function checkStatus(){

let id=document.getElementById("searchId").value

if(id=="1"){
document.getElementById("result").innerHTML="กำลังดำเนินการ"
}else{
document.getElementById("result").innerHTML="ไม่พบข้อมูล"
}

}