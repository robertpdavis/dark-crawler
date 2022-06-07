var newUser = document.querySelector("#new-user");
// var myModal = new bootstrap.Modal(document.getElementById("eModal"), {});

newUser.addEventListener("click", createUser);

// function showModal(title, error){
//   let modalTitle = document.getElementById("eModalTitle");
//   let modalBody = document.getElementById('eModalBody');
//   modalBody.textContent = error;
//   modalTitle.textContent = title;
//   myModal.show();
// }

function createUser(event){
    event.preventDefault();
    document.location.replace('/signup');
}

const loginFormHandler = async (event) => {
    event.preventDefault();
  
    const email = document.querySelector('#email-address').value.trim();
    const password = document.querySelector('#password').value.trim();

    if (email && password) {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      
      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        const result = await response.json();
        showModal(result.title,result.message);
      }
    }
    else{
      showModal('Incomplete details','Please provide username and password');
    }
  };




document
  .querySelector('.login-form')
  .addEventListener('submit', loginFormHandler);