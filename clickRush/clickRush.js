var room = "";
var gameStatus = 'selecting';

canChoosePlayer1 = false;
canChoosePlayer2 = false;
canChoosePlayer3 = false;
canChoosePlayer4 = false;

selectedPlayer = 0;
myHeight = 20;

canTeleport = true;
showLineNumbers = true;

isStarted = false;
isThisGameEnded = false;

function join() {
    selectedRoom = document.getElementById("roomInput").value;
    if (selectedRoom != "") {
        var roomref = firebase.database().ref("/clickRush/" + selectedRoom + "/status");
        var isRoomCreated;
        var isJoining = false;
        roomref.on("value", data => {
            isRoomCreated = data.val();
            if (!isJoining) {
                isJoining = true;
                if (isRoomCreated == "created") {
                    room = selectedRoom;
                    console.log('join successful');
                    openPlayerSelector();
                } else {
                    document.getElementById("error").innerHTML = "Room Not Found";
                }
            }
        });
    } else {
        document.getElementById("error").innerHTML = "Type the room to join in the input";
    }
}

function create() {
    selectedRoom = document.getElementById("roomInput").value;
    if (selectedRoom != "") {
        var roomref = firebase.database().ref("/clickRush/" + selectedRoom + "/status");
        var isRoomCreated;
        var isJoining = false;
        roomref.on("value", data => {
            isRoomCreated = data.val();
            if (!isJoining) {
                isJoining = true;
                if (isRoomCreated == null) {
                    room = selectedRoom;
                    firebase.database().ref("/clickRush/").child(selectedRoom).update({
                        status: 'created',
                        game: 'waiting'
                    });
                    console.log('creating successful');
                    openPlayerSelector();
                } else {
                    document.getElementById("error").innerHTML = "Room Already Exists";
                }
            }
        });
    } else {
        document.getElementById("error").innerHTML = "Type your room name in the input";
    }
}

function openPlayerSelector() {
    document.getElementById('roomSelector').style.visibility = 'hidden';
    document.getElementById('playerSelector').style.visibility = 'visible';
    firebase.database().ref("/clickRush/" + room + "/players/p1/isSelected").on("value", data => {
        isPlayerSelected = data.val();
        if (isPlayerSelected == null) {
            document.getElementById('p1btn').style.backgroundColor = "lawngreen";
            document.getElementById('p1btn').style.color = "blue";
            canChoosePlayer1 = true;
        }else{
            document.getElementById('p1btn').style.backgroundColor = "gray";
            document.getElementById('p1btn').style.color = "black";
            canChoosePlayer1 = false;
        }
    });
    firebase.database().ref("/clickRush/" + room + "/players/p2/isSelected").on("value", data => {
        isPlayerSelected = data.val();
        if (isPlayerSelected == null) {
            document.getElementById('p2btn').style.backgroundColor = "lawngreen";
            document.getElementById('p2btn').style.color = "blue";
            canChoosePlayer2 = true;
        }else{
            document.getElementById('p2btn').style.backgroundColor = "gray";
            document.getElementById('p2btn').style.color = "black";
            canChoosePlayer2 = false;
        }
    });
    firebase.database().ref("/clickRush/" + room + "/players/p3/isSelected").on("value", data => {
        isPlayerSelected = data.val();
        if (isPlayerSelected == null) {
            document.getElementById('p3btn').style.backgroundColor = "lawngreen";
            document.getElementById('p3btn').style.color = "blue";
            canChoosePlayer3 = true;
        }else{
            document.getElementById('p3btn').style.backgroundColor = "gray";
            document.getElementById('p3btn').style.color = "black";
            canChoosePlayer3 = false;
        }
    });
    firebase.database().ref("/clickRush/" + room + "/players/p4/isSelected").on("value", data => {
        isPlayerSelected = data.val();
        if (isPlayerSelected == null) {
            document.getElementById('p4btn').style.backgroundColor = "lawngreen";
            document.getElementById('p4btn').style.color = "blue";
            canChoosePlayer4 = true;
        }else{
            document.getElementById('p4btn').style.backgroundColor = "gray";
            document.getElementById('p4btn').style.color = "black";
            canChoosePlayer4 = false;
        }
    });
}

