logged = false;

isPaused = false;
animBol = 0;

worldData = new LevelData();

player = "";
world = 1;

function loadPlayer(){
    player = document.getElementById('player-name').value.replaceAll(" ","_");
    if (player != ""){
        isJoining = false
        firebase.database().ref("/MultiDino/players/" + player + "/status").on("value", data => {
            isPlayerCreated = data.val();
            if (!isJoining){
                isJoining = true;
                if (isPlayerCreated != "online") {
                    firebase.database().ref("/MultiDino/players/" + player).set({
                        status:'online',
                        world:1,
                        x:0,
                        y:200
                    });
                    document.getElementById("login-div").innerHTML = "<h3>Your Dino</h3><p id='dinodata'></p>";
                    document.getElementById("connection").innerHTML = "Connected as "+player;
                    worldData.loadWorldSprites(1);
                    logged = true;
                }else{
                    document.getElementById("login-div").innerHTML = "<h3>Your Dino</h3><p id='dinodata'></p>";
                    document.getElementById("connection").innerHTML = "Connected as "+player;

                    loaded = false;
                    firebase.database().ref("/MultiDino/players/" + player + "/world").on("value", data => {
                        world = data.val();
                        if (!loaded){
                            loaded = true;
                            worldData.loadWorldSprites(world);
                        }
                    });

                    firebase.database().ref("/MultiDino/players/" + player + "/x").on("value", data => {
                        if (!logged){
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
    grassImg = loadImage("grass.png");
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

    groundSprite1 = createSprite(550,347);
    groundSprite1.addImage("1",grassImg);
    groundSprite1.scale = 10;
    groundSprite1.depth = 3;
    groundSprite2 = createSprite(-150,347);
    groundSprite2.addImage("1",grassImg);
    groundSprite2.scale = 10;
    groundSprite2.depth = 3;

    frameRate(80);
    imageMode(CENTER);
}

function jump(){
    if (playerHolder.isTouching(groundSprite1)||playerHolder.isTouching(worldData.groupblocks)){
        playerSprite.velocityY = -15;
    }
}

function finish(){
    playerSprite.x = 0;
}

function draw(){
    animBol += 1
    if (animBol > 9){
        animBol = 1;
    }

    if(!logged){
        background("white");
        if (animBol > 5){
            image(dinoImg1,50,200,50,50)
        }else{
            image(dinoImg2,50,200,50,50)
        }
        line(0, 225, windowWidth, 225)
    }else{
        document.getElementById("dinodata").innerHTML = "World: "+ world + "<br>";
        if (world == 1){
            background("cyan");
            groundSprite1.changeImage("1");
            groundSprite2.changeImage("1");
        }

        if (animBol > 5){
            playerSprite.changeImage("1");
        }else{
            playerSprite.changeImage("2");
        }

        playerSprite.velocityY += 0.8;
        playerHolder.x = playerSprite.x;
        playerHolder.y = playerSprite.y + 30;

        if (playerSprite.velocityX < 6 && !isPaused){
            playerSprite.velocityX = 6;
        }

        if (keyDown("right")) {
            if (playerSprite.velocityX < 12){
                playerSprite.velocityX += 0.2;
            }
        }else{
            if (playerSprite.velocityX > 6){
                playerSprite.velocityX -= 0.2;
            }
        }

        if(keyDown("esc")){
            playerSprite.velocityX = 0;
            isPaused = !isPaused;
        }

        if (keyDown("up") || keyDown("w") || keyDown("space")){
            jump();
        }

        firebase.database().ref("/MultiDino/players/" + player).update({
            x: Math.round(playerSprite.x)
        });
        firebase.database().ref("/MultiDino/players/" + player).update({
            y: Math.round(playerSprite.y)
        });

        groundSprite2.x = playerSprite.x + 550;
        groundSprite1.x = playerSprite.x - 150;

        playerSprite.collide(groundSprite1);
        playerSprite.collide(worldData.groupblocks);
        if (playerSprite.isTouching(worldData.groupcactus)){
            playerSprite.x = -5;
        }
        if (playerSprite.x > worldData.end.x){
            finish();
        }

        document.getElementById("dinodata").innerHTML += "X: "+ Math.round(playerSprite.x) + "<br>";
        document.getElementById("dinodata").innerHTML += "Y: "+ Math.round(playerSprite.y) + "<br>";
        text("You",playerSprite.x - 5,15)
        camera.x = playerSprite.x + 200
        drawSprites();

        playersReaded = false;
        firebase.database().ref("/MultiDino/players/").on('value', function (snapshot) {
            if (!playersReaded){
                playersReaded = true;
                snapshot.forEach(function (childSnapshot) {
                    childKey = childSnapshot.key; childData = childSnapshot.val();
        
                    firebaseMessageId = childKey;
                    onlineData = childData;
        
                    onlineWorld = onlineData['world'];
                    onlineX = onlineData['x'];
                    onlineY = onlineData['y'];
        
                    if (firebaseMessageId != player && onlineWorld == world){
                        if (animBol > 5){
                            image(dinoImg1,onlineX,onlineY,55,55)
                            text(firebaseMessageId,onlineX - 10,15)
                        }else{
                            image(dinoImg2,onlineX,onlineY,55,55)
                            text(firebaseMessageId,onlineX - 10,15)
                        }
                    }
                });
            }
        });
    }
}

function mouseClicked(){
    jump();
}