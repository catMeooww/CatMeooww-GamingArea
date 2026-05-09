mapConfigs = [
    {
        "world": 1,
        "theme": "plains",
        "bg": "cyan",
        "end": 300
    },
    {
        "world": 2,
        "theme": "night",
        "bg": "blue",
        "end": 300
    },
    {
        "world": 3,
        "theme": "mushroom",
        "bg": "pink",
        "end": 300
    },
    {
        "world": 4,
        "theme": "geometry",
        "bg": "cadetblue",
        "end": 300
    },
    {
        "world": 5,
        "theme": "forest",
        "bg": "darkgreen",
        "end": 500
    }
];

obstacles = [
    ["air","cactus","air"],
    ["cactus", "cactus","air"],
    ["cactus", "cactus", "cactus"],
    ["block", "block", "block", "block"],
    ["air","cactus","block","air"]
]

function generateMap() {
    total = [];
    for (config of mapConfigs) {
        total[config["world"]] = [];
        progress = 10;
        while (progress < config["end"]) {
            obstacle = Math.floor(Math.random() * obstacles.length);
            obstacle = obstacles[obstacle];
            for (piece of obstacle) {
                total[config["world"]].push({
                    "type": piece,
                    "x": progress * 50,
                    "y": 200
                })
                progress += 1;
            }
            progress += Math.floor(Math.random() * 5) + 5;
        }
        total[config["world"]].push({
            "type": "end",
            "x": progress * 50,
            "y": 200
        })
    }
    return total;
}