function selectPlayer(p) {
    if (p == 1 && canChoosePlayer1) {
        setWaitState();
        selectedPlayer = 1;
        firebase.database().ref("/clickRush/" + room + "/players/p1").update({
            isSelected: 'yes',
            height: 20
        });
        document.getElementById('loggerDiv').style.left = '110%';
        document.getElementsByTagName('body').item(0).style.overflowY = 'scroll';
        readGame();
    } else if (p == 2 && canChoosePlayer2) {
        setWaitState();
        selectedPlayer = 2;
        firebase.database().ref("/clickRush/" + room + "/players/p2").update({
            isSelected: 'yes',
            height: 20
        });
        document.getElementById('loggerDiv').style.left = '110%';
        document.getElementsByTagName('body').item(0).style.overflowY = 'scroll';
        readGame();
    } else if (p == 3 && canChoosePlayer3) {
        setWaitState();
        selectedPlayer = 3;
        firebase.database().ref("/clickRush/" + room + "/players/p3").update({
            isSelected: 'yes',
            height: 20
        });
        document.getElementById('loggerDiv').style.left = '110%';
        document.getElementsByTagName('body').item(0).style.overflowY = 'scroll';
        readGame();
    } else if (p == 4 && canChoosePlayer4) {
        setWaitState();
        selectedPlayer = 4;
        firebase.database().ref("/clickRush/" + room + "/players/p4").update({
            isSelected: 'yes',
            height: 20
        });
        document.getElementById('loggerDiv').style.left = '110%';
        document.getElementsByTagName('body').item(0).style.overflowY = 'scroll';
        readGame();
    } else if (p == 0) {
        setWaitState();
        document.getElementById('loggerDiv').style.left = '110%';
        document.getElementsByTagName('body').item(0).style.overflowY = 'scroll';
        readGame();
    }
}

function readGame() {
    document.getElementById("roomId").innerHTML = "Room: " + room;
    document.getElementById("selectedPlayer").innerHTML = "Player: " + selectedPlayer;
    firebase.database().ref("/clickRush/" + room + "/game").on("value", data => {
        gameStatus = data.val();
        document.getElementById("roomStatus").innerHTML = "Status: " + gameStatus;
        if (gameStatus == 'waiting') {
            document.getElementById("roomStatus").style.color = 'orange';
            isStarted = false;
            document.getElementById("startButton").innerHTML = "START";
            document.getElementById("startButton").style.backgroundColor = "lawngreen";
        } else if (gameStatus == 'running') {
            document.getElementById("roomStatus").style.color = 'lawngreen';
            document.getElementById("startButton").innerHTML = "Restart";
            document.getElementById("startButton").style.backgroundColor = "orange";
            isStarted = true;
        } else if (gameStatus == 'victorious') {
            document.getElementById("roomStatus").style.color = 'cyan';
            document.getElementById("startButton").innerHTML = "RESTART";
            document.getElementById("startButton").style.backgroundColor = "yellow";
            endGame();
            isStarted = true;
        } else if(gameStatus == 'reseting'){
            location.reload();
        }
    });
    firebase.database().ref("/clickRush/" + room + "/players/p1/height").on("value", data => {
        player1height = data.val();
        document.getElementById('1').style.height = String(player1height) + "px";
        if(showLineNumbers){
            document.getElementById("bottom1").innerHTML = "P1 - " + String(player1height);
        }else{
            document.getElementById("bottom1").innerHTML = "P1";
        }
        document.getElementById("bottom1").style.top = String(player1height - 20) + "px";
    });
    firebase.database().ref("/clickRush/" + room + "/players/p2/height").on("value", data => {
        player2height = data.val();
        document.getElementById('2').style.height = String(player2height) + "px";
        if(showLineNumbers){
            document.getElementById("bottom2").innerHTML = "P2 - " + String(player2height);
        }else{
            document.getElementById("bottom2").innerHTML = "P2";
        }
        document.getElementById("bottom2").style.top = String(player2height - 20) + "px";
    });
    firebase.database().ref("/clickRush/" + room + "/players/p3/height").on("value", data => {
        player3height = data.val();
        document.getElementById('3').style.height = String(player3height) + "px";
        if(showLineNumbers){
            document.getElementById("bottom3").innerHTML = "P3 - " + String(player3height);
        }else{
            document.getElementById("bottom3").innerHTML = "P3";
        }
        document.getElementById("bottom3").style.top = String(player3height - 20) + "px";
    });
    firebase.database().ref("/clickRush/" + room + "/players/p4/height").on("value", data => {
        player4height = data.val();
        document.getElementById('4').style.height = String(player4height) + "px";
        if(showLineNumbers){
            document.getElementById("bottom4").innerHTML = "P4 - " + String(player4height);
        }else{
            document.getElementById("bottom4").innerHTML = "P4";
        }
        document.getElementById("bottom4").style.top = String(player4height - 20) + "px";
    });
}

