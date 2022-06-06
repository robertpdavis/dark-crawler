var myModal = new bootstrap.Modal(document.getElementById("eModal"), {});

function showModal(title, error){
    let modalTitle = document.getElementById("eModalTitle");
    let modalBody = document.getElementById('eModalBody');
    // modalBody.textContent = error;
    modalBody.innerHTML = error;
    modalTitle.textContent = title;
    myModal.show();
  }

function closeModal(){
  myModal.hide();
}