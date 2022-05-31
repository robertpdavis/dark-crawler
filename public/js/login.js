var newUser = document.querySelector("#new-user");

newUser.addEventListener("click", createUser);

function createUser(event){
    event.preventDefault();
    document.location.replace('/signup');
    //alert("helloworld");
}

const loginFormHandler = async (event) => {
    event.preventDefault();
  
    const email = document.querySelector('#email-address').value.trim();
    const password = document.querySelector('#password').value.trim();

    if (email && password) {
      const response = await fetch('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      console.log(response);
      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        alert('Failed to log in.');
      }
    }
    else{
      alert("Please provide username and password");
    }
  };




document
  .querySelector('.login-form')
  .addEventListener('submit', loginFormHandler);