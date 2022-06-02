const moveButtonHandler = async (event) => {
    event.preventDefault();
  
    const response = await fetch('/api/game/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
    


    } else {
    const result = await response.json();
    showModal(result.title,result.message);
    }

  };

  const newButtonHandler = async (event) => {
    event.preventDefault();
  
    const response = await fetch('/api/game/new', {
    method: 'POST',
    // body:'',
    headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
    


    } else {
    const result = await response.json();
    showModal(result.title,result.message);
    }

  };



if(document.querySelector('#next-move')){
document
  .querySelector('#next-move')
  .addEventListener('click', moveButtonHandler);
}
if(document.querySelector('#new-game')){
  document
  .querySelector('#new-game')
  .addEventListener('click', newButtonHandler);
}