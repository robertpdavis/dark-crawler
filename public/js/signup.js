
const doCheck = async (event) =>{
    event.preventDefault();

    var fullname = document.querySelector("#fullname").value;
    var email = document.querySelector("#email").value;
    var password = document.querySelector("#password").value;
    var confirmPassword = document.querySelector("#confirm-password").value;

    if (password!=confirmPassword)
    {
        alert("Password doesnt match!");
        return;
    }

    if (fullname && email) {
        const response = await fetch('/signup', {
        method: 'POST',
        body: JSON.stringify({ fullname, email, password }),
        headers: { 'Content-Type': 'application/json' },
    })
        
        if (!response.ok) {
            alert('Failed to sign up.');
            return;
        }
        console.log(response)
        location.replace('/dashboard');
            
    }
    else{
        alert("Please complete all the details.");
    }
}

document
  .querySelector('.signup-form')
  .addEventListener('submit', doCheck);