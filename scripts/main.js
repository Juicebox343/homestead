let ctx = null;
let gameMap = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];

let tileW = 40, tileH = 40;
let mapW = 20, mapH = 20;

let viewport = {
    screen      : [0,0],
    startTile   : [0,0],
    endTile     : [0,0],
    offset      : [0,0],
    update      : function(px, py){
        this.offset[0] = Math.floor((this.screen[0]/2) - px);
        this.offset[1] = Math.floor((this.screen[1]/2) - py);
        var tile = [ Math.floor(px/tileW), Math.floor(py/tileH) ];

		this.startTile[0] = tile[0] - 1 - Math.ceil((this.screen[0]/2) / tileW);
		this.startTile[1] = tile[1] - 1 - Math.ceil((this.screen[1]/2) / tileH);

		if(this.startTile[0] < 0) { this.startTile[0] = 0; }
		if(this.startTile[1] < 0) { this.startTile[1] = 0; }

		this.endTile[0] = tile[0] + 1 + Math.ceil((this.screen[0]/2) / tileW);
		this.endTile[1] = tile[1] + 1 + Math.ceil((this.screen[1]/2) / tileH);

		if(this.endTile[0] >= mapW) { this.endTile[0] = mapW-1; }
		if(this.endTile[1] >= mapH) { this.endTile[1] = mapH-1; }
	}
};


let currentSecond = 0, frameCount = 0, framesLastSecond = 0, lastFrameTime = 0;

let keysDown = {
	KeyW : false,
	KeyA : false,
	KeyS : false,
	KeyD : false
};



let player = new Character();

function Character(){
    this.tileFrom = [1,1];
    this.tileTo = [1,1];
    this.timeMoved = 0;
    this.dimensions = [30,30];
    this.position = [45,45];
    this.delayMove = 700;
}

Character.prototype.placeAt = function(x, y){
    this.tileFrom = [x,y];
    this.tileTo = [x,y];
    this.position = [
        ((tileW*x)+((tileW-this.dimensions[0])/2)),
        ((tileH*y)+((tileH-this.dimensions[1])/2))
    ];
};

Character.prototype.processMovement = function(t)
{
    if(this.tileFrom[0]==this.tileTo[0] && this.tileFrom[1]==this.tileTo[1]) { 
        return false; 
    }
    if((t-this.timeMoved)>=this.delayMove)
	{
		this.placeAt(this.tileTo[0], this.tileTo[1]);
    } else {	
        
        this.position[0] = (this.tileFrom[0] * tileW) + ((tileW-this.dimensions[0])/2);
		this.position[1] = (this.tileFrom[1] * tileH) + ((tileH-this.dimensions[1])/2);
        
        if(this.tileTo[0] != this.tileFrom[0])
		{
			var diff = (tileW / this.delayMove) * (t-this.timeMoved);
			this.position[0]+= (this.tileTo[0]<this.tileFrom[0] ? 0 - diff : diff);
		}
        
        if(this.tileTo[1] != this.tileFrom[1])
		{
			var diff = (tileH / this.delayMove) * (t-this.timeMoved);
			this.position[1]+= (this.tileTo[1]<this.tileFrom[1] ? 0 - diff : diff);
        }
        
        this.position[0] = Math.round(this.position[0]);
        this.position[1] = Math.round(this.position[1]);
    }
	return true;
}

function toIndex(x, y)
{
	return((y * mapW) + x);
}


window.onload = function(){


    ctx = document.querySelector('canvas').getContext('2d');
    this.requestAnimationFrame(drawGame);
    ctx.font = 'bold 10pt sans-serif';

    window.addEventListener("keydown", function(event){
        if(event.code == "KeyW" || event.code === "KeyA" || event.code === "KeyS" || event.code ==="KeyD"){
            keysDown[event.code] = true;
        }
    });

    window.addEventListener("keyup", function(event){
        if(event.code == "KeyW" || event.code === "KeyA" || event.code === "KeyS" || event.code ==="KeyD"){
            keysDown[event.code] = false;
        }
    });

    viewport.screen = [document.querySelector('canvas').width,
		document.querySelector('canvas').height];

};

function drawGame(){
    let currentFrameTime = Date.now();
    let timeElapsed = currentFrameTime - lastFrameTime;

    if(ctx==null) {
        return;
    }
    
    let sec = Math.floor(Date.now()/1000);
    
    if(sec!=currentSecond)
    {
        currentSecond = sec;
        framesLastSecond = frameCount;
        frameCount = 1;
    } else { 
        frameCount++; 
    }

    for(y=0; y < mapH; ++y){
        for(x=0; x < mapW; ++x){
            switch(gameMap[((y*mapW)+x)])
            {
                case 0: 
                    ctx.fillStyle = "#685b48";
                    break;
                default:
                    ctx.fillStyle = "#5aa457";
            }
            ctx.fillRect(x*tileW, y*tileH, tileW, tileH);
        }
    }
   
    ctx.fillStyle = "#ff0000";
    ctx.fillText("FPS: " + framesLastSecond, 10, 20);

    ctx.fillStyle = "#0000ff";
	ctx.fillRect(player.position[0], player.position[1],
		player.dimensions[0], player.dimensions[1]);
    
    if(!player.processMovement(currentFrameTime))
	{
        if(keysDown['KeyW'] && player.tileFrom[1]>0 && gameMap[toIndex(player.tileFrom[0], player.tileFrom[1]-1)]==1) { 
            player.tileTo[1]-= 1; 
        }
        else if(keysDown['KeyS'] && player.tileFrom[1]<(mapH-1) && gameMap[toIndex(player.tileFrom[0], player.tileFrom[1]+1)]==1) 
        { 
            player.tileTo[1]+= 1; 
        }
        else if(keysDown['KeyA'] && player.tileFrom[0]>0 && gameMap[toIndex(player.tileFrom[0]-1, player.tileFrom[1])]==1) 
        { 
            player.tileTo[0]-= 1; 
        }
        else if(keysDown['KeyD'] && player.tileFrom[0]<(mapW-1) && gameMap[toIndex(player.tileFrom[0]+1, player.tileFrom[1])]==1) 
        { 
            player.tileTo[0]+= 1; 
        }
        
        if(player.tileFrom[0]!=player.tileTo[0] || player.tileFrom[1]!=player.tileTo[1])
		{ 
            player.timeMoved = currentFrameTime; 
        }
	}


	requestAnimationFrame(drawGame);

}