function clicked(who) {
    if (gameStatus == "running") {
        if (who == 1 && selectedPlayer == 1) {
            myHeight = myHeight + 10;
            firebase.database().ref("/clickRush/" + room + "/players/p1").update({
                height: myHeight
            });
            if (canTeleport) {
                window.location = "#bottom1";
            }
            if(myHeight == 3000){
                firebase.database().ref("/clickRush/" + room).update({
                    game:"victorious"
                });
            }
        } else if (who == 2 && selectedPlayer == 2) {
            myHeight = myHeight + 10;
            firebase.database().ref("/clickRush/" + room + "/players/p2").update({
                height: myHeight
            });
            if (canTeleport) {
                window.location = "#bottom2";
            }
            if(myHeight == 3000){
                firebase.database().ref("/clickRush/" + room).update({
                    game:"victorious"
                });
            }
        } else if (who == 3 && selectedPlayer == 3) {
            myHeight = myHeight + 10;
            firebase.database().ref("/clickRush/" + room + "/players/p3").update({
                height: myHeight
            });
            if (canTeleport) {
                window.location = "#bottom3";
            }
            if(myHeight == 3000){
                firebase.database().ref("/clickRush/" + room).update({
                    game:"victorious"
                });
            }
        } else if (who == 4 && selectedPlayer == 4) {
            myHeight = myHeight + 10;
            firebase.database().ref("/clickRush/" + room + "/players/p4").update({
                height: myHeight
            });
            if (canTeleport) {
                window.location = "#bottom4";
            }
            if(myHeight == 3000){
                firebase.database().ref("/clickRush/" + room).update({
                    game:"victorious"
                });
            }
        }
    }
}

function startPlay(){
 if(!isStarted){
    firebase.database().ref("/clickRush/" + room).update({
        game:"running"
    });
 }else{
    firebase.database().ref("/clickRush/" + room).update({
        game:"reseting"
    });
    firebase.database().ref("/clickRush/" + room).update({
        players:null
    });
 }
}

function setWaitState(){
    firebase.database().ref("/clickRush/" + room).update({
        game:"waiting"
    });
}

//extra config
function showTp(){
    if(canTeleport){
        canTeleport = false;
        document.getElementById("toggleTp").innerHTML = "Off";
        document.getElementById("toggleTp").style.backgroundColor = "red";
    }else{
        canTeleport = true;
        document.getElementById("toggleTp").innerHTML = "On";
        document.getElementById("toggleTp").style.backgroundColor = "chartreuse";
    }
}
function showNumbers(){
    if(showLineNumbers){
        showLineNumbers = false;
        document.getElementById("toggleNumber").innerHTML = "Off";
        document.getElementById("toggleNumber").style.backgroundColor = "red";
    }else{
        showLineNumbers = true;
        document.getElementById("toggleNumber").innerHTML = "On";
        document.getElementById("toggleNumber").style.backgroundColor = "chartreuse";
    }
}
function endGame(){
    if(!isThisGameEnded){
        isThisGameEnded = true;
        window.location = "#EndLine";
        document.getElementById("endShow").style.visibility = "visible";
    }
}

function verifyMobile() {
    var testMobile = /iPhone|Android|iPad/i.test(navigator.userAgent)
    if (testMobile) {
       document.getElementById('header').style.marginTop = '-80px';
       document.getElementById('header').style.marginLeft = '-5%';
    }
}