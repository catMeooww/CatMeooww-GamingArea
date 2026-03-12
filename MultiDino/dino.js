logged = false;

isPaused = false;
lowUpdates = 0;

onlinePlayers = [];
thismap = [];
player = "";
room = "";
world = 0;

playerX = 0;
playerY = 0;
velocityX = 0;
velocityY = 0;
onground = false;

gameWidth = window.innerWidth - 25;
gameHeight = 300;

function updateWorld() {
    world += 1;
    if (world > mapConfigs.length) {
        world = 1;
    }
    firebase.database().ref("/MultiDino/" + room + "/worlds/" + world).once('value', function (snapshot) {
        thismap = [];
        snapshot.forEach(function (childSnapshot) {
            childKey = childSnapshot.key; childData = childSnapshot.val();
            thismap.push(childData);
        });
    })
    replacePlayer();
}

function replacePlayer() {
    playerX = 0;
    playerY = 200;
    firebase.database().ref("/MultiDino/" + room + "/players/" + player).set({
        world: world,
        x: playerX,
        y: playerY,
        color: color
    });
}

async function startPlay() {
    await firebase.database().ref("/MultiDino/" + room + "/players/" + player).once('value', data => {
        try {
            playerData = data.val();
            world = playerData['world'];
            playerX = playerData['x'];
            playerY = playerData['y'];
        } catch {
            world = 1;
            replacePlayer();
        }
    })
    await firebase.database().ref("/MultiDino/" + room + "/worlds/" + world).once('value', function (snapshot) {
        thismap = [];
        snapshot.forEach(function (childSnapshot) {
            childKey = childSnapshot.key; childData = childSnapshot.val();
            thismap.push(childData);
        });
    })
    firebase.database().ref("/MultiDino/" + room + "/players/").on('value', function (snapshot) {
        thisPlayers = [];
        snapshot.forEach(function (childSnapshot) {
            childKey = childSnapshot.key; childData = childSnapshot.val();
            thisPlayers.push([childKey, childData["world"], childData["x"], childData["y"], childData["color"]])
        });
        onlinePlayers = thisPlayers;
    })
    logged = true;
    document.getElementById("login-div").innerHTML = "";
    document.getElementById("connection").innerHTML = "Connected in " + room + " as " + player;
}

