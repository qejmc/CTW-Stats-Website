const key = process.env.KEY;

function checkEnterClick(e){
    if(e.keyCode == 13){
        getInput();
    }
 }


function getInput(){
    var ign = document.getElementById("ign").value;
    if(ign == ""){
        return;
    }
    console.log(ign);
    resetDisplay();
    fetchMojangData(ign);
}


//Adds comma conventions to raw output
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}


function resetDisplay(){
    // Removes previous query from search bar element
    document.getElementById("ign").remove();
    document
        .querySelector(".grayBox")
        .insertAdjacentHTML("beforebegin", `
            <input type="text" id="ign" class="inputField" placeholder="Enter a username..." onkeypress='checkEnterClick(event)'>
        `);
    // Removes previous display element and creates a new (blank) one
    document.getElementById("display").remove();
    document
        .querySelector(".grayBox")
        .insertAdjacentHTML("afterbegin", `
            <div id="display" class="displayBox"></div>
        `);
}


function fetchMojangData(ign){
    console.log(ign)
    // Uses third party API due to mojang CORS header missing
    fetch(`https://api.ashcon.app/mojang/v2/user/${ign}`)
        .then(response => {
            if(!response.ok){
                throw Error("Failed Mojang Request");
            }
            return response.json();
        }).then(data => {
            const uuid = data.uuid;
            //csIgn: Case Sensitive Ign
            const csIgn = data.username
            fetchHypixelData(uuid, csIgn);
        }).catch(error => {
            console.log(error);
        });
}


function fetchHypixelData(uuid, ign){
    console.log(uuid)
    fetch(`https://api.hypixel.net/player?uuid=${uuid}&key=${key}`)
        .then(response => {
            if(!response.ok){
                throw Error("Failed Hypixel Request");
            }
            return response.json();
        }).then(data => {

            //Statistics handler
            var kills = data.player.achievements.arcade_ctw_slayer;
            var caps = data.player.achievements.arcade_ctw_oh_sheep;

            kills = formatNumber(kills);
            caps = formatNumber(caps);

            //Achievement handler
            var ach = ["arcade_ctw_comeback", "arcade_ctw_mvp", "arcade_ctw_no_need",
                        "arcade_ctw_ninja", "arcade_ctw_fashionably_late", "arcade_ctw_first",
                        "arcade_ctw_i_can_be_anything", "arcade_ctw_hey_there",
                        "arcade_ctw_right_place_right_time", "arcade_ctw_safety_is_an_illusion",
                        "arcade_ctw_magician"
                        ];
            var achStatus = [];
            for(var x = 0; x < 11; x++){
                if(data.player.achievementsOneTime.includes(ach[x])){
                    achStatus[x] = "fa fa-check-square fa-lg";
                }
                else{
                    achStatus[x] = "fa fa-square-o fa-lg";
                }
            }

            //Kills
            document
                .querySelector("#display")
                .insertAdjacentHTML("afterbegin", `
                <div id="kills" class="outputFields">
                    <div class="outputFieldsInner">
                        <img src="sword.png" alt="sword_icon" class="icon">
                        <a>Kills + Assists: ${kills}</a>
                    </div>
                </div>
                `);
            
            //Caps (Displays 1st) TODO: Fix unintuitive structure
            document
                .querySelector("#display")
                .insertAdjacentHTML("afterbegin", `
                <h1 class="containerHeader">Statistics for ${ign}</h1>
                <div id="caps" class="outputFields">
                    <div class="outputFieldsInner">
                        <img src="orange_wool.png" alt="wool_icon" class="icon">
                        <a>Wool Captures: ${caps}</a>
                    </div>
                </div>
                <br></br>
                `);
            
            //Achievements
            document
                .querySelector("#display")
                .insertAdjacentHTML("beforeend", `
                <h1 class="containerHeader">Achievements</h1>
                <div id="ach" class="outputFields">
                    <div class="outputFieldsInner">
                        <i class="${achStatus[0]}" aria-hidden="true" id="checks"></i>
                        Comeback
                        <br></br>
                        <i class="${achStatus[1]}" aria-hidden="true" id="checks"></i>
                        MVP
                        <br></br>
                        <i class="${achStatus[2]}" aria-hidden="true" id="checks"></i>
                        No need, bro
                        <br></br>
                        <i class="${achStatus[3]}" aria-hidden="true" id="checks"></i>
                        Ninja
                        <br></br>
                        <i class="${achStatus[4]}" aria-hidden="true" id="checks"></i>
                        Fashionably late
                        <br></br>
                        <i class="${achStatus[5]}" aria-hidden="true" id="checks"></i>
                        First
                        <br></br>
                        <i class="${achStatus[6]}" aria-hidden="true" id="checks"></i>
                        I can be anything
                        <br></br>
                        <i class="${achStatus[7]}" aria-hidden="true" id="checks"></i>
                        Hey there
                        <br></br>
                        <i class="${achStatus[8]}" aria-hidden="true" id="checks"></i>
                        Right place, right time
                        <br></br>
                        <i class="${achStatus[9]}" aria-hidden="true" id="checks"></i>
                        Safety is an illusion
                        <br></br>
                        <i class="${achStatus[10]}" aria-hidden="true" id="checks"></i>
                        Magician
                        <br></br>
                    </div>
                </div>
                <br></br>
                `);

            //Leaderboards
            document
                .querySelector("#display")
                .insertAdjacentHTML("beforeend", `
                <h1 class="containerHeader">Leaderboard Positions</h1>
                <div class="lb">
                    <div id="caps" class="lbOutputFields">
                        <div class="outputFieldsInner2">
                            <p class="lbHeader">Wool Captures:</p>
                            <p>-2</p>
                            <p>-1</p>
                            <p>#x ${ign}</p>
                            <p>+1</p>
                            <p>+2</p>
                        </div>
                    </div>
                    <br></br>
                    <div id="caps" class="lbOutputFields">
                        <div class="outputFieldsInner2">
                            <p class="lbHeader">Kills + Assists:</p>
                            <p>-2</p>
                            <p>-1</p>
                            <p>#x ${ign}</p>
                            <p>+1</p>
                            <p>+2</p>
                        </div>
                    </div>
                    <br></br>
                    <div id="caps" class="lbOutputFields">
                        <div class="outputFieldsInner2">
                            <p class="lbHeader">Kdr:</p>
                            <p>-2</p>
                            <p>-1</p>
                            <p>#x ${ign}</p>
                            <p>+1</p>
                            <p>+2</p>
                        </div>
                    </div>
                    <br></br>
                    <div id="caps" class="lbOutputFields">
                        <div class="outputFieldsInner2">
                            <p class="lbHeader">Wins:</p>
                            <p>-2</p>
                            <p>-1</p>
                            <p>#x ${ign}</p>
                            <p>+1</p>
                            <p>+2</p>
                        </div>
                    </div>
                    <br></br>
                </div>
                `);
        }).catch(error => {
            console.log(error);
        });
}