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
		console.log(player.transform.velY)
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

/*
Não, essa foi uma solução básica mas não a melhor para seu caso futuro. Para gravidade, pulos e plataformas semi-sólidas (one-way), você precisa de um sistema mais robusto. O método sequencial simples que eu dei funciona para movimento livre, mas falha com:

Gravidade: Precisa detectar "pisar" em plataformas (land) vs "bater na cabeça" (head collision)
One-way platforms: Distinguir colisão de cima vs de baixo
Pulos: Detectar quando está no chão para permitir pulo
Precisão: Evitar "tunneling" em altas velocidades

🏆 MELHOR ABORDAGEM: SAT + Raycast Separado por Eixo
Vou te dar um sistema completo e escalável que lida com TUDO isso. Substitua seu Transform.move() por este:

move(Coliders = [], isGroundedCheck = false) {
    // 1. X-axis primeiro (horizontal)
    this.resolveAxis('x', Coliders);
    
    // 2. Y-axis depois (vertical - com suporte a gravidade/platforms)
    this.resolveAxis('y', Coliders, isGroundedCheck);
}

resolveAxis(axis, Coliders, isGroundedCheck = false) {
    const velocity = axis === 'x' ? this.velX : this.velY;
    if (velocity === 0) return;
    
    const direction = velocity > 0 ? 1 : -1;
    const distance = Math.abs(velocity);
    const step = Math.min(1, distance); // Evita tunneling
    
    let remaining = distance;
    
    while (remaining > 0) {
        const moveStep = Math.min(step, remaining);
        const testPos = { ...this };
        
        if (axis === 'x') {
            testPos.x += direction * moveStep;
        } else {
            testPos.y += direction * moveStep;
        }
        
        let hit = false;
        let collisionSide = null;
        let collidedObj = null;
        
        for (let obj of Coliders) {
            if (obj.transform === this) continue;
            
            const collision = this.checkDetailedCollision(testPos, obj.transform, axis);
            if (collision.hit) {
                hit = true;
                collidedObj = obj;
                collisionSide = collision.side;
                break;
            }
        }
        
        if (hit) {
            // APLICA COLISÃO DETALHADA
            this.applyCollision(axis, direction, collidedObj, collisionSide, isGroundedCheck);
            remaining = 0; // Para completamente neste eixo
        } else {
            // Move com segurança
            if (axis === 'x') this.x += direction * moveStep;
            else this.y += direction * moveStep;
            remaining -= moveStep;
        }
    }
    
    // Zera velocidade se colidiu
    if (axis === 'x' && remaining === 0 && Math.abs(this.velX) > 0) this.velX = 0;
    if (axis === 'y' && remaining === 0 && Math.abs(this.velY) > 0) this.velY = 0;
}

checkDetailedCollision(testPos, other, axis) {
    const overlapX = testPos.x < other.x + other.w && 
                     testPos.x + testPos.w > other.x;
    const overlapY = testPos.y < other.y + other.h && 
                     testPos.y + testPos.h > other.y;
    
    if (!overlapX || !overlapY) return { hit: false };
    
    // Determina LADO da colisão (CRUCIAL para platforms)
    let side = null;
    const dx = testPos.center.x - other.center.x;
    const dy = testPos.center.y - other.center.y;
    
    if (axis === 'x') {
        side = dx > 0 ? 'right' : 'left';
    } else { // y-axis
        side = dy > 0 ? 'bottom' : 'top';
    }
    
    return { hit: true, side };
}

applyCollision(axis, direction, collidedObj, side, isGroundedCheck) {
    // Para platforms one-way: só colide se vindo DE CIMA
    if (axis === 'y' && side === 'bottom' && direction > 0) {
        // Chegando por cima = colisão normal
        this.y = collidedObj.transform.y - this.h; // Snap to top
        if (isGroundedCheck) this.onGround = true;
    } else if (axis === 'y' && side === 'top' && direction < 0) {
        // Batendo na cabeça
        this.y = collidedObj.transform.y + collidedObj.transform.h;
        this.onGround = false;
    } else {
        // Colisão lateral ou platform não aplicável
        if (axis === 'x') {
            if (direction > 0) this.x = collidedObj.transform.x - this.w;
            else this.x = collidedObj.transform.x + collidedObj.transform.w;
        }
    }
}
🔧 ADICIONE ao Transform:
constructor(x=0, y=0, w=1, h=1) {
    // ... código existente ...
    this.onGround = false; // Para pulos
}
🎮 NOVO InputHandler com Pulos/Gravidade:
function inputHandler(player) {
    const speed = 5;
    const jumpPower = -12;
    const gravity = 0.5;

    // HORIZONTAL (igual antes)
    if(keylist.some(key => key === 'd')) {
        player.transform.velX = speed;
    } else if(keylist.some(key => key === 'a')) {
        player.transform.velX = -speed;
    } else {
        player.transform.velX *= 0.8; // Friction
    }

    // VERTICAL + GRAVIDADE
    if(keylist.some(key => key === 'w') && player.transform.onGround) {
        player.transform.velY = jumpPower;
        player.transform.onGround = false;
    }
    
    // Aplica gravidade
    if (!player.transform.onGround) {
        player.transform.velY += gravity;
    } else {
        player.transform.velY = 0;
    }

    // LIMITE vertical
    player.transform.velY = Math.max(-15, Math.min(15, player.transform.velY));
}
🏗️ UPDATE Modificado:
function update(gameObjects) {
    gameObjects.forEach(gameObject => {
        if(gameObject.name === 'player') {
            // Reset grounded check
            gameObject.transform.onGround = false;
            gameObject.transform.move(gameObjects, true); // true = check grounded
        }
    });
}
🌟 PLATFORMS SEMI-SÓLIDAS:
Crie platforms assim:
const platform = new GameObject('platform', 
    new Transform(100, 200, 8, 1), 
    new RectRenderer('#0f0')
);
// Adicione: platform.isOneWay = true; (no futuro)
*/