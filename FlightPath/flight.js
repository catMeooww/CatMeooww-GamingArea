logged = false;

isPaused = false;
lowUpdates = 0;
targetY = 0;

onlinePlayers = [];
thismap = [];
player = "";
room = "";

playerS = 0;
playerX = 0;
playerY = 200;
velocityX = 0;
velocityY = 0;

gameWidth = window.innerWidth - 30;
gameHeight = 400;

function joinRoom() {
    room = document.getElementById("room-name").value;
    player = document.getElementById("player-name").value;
    if (room != "" && player != "") {
        firebase.database().ref("/FlightPath/" + room + "/status/").once('value', data => {
            if (data.val() == "online") {
                startPlay();
            } else {
                document.getElementById("room-name").style.borderColor = "red";
            }
        })
    } else {
        document.getElementById("room-name").style.borderColor = "yellow";
        document.getElementById("player-name").style.borderColor = "yellow";
    }
}

function createRoom() {
    room = document.getElementById("room-name").value;
    player = document.getElementById("player-name").value;
    if (room != "" && player != "") {
        firebase.database().ref("/FlightPath/" + room + "/status/").once('value', data => {
            if (data.val() == "online") {
                document.getElementById("room-name").style.borderColor = "red";
            } else {
                map = generateMap();
                firebase.database().ref("/FlightPath/" + room).update({
                    status: "online",
                    level: map
                });
                startPlay();
            }
        })
    } else {
        document.getElementById("room-name").style.borderColor = "yellow";
        document.getElementById("player-name").style.borderColor = "yellow";
    }
}

async function startPlay() {
    await firebase.database().ref("/FlightPath/" + room + "/players/" + player).update({
        x: 0,
        y: 200,
        s: 0,
        color: color
    });
    await firebase.database().ref("/FlightPath/" + room + "/level/").once('value', function (snapshot) {
        thismap = [];
        snapshot.forEach(function (childSnapshot) {
            childKey = childSnapshot.key; childData = childSnapshot.val();
            thismap.push(childData);
        });
    })
    firebase.database().ref("/FlightPath/" + room + "/players/").on('value', function (snapshot) {
        thisPlayers = [];
        snapshot.forEach(function (childSnapshot) {
            childKey = childSnapshot.key; childData = childSnapshot.val();
            thisPlayers.push([childKey, childData["x"], childData["y"], childData["s"], childData["color"]])
        });
        onlinePlayers = thisPlayers;
    })
    logged = true;

    document.getElementById("connection").innerHTML = "Flying in " + room + " as " + player;
    document.getElementById("pauseBTN").innerHTML = "PAUSE GAME";
    document.getElementById("leaveBTN").innerHTML = "RESPAWN";

    shootBtn = "<button id='shootbtn' onclick='shoot()'>1- Shoot (not yet)</button>";
    useBtn = "<button id='usebtn' onclick='use()'>2- Use</button>";
    resetBtn = "<button id='resetbtn' onclick='resetmap()'>Reset Room</button>";
    buttondiv = "<div id='button-div'>" + shootBtn + useBtn + resetBtn + "</div>";
    datadiv = "<div id='data-div'></div>";
    document.getElementById("control-div").innerHTML = buttondiv + datadiv;
}

function preload() {
    bgImg = loadImage("citybg.png")
    planeImg = loadImage("plane.png");
    bricksImg = loadImage("bricks.png");
    redbricksImg = loadImage("redbricks.png");
    greenbricksImg = loadImage("greenbricks.png");
    bombImg = loadImage("bomb.png");
}

function setup() {
    canvas = createCanvas(gameWidth, gameHeight);
    canvas.parent("canvas-div");
    color = [Math.floor(Math.random() * 200), Math.floor(Math.random() * 200), Math.floor(Math.random() * 200)];
    //resize
    planeImg.resize(50, 50);
    bricksImg.resize(50, 50);
    redbricksImg.resize(50, 50);
    greenbricksImg.resize(50, 50);
    bombImg.resize(50, 50);
}

function collision(ax, ay, bx, by) {
    if (ax < bx + 50 && ax + 50 > bx && ay < by + 50 && ay + 50 > by) {
        return true;
    }
    return false;
}

