
let pos = $("#test-show");
let gameGrid = $("#game-grid");
let playerRow="";
let playerCol="";
let oldPlayerRow="";
let oldPlayerCol="";


function findStartPos()
{
    for (let row=0; row< (gameGrid[0].children.length); row++)
    {
        let columns = $(gameGrid[0].children[row]);

        for (let col=0; col< columns[0].children.length; col++ )
        {
            let tile = $(columns[0].children[col]);
            // console.log(tile[0].dataset);
            if (tile[0].dataset.type==="player")
                {
                    playerCol=col;
                    playerRow=row;
                    //alert("player position at row " + row  + ", col: " + col)
                    return;
                    
                }
        }
        // console.log(columns[0].children.length);
    }
}

const movePos = async ()=>
{
    
    let nextTile = $(gameGrid[0].children[playerRow].children[playerCol].dataset);
    let type = nextTile[0].type;
    let refId = nextTile[0].refid;
    let title ="";
    const response = await fetch('/gamestart/'+playerRow+'/'+playerCol, {
        method: 'POST',
        body: JSON.stringify({ playerRow, playerCol, type, refId, oldPlayerCol, oldPlayerRow }),
        headers: { 'Content-Type': 'application/json' },
    })

    if(response.ok){
        let result=await response.json();
        console.log(result);
        // alert(result.game_status);
        let url="";
        if (type==="encounter")
        {
            url =  '<h6>' + result.returnValue.encounter_description + '</h6><img src="../images/encounter.gif" width=470>';
            title= result.returnValue.encounter_name;
        }
        else if(type==="reward")
        {
            url =  '<h6>' + result.returnValue.reward_description + '</h6><img src="../images/reward.gif" width=470>';
            title= result.returnValue.reward_name;
            // title = "Reward";
        }
        else{
                location.reload('/gamestart/'+result.game_id);
                return;
        }
        

        showModal(title, url)
        setInterval(()=>{

            if (result.game_status==="Over")
            {
                url =  '<h6>Better luck next time.</h6><img src="../images/gameover.gif" width=470>';
                showModal("Game Over", url)
                setInterval(()=>{
                    closeModal();
                    location.reload('/gamestart/'+result.game_id);
                },3000)
            }
            else
            {
                closeModal();
                location.reload('/gamestart/'+result.game_id);
            }
            
        },3000)

        
    }
    else{console.log(response)}
}


function userInput(event){
    oldPlayerCol=playerCol;
    oldPlayerRow=playerRow;

    switch  (event.keyCode)
    {
        case 38: //Up ArrowKey
            if (playerRow===0)
                {
                    alert("cant go further up");
                    return;
                }
                else{
                    playerRow--;
                    
                }
            break;
        case 37:    //Left ArrowKey
            if (playerCol===0)
            {
                alert("cant go further to left");
                return;
            }
            else{
                playerCol--;
                
            }
            break;
        case 39:    //Right ArrowKey
            if (playerCol===5)
            {
                alert("cant go further right");
                return;
            }
            else{
                playerCol++;
                
            }
            break;
        case 40:    //Down ArrowKey
            if (playerRow===4)
            {
                alert("cant go further down");
                return;
            }
            else{
                playerRow++;
                
            }
            break;
        default:
            return;
    }
    
    pos.text("Row " + playerRow + ", Col " + playerCol);
    movePos();
}

document.addEventListener('keydown', userInput);
findStartPos();
pos.text("Row " + playerRow + ", Col " + playerCol);
