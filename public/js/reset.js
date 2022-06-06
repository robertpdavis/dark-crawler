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
    const err = document.querySelector('#reset-error');

    if (email) {
      const response = await fetch('/api/users/reset', {
        method: 'PUT',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      console.log(response);
      if (response.ok) {
            err.textContent="Email Sent."
            setInterval(()=>{
              location.replace('/resetpass')
            },2000)
      } else {
        alert("Error");
        err.textContent="Error."
      }
    }
    else{
      err.textContent="Enter email."
    }
  };




document
  .querySelector('.reset-form')
  .addEventListener('submit', resetFormHandler);