function draw() {
    image(bgImg, camera.x - gameWidth / 2, camera.y - gameHeight / 2, gameWidth, gameHeight);
    tint(255);
    if (logged) {
        tint(255);
        //controls
        if (velocityX < 10) {
            velocityX = 10;
        } else if (keyDown("right") || keyDown("d")) {
            velocityX += 0.1;
        } else if (keyDown("left") || keyDown("a")) {
            velocityX -= 0.1;
        } else if (velocityX < 14) {
            velocityX += 0.01;
        }
        if (targetY > 0 && targetY < gameHeight - 50) {
            if (targetY - 10 > playerY) {
                velocityY = 10;
            } else if (targetY + 10 < playerY) {
                velocityY = -10;
            } else {
                velocityY = 0;
            }
        } else {
            velocityY = 0;
        }
        //map
        for (block of thismap) {
            if (Math.abs(camera.x - 25 - block["x"]) < gameWidth / 2) {
                if (block["type"] == "1") {
                    image(bricksImg, block["x"], block["y"]);
                    if (collision(playerX + velocityX, playerY, block["x"], block["y"])) {
                        velocityX = 0;
                    }
                    if (collision(playerX, playerY + velocityY, block["x"], block["y"])) {
                        velocityY = 0;
                    }
                } else if (block["type"] == "2") {
                    image(redbricksImg, block["x"], block["y"]);
                    if (collision(playerX, playerY, block["x"], block["y"])) {
                        respawnplayer();
                    }
                } else if (block["type"] == "3") {
                    image(bombImg, block["x"], block["y"]);
                    if (collision(playerX, playerY, block["x"], block["y"])) {
                        respawnplayer();
                    }
                } else if (block["type"] == "4") {
                    image(greenbricksImg, block["x"], block["y"]);
                    if (collision(playerX, playerY + velocityY, block["x"], block["y"])) {
                        velocityY = 0;
                        velocityX += 1;
                    }
                    if (collision(playerX + velocityX, playerY, block["x"], block["y"])) {
                        velocityX = 0;
                    }
                }
            }
        }
        //player
        if (!isPaused) {
            playerX += velocityX;
            playerY += velocityY;
            if (playerX > 400 * 50) {
                playerX = 0;
                playerS += 1;
            }
        } else {
            fill("black");
            text("PAUSED", camera.x - gameWidth / 2 + 10, 10);
        }
        camera.x = playerX + gameWidth / 3;
        firebase.database().ref("/FlightPath/" + room + "/players/" + player).update({
            x: Math.floor(playerX),
            y: Math.floor(playerY),
            s: playerS
        });
        tint(color[0], color[1], color[2]);
        image(planeImg, playerX, playerY);
        onlinePlayers.forEach((thisplayer) => {
            if (thisplayer[0] != player) {
                tint(thisplayer[4][0], thisplayer[4][1], thisplayer[4][2]);
                text(thisplayer[0] + " - " + thisplayer[3], thisplayer[1], thisplayer[2] + 60);
                image(planeImg, thisplayer[1], thisplayer[2]);
            }
        })
        if (lowUpdates == 0) {
            document.getElementById("data-div").innerHTML = "<p>X: " + Math.floor(playerX) + " / Y: " + playerY + "</p>";
            document.getElementById("data-div").innerHTML += "<p>Score: " + playerS + "</p>";
            document.getElementById("data-div").innerHTML += "<p>Color: " + color[0] + "," + color[1] + "," + color[2] + "</p>";
        }
    } else {
        fill("black");
        stroke("gray");
        image(planeImg, 300, 300);
        rect(-1, 350, gameWidth + 1, 50);
        stroke("white");
        for (i = 0; i < gameWidth / 100; i += 2) {
            line(i * 100 - lowUpdates, 375, i * 100 - lowUpdates + 100, 375);
        }
    }
    if (lowUpdates >= 20) {
        lowUpdates = 0;
    } else {
        lowUpdates += 1;
    }
}

function respawnplayer() {
    playerX = 0;
    velocityX = 0;
}
function togglePause() {
    isPaused = !isPaused;
}

function resetmap() {
    firebase.database().ref("/FlightPath/" + room).update({
        status: "reset"
    });
    location.reload();
}

document.addEventListener("pointermove", (e) => {
    targetY = e.y - 68;
})