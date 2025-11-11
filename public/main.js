const __main = document.getElementById("main");


const canvas = document.createElement('canvas');
__main.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

// Constantes ================================
const config = {
	win: {
		width: window.innerWidth,
		height: window.innerHeight
	},
	tiles: {
		x: Math.ceil(window.innerWidth / 16) + 2,
		y: Math.ceil(window.innerHeight / 16) + 2
	},
	center: {
		x: Math.round(window.innerWidth / 16) / 2,
		y: Math.round(window.innerHeight / 16) / 2
	},
	size: {
		tile: 16,
	},
};


// Objetos ===================================
class Transform {
	constructor(x=0, y=0, w=1, h=1) {
		this.x = x;
		this.y = y;
		this.w = w * config.size.tile;
		this.h = h * config.size.tile;

		this.velX = 0;
		this.velY = 0;
		this.onGround = false;
	}

	get center() {
		return {
			x: this.x + (this.w * 0.5),
			y: this.y + (this.h * 0.5)
		}
	}
	get top() {
		return {
			x: this.x + (this.w * 0.5),
			y: this.y
		}
	}
	get bottom() {
		return {
			x: this.x + (this.w * 0.5),
			y: this.y + this.h
		}
	}
	get left() {
		return {
			x: this.x,
			y: this.y + (this.h * 0.5)
		}
	}
	get right() {
		return {
			x: this.x + this.w,
			y: this.y + (this.h * 0.5)
		}
	}

	move(Coliders = []) {
		// Eixo X ---------------------
		const nextX = {
			x: this.x + this.velX,
			y: this.y,
			w: this.w,
			h: this.h
		};
		const nextStepX = {
			x: this.x + 1,
			y: this.y,
			w: this.w,
			h: this.h
		};
		let colideX = false;
		let colideStepX = false;

		Coliders.forEach(obj => {
			if (obj.transform === this) return;
			
			const [axisX, axisY] = AABBcheck(nextX, obj.transform);
			if (axisX && axisY) {
				colideX = true;
				
				const [stepX, stepY] = AABBcheck(nextStepX, obj.transform);
				if(stepX, stepY) {
					colideStepX = true;
				}
				
				//console.log(obj.name + ' (x-axis collision)');
			}
		});

		if (!colideX) {
			this.x += this.velX;
		} else if(!colideStepX) {
			this.x += 1;
		}

		// Eixo Y --------------------
		const nextY = {
			x: this.x,
			y: this.y + this.velY,
			w: this.w,
			h: this.h
		};
		const nextStepY = {
			x: this.x,
			y: this.y + 1,
			w: this.w,
			h: this.h
		};
		let colideY = false;
		let colideStepY = false;
		this.onGround = false;

		Coliders.forEach(obj => {
			if (obj.transform === this) return;
			
			const [axisX, axisY] = AABBcheck(nextY, obj.transform);
			if (axisX && axisY) {
				colideY = true;

				const [stepX, stepY] = AABBcheck(nextStepY, obj.transform);
				if(stepX, stepY) {
					colideStepY = true;
					this.onGround = true;
				}

				//console.log(obj.name + ' (y-axis collision) onGround: ', + this.onGround);
			}
		});

		if (!colideY) {
			this.y += this.velY;
		} else if (!colideStepY) {
			this.y += 1;
		}
	}
}

class RectRenderer {
	constructor(color='#000') {
		this.color = color;
	}
	
	draw(tran) {
		ctx.fillStyle = this.color;
		ctx.fillRect(tran.x,tran.y,tran.w,tran.h);
	}
}


class GameObject {
	static objectId = 0;
	static gameObjects = [];

	constructor(name='gameObject', transform = new Transform(), renderer = new RectRenderer()) {
		this.transform = transform;
		this.renderer = renderer;
		this.name = name;
		
		GameObject.objectId++;
		GameObject.gameObjects.push(this);
		this.myId = GameObject.objectId
	}

}
const player = new GameObject('player', new Transform(20*config.size.tile, 0, 2, 3) ,new RectRenderer('#fff'));
const ball = new GameObject('ball', new Transform(20, 20, 5, 5), new RectRenderer('#fff'));
const ground = new GameObject('ground', new Transform(2*config.size.tile, 54*config.size.tile, 112, 5), new RectRenderer('#222'));
const wall = new GameObject('wall', new Transform(10*config.size.tile, 47*config.size.tile, 8, 12), new RectRenderer('#222'));
const wall2 = new GameObject('wall2', new Transform(30*config.size.tile, 43*config.size.tile, 8, 16), new RectRenderer('#222'));
const wall3= new GameObject('wall3', new Transform(50*config.size.tile, 47*config.size.tile, 8, 12), new RectRenderer('#222'));
const wall4 = new GameObject('wall4', new Transform(70*config.size.tile, 47*config.size.tile, 8, 12), new RectRenderer('#222'));

// Funções de fisica ========================
function AABBcheck(objA, objB) {
	return ([
		objA.x < objB.x + objB.w && objA.x + objA.w > objB.x,
		objA.y < objB.y + objB.h && objA.y + objA.h > objB.y
	]);
}

// Funções de Renderização ==================
function clear(){
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Eventos de input =========================
mousePos = {x: 0, y:0}
document.addEventListener('mousemove', (ev) => {
	targetPosY = ev.clientY;
	targetPosX = ev.clientX;

	mousePos.x = targetPosX;
	mousePos.y = targetPosY;
	
	//console.log(mousePos);
});
keylist = [];
document.addEventListener('keydown', (ev) => {
	if(!keylist.some(key => key === ev.key)) {
		keylist.push(ev.key);
	}
});
document.addEventListener('keyup', (ev) => {
	if(keylist.some(key => key === ev.key)) {
		index = keylist.indexOf(ev.key);
		keylist.splice(index, 1);
	}
});

// Funções de Update ========================
function inputHandler(player) {
	const speed = 8;
	const gravity = 1;
	const gravityLimit = 15;

	if(keylist.some(key => key === 'd')) {
		player.transform.velX = 1 * speed;
	} else if(keylist.some(key => key === 'a')) {
		player.transform.velX = -1 * speed;
	} else {
		player.transform.velX = 0;
	}

	if (!player.transform.onGround) {
        player.transform.velY += gravity;
		if(player.transform.velY > gravityLimit) player.transform.velY = gravityLimit;
		//console.log(player.transform.velY)
    } else {
        player.transform.velY = 0;
		if(keylist.some(key => key === 'w')) {
			player.transform.velY = -1 * speed * 2;
		}
    }
}

function update(gameObjects) {
	gameObjects.forEach((gameObject) => {
		
		if(gameObject.name === 'player') {
			gameObject.transform.move(gameObjects);
		}
	});
}
function render(gameObjects) {
	gameObjects.forEach((gameObject) => {
		gameObject.renderer.draw(gameObject.transform);
	});
}

// Loop principal ===========================

function gameloop() {
	clear();

	inputHandler(player);
	update(GameObject.gameObjects);

	render(GameObject.gameObjects);
	
    requestAnimationFrame(() => {gameloop()});
}

function gameStart() {
	console.log(config);

	gameloop();
}
gameStart();