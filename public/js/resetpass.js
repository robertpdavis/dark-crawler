//const res = require("express/lib/response");

var newUser = document.querySelector("#new-user");

newUser.addEventListener("click", createUser);

function createUser(event){
    event.preventDefault();
    document.location.replace('/signup');
    //alert("helloworld");
}

const resetFormHandler = async (event) => {
    event.preventDefault();
  
    const email = document.querySelector('#email-address').value.trim();
    const password = document.querySelector('#password').value.trim();
    const resetcode = document.querySelector('#reset-code').value.trim();
    const confirmPassword = document.querySelector("#confirm-password").value;
    const reseterror = document.querySelector('#reset-error');
    if (password!=confirmPassword)
    {
        reseterror.textContent= "Password doesnt match!";
        return;
    }

    
    if (email && password && resetcode) {
      const response = await fetch('/api/users/resetpass', {
        method: 'PUT',
        body: JSON.stringify({ email, password, resetcode}),
        headers: { 'Content-Type': 'application/json' },
      });
  
      console.log(response);
      const result = await response.json();
      console.log(result);
      if (response.ok) {
            reseterror.textContent="Password Change Successfully."
            setInterval(()=>{
              location.replace('/login');
            },2000)
      } else {
        
        if (result.tries>0)
        {
          reseterror.textContent= result.message + " - " + result.tries + " attempts remaining." ;
        }
        else{
          reseterror.textContent= result.message;
        }
        if(result.stutus==="Done")
        {
          setInterval( () => {
            location.replace('/login');
          }, 2000)
        }
    }
  }
  else{
      
      reseterror.textContent="Please complete the details above."
      
    }
  };




document
  .querySelector('.reset-form')
  .addEventListener('submit', resetFormHandler);