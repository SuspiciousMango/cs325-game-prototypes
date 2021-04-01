import "./phaser.js";

// You can copy-and-paste the code from any of the examples at https://examples.phaser.io here.
// You will need to change the `parent` parameter passed to `new Phaser.Game()` from
// `phaser-example` to `game`, which is the id of the HTML element where we
// want the game to go.
// The assets (and code) can be found at: https://github.com/photonstorm/phaser3-examples
// You will need to change the paths you pass to `this.load.image()` or any other
// loading functions to reflect where you are putting the assets.
// All loading functions will typically all be found inside `preload()`.

// The simplest class example: https://phaser.io/examples/v3/view/scenes/scene-from-es6-class

class MyScene extends Phaser.Scene {
    
    constructor() {
        super();
        
        this.asteroid = null;
		this.planet = null;
		this.blackholes = [null, null, null];
		this.numBlackHoles = 0;
		this.startingVel = [0, 0];
		this.openingText = null
		this.velText = null;
		this.resultText = null;
		this.styleLarge = { font: "20px Verdana", fill: "#9999ff", align: "center" };
		this.styleSmall = { font: "10px Verdana", fill: "#9999ff", align: "center" };
		this.runGame = false;
    }
    
    preload() {
        this.load.image('asteroid', 'assets/Asteroid.png');
		this.load.image('blackhole', 'assets/Black Hole 2.png');
		this.load.image('planet', 'assets/Planet.png');
    }
    
    create() {
        // Create a sprite at the center of the screen using the 'logo' image.
        this.asteroid = this.physics.add.sprite( 25, 25, 'asteroid' );
		this.asteroid.setScale(0.5);
		this.planet = this.physics.add.sprite(775, 575, 'planet');
        
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        this.openingText = this.add.text( this.cameras.main.centerX, 15, "Guide the asteroid to the planet using the gravity of black holes!\nLeft-click to place up to 3 black holes\nRight-click to undo last black hole placement\nUse the arrow keys to give the asteroid a starting velocity\nPress \"enter\" when ready to move!\nIf stuck, press \"a\" to reset the asteroid's position and velocity, or\n\"r\" to reset the whole puzzle", this.styleLarge );
        this.openingText.setOrigin( 0.5, 0.0 );
		
		this.velText = this.add.text(25, 50, "Velocity:\nX: " + this.startingVel[0] + "\nY: " + this.startingVel[1], this.styleSmall);
		this.velText.setOrigin(0.5, 0.0);
		
		this.resultText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "", this.styleLarge);
		this.resultText.setOrigin(0.5, 0.0);
		this.resultText.setAlpha(0);
		
		this.input.keyboard.on('keyup-ENTER', this.playGame, this);
		this.input.keyboard.on('keyup-A', this.resetAsteroid, this);
		this.input.keyboard.on('keyup-R', this.resetGame, this);
		this.input.keyboard.on('keyup-RIGHT', this.incXVel, this);
		this.input.keyboard.on('keyup-LEFT', this.decXVel, this);
		this.input.keyboard.on('keyup-UP', this.decYVel, this);
		this.input.keyboard.on('keyup-DOWN', this.incYVel, this);
		this.input.mouse.disableContextMenu();
		this.input.on('pointerup', this.createBlackHole, this);
		
