logged = false;

isPaused = false;
animBol = 0;

worldData = new LevelData();

player = "";
room = "";
world = 1;

function loadPlayer() {
    player = document.getElementById('player-name').value.replaceAll(" ", "_");
    room = document.getElementById('room-name').value.replaceAll(" ", "_");
    if (player != "" && room != "") {
        isJoining = false
        firebase.database().ref("/MultiDino/" + room + "/players/" + player + "/status").on("value", data => {
            isPlayerCreated = data.val();
            if (!isJoining) {
                isJoining = true;
                if (isPlayerCreated != "online") {
                    firebase.database().ref("/MultiDino/" + room + "/players/" + player).set({
                        status: 'online',
                        world: 1,
                        x: 0,
                        y: 200
                    });
                    document.getElementById("login-div").innerHTML = "<h3>Your Dino</h3><p id='dinodata'></p>";
                    document.getElementById("connection").innerHTML = "Connected as " + player;
                    worldData.loadWorldSprites(1);
                    logged = true;
                } else {
                    document.getElementById("login-div").innerHTML = "<h3>Your Dino</h3><p id='dinodata'></p>";
                    document.getElementById("connection").innerHTML = "Connected as " + player;

                    loaded = false;
                    firebase.database().ref("/MultiDino/" + room + "/players/" + player + "/world").on("value", data => {
                        world = data.val();
                        if (!loaded) {
                            loaded = true;
                            worldData.loadWorldSprites(world);
                        }
                    });

                    firebase.database().ref("/MultiDino/" + room + "/players/" + player + "/x").on("value", data => {
                        if (!logged) {
                            playerSprite.x = data.val();
                            logged = true;
                        }
                    });
                }
            }
        });
    }
}

function preload() {
    dinoImg1 = loadImage("dinossaur1.png");
    dinoImg2 = loadImage("dinossaur2.png");
    cactusImg = loadImage("cactus.png");
    darkcactusImg = loadImage("darkcactus.png");
    mushcactusImg = loadImage("mushroom_cactus.png");
    grassImg = loadImage("grass.png");
    darkgrassImg = loadImage("darkgrass.png");
    mushgrassImg = loadImage("mushroom_grass.png");
    enderImg = loadImage("end_teleporter.png");
}
function setup() {
    canvas = createCanvas(windowWidth - 50, 300);
    canvas.parent("canvas-div");

    playerSprite = createSprite(0, 150);
    playerSprite.addImage("1", dinoImg1);
    playerSprite.addImage("2", dinoImg2);
    playerSprite.scale = 0.15;
    playerHolder = createSprite(0, 200, 20, 10);
    playerHolder.visible = false;

    groundSprite1 = createSprite(550, 347);
    groundSprite1.addImage("1", grassImg);
    groundSprite1.addImage("2", darkgrassImg);
    groundSprite1.addImage("3", mushgrassImg);
    groundSprite1.scale = 10;
    groundSprite1.depth = 3;
    groundSprite2 = createSprite(-150, 347);
    groundSprite2.addImage("1", grassImg);
    groundSprite2.addImage("2", darkgrassImg);
    groundSprite2.addImage("3", mushgrassImg);
    groundSprite2.scale = 10;
    groundSprite2.depth = 3;

    frameRate(80);
    imageMode(CENTER);
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

function jump() {
    if (!isPaused) {
        if (playerHolder.isTouching(groundSprite1) || playerHolder.isTouching(worldData.groupblocks)) {
            playerSprite.velocityY = -15;
        }
    }
}

function finish() {
    playerSprite.x = 0;
    if (world == 3) {
        world = 1
    } else {
        world += 1;
    }
    worldData.resetWorld();
    worldData.loadWorldSprites(world)
    firebase.database().ref("/MultiDino/" + room + "/players/" + player).update({
        world: world
    });
}

function draw() {
    frameRate(80);
    animBol += 1
    if (animBol > 9) {
        animBol = 1;
    }

    if (!logged) {
        background("white");
        if (animBol > 5) {
            image(dinoImg1, 50, 200, 50, 50)
        } else {
            image(dinoImg2, 50, 200, 50, 50)
        }
        line(0, 225, windowWidth, 225)
    } else {
        document.getElementById("dinodata").innerHTML = "World: " + world + "<br>";
        if (world == 1) {
            background("cyan");
            groundSprite1.changeImage("1");
            groundSprite2.changeImage("1");
        } else if (world == 2) {
            background("blue");
            groundSprite1.changeImage("2");
            groundSprite2.changeImage("2");
        } else if (world == 3) {
            background("pink");
            groundSprite1.changeImage("3");
            groundSprite2.changeImage("3");
        }

        if (!isPaused) {
            playerSprite.velocityY += 0.8;
            if (animBol > 5) {
                playerSprite.changeImage("1");
            } else {
                playerSprite.changeImage("2");
            }
        } else {
            text("PAUSED", playerSprite.x - 400, 15)
        }

        playerHolder.x = playerSprite.x;
        playerHolder.y = playerSprite.y + 30;

        if (playerSprite.velocityX < 6 && !isPaused) {
            playerSprite.velocityX = 6;
        }

        if (keyDown("right")) {
            if (playerSprite.velocityX < 12) {
                playerSprite.velocityX += 0.2;
            }
        } else {
            if (playerSprite.velocityX > 6) {
                playerSprite.velocityX -= 0.2;
            }
        }

        if (keyDown("esc")) {
            playerSprite.velocityX = 0;
            playerSprite.velocityY = 0;
            isPaused = !isPaused;
        }

        if (keyDown("up") || keyDown("w") || keyDown("space")) {
            jump();
        }
        if (isMouseDown) {
            jump()
        }

        firebase.database().ref("/MultiDino/" + room + "/players/" + player).update({
            x: Math.round(playerSprite.x)
        });
        firebase.database().ref("/MultiDino/" + room + "/players/" + player).update({
            y: Math.round(playerSprite.y)
        });

        groundSprite2.x = playerSprite.x + 550;
        groundSprite1.x = playerSprite.x - 150;

        playerSprite.collide(groundSprite1);
        playerSprite.collide(worldData.groupblocks);
        if (playerSprite.isTouching(worldData.groupcactus)) {
            playerSprite.x = -5;
        }
        if (playerSprite.x > worldData.end.x) {
            finish();
        }

        document.getElementById("dinodata").innerHTML += "X: " + Math.round(playerSprite.x) + "<br>";
        document.getElementById("dinodata").innerHTML += "Y: " + Math.round(playerSprite.y) + "<br>";
        text("You", playerSprite.x - 5, 15)
        camera.x = playerSprite.x + 200
        drawSprites();

        playersReaded = false;
        firebase.database().ref("/MultiDino/" + room + "/players/").on('value', function (snapshot) {
            if (!playersReaded) {
                playersReaded = true;
                snapshot.forEach(function (childSnapshot) {
                    childKey = childSnapshot.key; childData = childSnapshot.val();

                    firebaseMessageId = childKey;
                    onlineData = childData;

                    onlineWorld = onlineData['world'];
                    onlineX = onlineData['x'];
                    onlineY = onlineData['y'];

                    if (firebaseMessageId != player && onlineWorld == world) {
                        if (animBol > 5) {
                            image(dinoImg1, onlineX, onlineY, 55, 55)
                            text(firebaseMessageId, onlineX - 10, 15)
                        } else {
                            image(dinoImg2, onlineX, onlineY, 55, 55)
                            text(firebaseMessageId, onlineX - 10, 15)
                        }
                    }
                });
            }
        });
    }
}