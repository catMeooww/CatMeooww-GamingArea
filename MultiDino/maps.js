class LevelData{
    constructor(){
        this.groupblocks
        this.groupcactus
        this.end
        //worlds
        this.world1 = {
            "blocks":[
                [30,2],
                [35,2],
                [37,2],
                [47,2],
                [49,2],
                [48,1.5],
                [72,2],
                [76,2],
            ],
            "cactus":[
                [12,2],
                [17,2],
                [18,2],
                [22,2],
                [23,2],
                [28,2],
                [33,1.3],
                [37,1.3],
                [38,1.3],
                [44,2],
                [48,0.8],
                [49,0.8],
                [56,2],
                [57,2],
                [58,2],
                [65,2],
                [66,2],
                [70,2],
                [74,1.3],
                [78,1.3],
                [85,2]
            ],
            "end":100
        }
        this.world2 = {
            "blocks":[
                [30,2],
                [35,2],
                [37,2],
                [47,2],
                [49,2],
                [48,1.5],
                [72,2],
                [76,2],
            ],
            "cactus":[
                [12,2],
                [17,2],
                [18,2],
                [22,2],
                [23,2],
                [28,2],
                [33,1.3],
                [37,1.3],
                [38,1.3],
                [44,2],
                [48,0.8],
                [49,0.8],
                [56,2],
                [57,2],
                [58,2],
                [65,2],
                [66,2],
                [70,2],
                [74,1.3],
                [78,1.3],
                [85,2]
            ],
            "end":100
        }
    }

    //functions
    loadWorldSprites(sworld) {
        if (sworld == 1){
            var lb = this.world1["blocks"];
            var lc = this.world1["cactus"];

            this.groupblocks = new Group();
            for(var a=0;a<lb.length;a++){
                var block = lb[a];
                var bsprite = createSprite(block[0]*50,block[1]*100);
                bsprite.addImage("1",grassImg);
                bsprite.scale = 3.5;
                bsprite.depth = 2;
                this.groupblocks.add(bsprite);
                console.log("block "+a);
            }

            this.groupcactus = new Group();
            for(var b=0;b<lc.length;b++){
                var cactu = lc[b];
                var csprite = createSprite(cactu[0]*50,cactu[1]*100+5);
                csprite.addImage("1",cactusImg);
                csprite.scale = 0.075;
                csprite.depth = 1;
                this.groupcactus.add(csprite);
                console.log("cactus "+b);
            }

            this.end = createSprite(this.world1["end"]*50,200);
            this.end.scale = 0.16;
            this.end.addImage("end",enderImg);
        }else if(sworld == 2){
            var lb = this.world2["blocks"];
            var lc = this.world2["cactus"];

            this.groupblocks = new Group();
            for(var a=0;a<lb.length;a++){
                var block = lb[a];
                var bsprite = createSprite(block[0]*50,block[1]*100);
                bsprite.addImage("1",darkgrassImg);
                bsprite.scale = 3.5;
                bsprite.depth = 2;
                this.groupblocks.add(bsprite);
                console.log("block "+a);
            }

            this.groupcactus = new Group();
            for(var b=0;b<lc.length;b++){
                var cactu = lc[b];
                var csprite = createSprite(cactu[0]*50,cactu[1]*100+5);
                csprite.addImage("1",cactusImg);
                csprite.scale = 0.075;
                csprite.depth = 1;
                this.groupcactus.add(csprite);
                console.log("cactus "+b);
            }

            this.end = createSprite(this.world2["end"]*50,200);
            this.end.scale = 0.16;
            this.end.addImage("end",enderImg);
        }
    }

    resetWorld(){
        this.groupblocks.removeSprites();
        this.groupcactus.removeSprites();
        this.end.remove();
    }
}