function joinRoom() {
    room = document.getElementById("room-name").value;
    player = document.getElementById("player-name").value;
    if (room != "" && player != "") {
        firebase.database().ref("/MultiDino/" + room + "/status/").once('value', data => {
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
        firebase.database().ref("/MultiDino/" + room + "/status/").once('value', data => {
            if (data.val() == "online") {
                document.getElementById("room-name").style.borderColor = "red";
            } else {
                map = generateMap();
                firebase.database().ref("/MultiDino/" + room).update({
                    status: "online",
                    worlds: map
                });
                startPlay();
            }
        })
    } else {
        document.getElementById("room-name").style.borderColor = "yellow";
        document.getElementById("player-name").style.borderColor = "yellow";
    }
}

function preload() {
    dinoImg1 = loadImage("dinossaur1.png");
    dinoImg2 = loadImage("dinossaur2.png");
    cactusImg = loadImage("cactus.png");
    darkcactusImg = loadImage("darkcactus.png");
    mushcactusImg = loadImage("mushroom_cactus.png");
    geometrycactusImg = loadImage("geometry_cactus.png");
    grassImg = loadImage("grass.png");
    darkgrassImg = loadImage("darkgrass.png");
    mushgrassImg = loadImage("mushroom_grass.png");
    geometrygrassImg = loadImage("geometry_grass.png");
    enderImg = loadImage("end_teleporter.png");
}

function setup() {
    canvas = createCanvas(gameWidth, gameHeight);
    canvas.parent("canvas-div");
    color = [Math.floor(Math.random() * 200), Math.floor(Math.random() * 200), Math.floor(Math.random() * 200)];
}

function collision(ax, ay, bx, by) {
    if (ax < bx + 50 && ax + 50 > bx && ay < by + 50 && ay + 50 > by) {
        return true;
    }
    return false;
}

function drawBlock(x, y) {
    if (world == 1) {
        image(grassImg, x, y, 50, 50);
    } else if (world == 2) {
        image(darkgrassImg, x, y, 50, 50);
    } else if (world == 3) {
        image(mushgrassImg, x, y, 50, 50);
    } else if (world == 4) {
        image(geometrygrassImg, x, y, 50, 50)
    }
}

function drawCactus(x, y) {
    if (world == 1) {
        image(cactusImg, x, y, 50, 50);
    } else if (world == 2) {
        image(darkcactusImg, x, y, 50, 50);
    } else if (world == 3) {
        image(mushcactusImg, x, y, 50, 50);
    } else if (world == 4) {
        image(geometrycactusImg, x, y, 50, 50);
    }
}

function draw() {
    background("white");
    tint(255);
    if (logged) {
        background(mapConfigs[world - 1]["bg"]);
        //controls
        velocityY += 0.8;
        if (velocityX < 10) {
            velocityX = 10;
        } else if (keyDown("right") || keyDown("d")) {
            velocityX += 0.1;
        } else if (keyDown("left") || keyDown("a")) {
            velocityX -= 0.1;
        } else if (velocityX < 12) {
            velocityX += 0.01;
        }
        if ((keyDown("space") || keyDown("up") || keyDown("w") || isMouseDown) && onground) {
            velocityY = -12;
        }
        //ground
        if (world == 1) {
            image(grassImg, camera.x - gameWidth / 2, 250, gameWidth, 100);
        } else if (world == 2) {
            image(darkgrassImg, camera.x - gameWidth / 2, 250, gameWidth, 100);
        } else if (world == 3) {
            image(mushgrassImg, camera.x - gameWidth / 2, 250, gameWidth, 100);
        } else if (world == 4) {
            image(geometrygrassImg, camera.x - gameWidth / 2, 250, gameWidth, 100);
        }
        if (playerY + velocityY > 200) {
            velocityY = 0;
            onground = true;
        } else {
            onground = false;
        }
        //map
        for (obstacle of thismap) {
            if (Math.abs(camera.x - 25 - obstacle["x"]) < gameWidth / 2) {
                if (obstacle["type"] == "cactus") {
                    drawCactus(obstacle["x"], obstacle["y"]);
                    if (collision(playerX, playerY, obstacle["x"], obstacle["y"])) {
                        playerX = 0;
                        velocityX = 0;
                    }
                } else if (obstacle["type"] == "block") {
                    drawBlock(obstacle["x"], obstacle["y"]);
                    if (collision(playerX + velocityX, playerY, obstacle["x"], obstacle["y"])) {
                        velocityX = 0;
                    }
                    if (collision(playerX, playerY + velocityY, obstacle["x"], obstacle["y"])) {
                        velocityY = 0;
                    }
                } else if (obstacle["type"] == "end") {
                    image(enderImg, obstacle["x"], obstacle["y"], 50, 50)
                }
            }
        }
        //player
        playerX += velocityX;
        playerY += velocityY;
        if (playerX > (mapConfigs[world - 1]["end"] * 50) + 25) {
            updateWorld()
        }
        tint(color[0], color[1], color[2]);
        if (lowUpdates < 10) {
            image(dinoImg1, playerX, playerY, 50, 50);
        } else {
            image(dinoImg2, playerX, playerY, 50, 50);
        }
        camera.x = playerX + gameWidth / 3;
        firebase.database().ref("/MultiDino/" + room + "/players/" + player).update({
            x: Math.floor(playerX),
            y: Math.floor(playerY)
        })
        //players
        onlinePlayers.forEach(thisplayer => {
            if (thisplayer[1] == world && thisplayer[0] != player) {
                tint(thisplayer[4][0], thisplayer[4][1], thisplayer[4][2]);
                text(thisplayer[0], thisplayer[2], thisplayer[3] - 10);
                if (lowUpdates < 10) {
                    image(dinoImg1, thisplayer[2], thisplayer[3], 50, 50);
                } else {
                    image(dinoImg2, thisplayer[2], thisplayer[3], 50, 50);
                }
            }
        })
    } else {
        stroke(2);
        tint(color[0], color[1], color[2]);
        if (lowUpdates < 10) {
            image(dinoImg1, 20, 200, 50, 50);
        } else {
            image(dinoImg2, 20, 200, 50, 50);
        }
        line(0, 250, gameWidth, 250);
    }
    if (lowUpdates >= 20) {
        lowUpdates = 0;
        if (logged) {
            worldLabel = "<h3>World: " + mapConfigs[world - 1]["theme"] + "</h3>";
            positionLabel = "<h3>Position X: " + Math.floor(playerX) + " Position Y: " + Math.floor(playerY) + "</h3>";
            colorLabel = "<h3>Your Dino: RGB " + color[0] + " " + color[1] + " " + color[2] + "</h3>";
            resetLabel = "<button onclick='reset()'>Reset</button>";
            document.getElementById("login-div").innerHTML = worldLabel + positionLabel + colorLabel + resetLabel;
        }
    } else {
        lowUpdates += 1;
    }
}

function reset() {
    firebase.database().ref("/MultiDino/" + room).update({
        status: "reset"
    });
    location.reload();
}

document.addEventListener('touchstart', () => {
    isMouseDown = true;
});
document.addEventListener('mousedown', () => {
    isMouseDown = true;
});
document.addEventListener('mouseup', () => {
    isMouseDown = false;
});
document.addEventListener('touchend', () => {
    isMouseDown = false;
});