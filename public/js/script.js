var btnStart = document.querySelector("#btn-start");

btnStart.addEventListener("click",gameStart);

function gameStart(event){
    event.preventDefault();
    document.location.replace('/dashboard');
    //alert("helloworld");
}