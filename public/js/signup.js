// var myModal = new bootstrap.Modal(document.getElementById("eModal"), {});

const doCheck = async (event) =>{
    event.preventDefault();

    var fullname = document.querySelector("#fullname").value;
    var email = document.querySelector("#email").value;
    var password = document.querySelector("#password").value;
    var confirmPassword = document.querySelector("#confirm-password").value;

    if (password!=confirmPassword)
    {
        showModal('Password Error','Password does not match, make sure you enter both the password same (min length 8 characters).');
        return;
    }

    if (fullname && email) {
        const response = await fetch('/api/users/signup', {
        method: 'POST',
        body: JSON.stringify({ fullname, email, password }),
        headers: { 'Content-Type': 'application/json' },
    })
        
        if (!response.ok) {
            showModal('Error','Error signing up, please check your details and try again.');
            return;
        }
        location.replace('/dashboard');
            
    }
    else{
        showModal('Incomplete details','Please complete the form data and press Create Account button.');
    }
}

// function showModal(title, error){
//     let modalTitle = document.getElementById("eModalTitle");
//     let modalBody = document.getElementById('eModalBody');
//     modalBody.textContent = error;
//     modalTitle.textContent = title;
//     myModal.show();
//   }

document
  .querySelector('.signup-form')
  .addEventListener('submit', doCheck);