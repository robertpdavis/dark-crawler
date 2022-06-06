let selectedCharacter="";
let character = $(".characters");
let goBtn = $("#btn-search");

function selectCharacter(event){
    let clickedChar = $(event.target);
    let myChar;

    if($(this).attr('data-click-state') == 1)
    {
        myChar=  $(this).attr('data-my-character')
    }
    for (let i=0; i <=character.children.length; i++)
    {
        let allDivsInside = $(character[0].children[i].children[1]);
        allDivsInside.removeClass("selected");
        if (allDivsInside.attr('data-my-character')!==myChar)
            {allDivsInside.attr('data-click-state',0)}
    }

    if($(this).attr('data-click-state') == 1)
    {
        $(this).attr('data-click-state',0)
        clickedChar.removeClass("selected")
    }
    else
    {
        clickedChar.addClass("selected")
        $(this).attr('data-click-state',1);
    }
    selectedCharacter =  $(this).attr('data-my-character');
};

const saveCharacter = async () => {
    const response = await fetch('/gamestart', {
        method: 'POST',
        body: JSON.stringify({ selectedCharacter }),
        headers: { 'Content-Type': 'application/json' },
    })
    
    if (response.ok)
    {
        location.replace('/gamestart')
        return;
    }
    const result = await response.json();
    showModal(result.title, result.message);
}

character.on("click", ".single",  selectCharacter);
goBtn.on('click', saveCharacter);
