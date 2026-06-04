obstacles = [
    [[1, 1, 2, 0, 0, 0, 2, 1], [1, 1, 2, 0, 0, 0, 2, 1], [1, 2, 0, 0, 0, 2, 1, 1], [1, 2, 0, 0, 0, 2, 1, 1]],
    [[2, 2, 0, 0, 0, 2, 2, 2], [1, 1, 0, 0, 0, 1, 1, 1], [1, 1, 0, 0, 0, 1, 1, 1]],
    [[2, 2, 2, 0, 0, 0, 2, 2], [1, 1, 1, 0, 0, 0, 1, 1], [1, 1, 1, 0, 0, 0, 1, 1]],
    [[3, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 3, 0], [0, 0, 0, 3, 0, 0, 0, 0]]
]

function generateMap() {
    genmap = [];
    size = 400;
    placeX = 10;
    placeY = 0;
    while (placeX < size) {
        addObstacle = Math.floor(Math.random() * obstacles.length);
        for(collum of obstacles[addObstacle]){
            placeY = 0;
            for(block of collum){
                genmap.push({
                    type:block,
                    x:placeX*50,
                    y:placeY*50
                });
                placeY+=1;
            }
            placeX+=1;
        }
        placeX+=7;
    }
    return genmap;
}