		this.physics.add.overlap(this.asteroid, this.planet, this.endGameWin, null, this);
    }
    
    update() {
		this.velText.setText("Velocity:\nX: " + this.startingVel[0] + "\nY: " + this.startingVel[1])
		if(this.runGame){
			let accelSumX = 0;
			let accelSumY = 0;
			for(let i = 0; i < this.numBlackHoles; i++){
				let BHDist = Math.round(Phaser.Math.Distance.Between(this.asteroid.x, this.asteroid.y, this.blackholes[i].x, this.blackholes[i].y));
				let BHaccel = Math.min(6250000/Math.pow(BHDist, 2), 1000);
				//Unfortunately just throwing that acceleration number into a call to "accelerateToObject" doesnt work because it can't take into account multiple objects.
				//Instead, compute the x and y components and add them to a total sum to be applied once the for loop is overlap
				let BHDistX = this.blackholes[i].x - this.asteroid.x;
				//No matter how many times I try to escape trig functions, they always come back
				let BHaccelX = BHaccel * (BHDistX / BHDist); 	//r * cos(theta)
				let BHDistY = this.blackholes[i].y - this.asteroid.y;
				let BHaccelY = BHaccel * (BHDistY / BHDist);	//r * sin(theta)
				accelSumX += BHaccelX;
				accelSumY += BHaccelY;
			}
			this.asteroid.setAccelerationX(accelSumX);
			this.asteroid.setAccelerationY(accelSumY);
		}
    }
	
	playGame(){
		this.runGame = true;
		this.openingText.setAlpha(0);
		this.velText.setAlpha(0);
		this.asteroid.setVelocityX(this.startingVel[0]);
		this.asteroid.setVelocityY(this.startingVel[1]);
	}
	
	resetAsteroid(){
		this.runGame = false;
		this.asteroid.setVelocity(0);
		this.asteroid.setAcceleration(0);
		this.openingText.setAlpha(1);
		this.velText.setAlpha(1);
		this.resultText.setAlpha(0);
		this.asteroid.x = 25;
		this.asteroid.y = 25;
	}
	
	resetGame(){
		this.resetAsteroid();
		this.startingVel = [0, 0];
		for(let i = 0; i < this.numBlackHoles; i++){
			this.blackholes[i].destroy();
			this.blackholes[i] = null;
		}
		this.numBlackHoles = 0;
	}
	
	incXVel(){
		if(this.startingVel[1] == 0 && this.startingVel[0] < 500){
			this.startingVel[0] += 50;
		}
	}
	
	decXVel(){
		if(this.startingVel[1] == 0 && this.startingVel[0] > -500){
			this.startingVel[0] -= 50;
		}
	}
	
	incYVel(){
		if(this.startingVel[0] == 0 && this.startingVel[1] < 500){
			this.startingVel[1] += 50;
		}
	}
	
	decYVel(){
		if(this.startingVel[0] == 0 && this.startingVel[1] > -500){
			this.startingVel[1] -= 50;
		}
	}
	
	endGameLoss(){
		this.runGame = false;
		this.asteroid.setVelocity(0);
		this.asteroid.setAcceleration(0);
		this.resultText.setText("The asteroid was sucked into a black hole! You lose!\nPress \"a\" or \"r\" to reset and try again");
		this.resultText.setAlpha(1);
	}
	
	endGameWin(){
		this.runGame = false;
		this.asteroid.setVelocity(0);
		this.asteroid.setAcceleration(0);
		this.resultText.setText("The asteroid successfully collided with the planet! You win!\nPress \"a\" or \"r\" to reset and try other black hole placements");
		this.resultText.setAlpha(1);
	}
	
	createBlackHole(pointer){
		if(this.numBlackHoles < 3 && pointer.leftButtonReleased()){
			this.blackholes[this.numBlackHoles] = this.physics.add.sprite(pointer.worldX, pointer.worldY, 'blackhole');
			this.blackholes[this.numBlackHoles].setScale(0.25);
			this.physics.add.overlap(this.asteroid, this.blackholes[this.numBlackHoles], this.endGameLoss, null, this);
			this.numBlackHoles++;
		}
		else if(this.numBlackHoles > 0 && pointer.rightButtonReleased()){
			this.blackholes[this.numBlackHoles - 1].destroy();
			this.blackholes[this.numBlackHoles - 1] = null;
			this.numBlackHoles--;
		}
	}
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: MyScene,
    physics: { default: 'arcade' },
    });


/*Iteration ideas
	- Sound effects for when the asteroid is rounding the apex of its turn
	- semi-random earth locations
	- spaceships as blocker walls
	- Sound effects for winning (explosion) and losing (sound of asteroid getting sucked into a black hole)
	- Win and loss animations (asteroid getting sucked into black hole, planet exploding)
	- Clicking on a black hole to change its location without having to remove and replace it
	- Complete premise rework: Planets are obstacles, navigate the asteroid out of the system without touching the planets
*/