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

let poopcounter = 0;
let mousedistance = 0;

class MyScene extends Phaser.Scene {
    
    constructor() {
        super('PlayScene');
        this.mouse = null;
		this.mousehome = null;
		this.cursors = null;
		//this.cheese = null;
		this.pooptimer = 100;
		this.poopFunc = null;
		//this.poopcounter = 0;
		//this.gameRun = true;
		this.effectText = null;
		this.textTimer = 0;
		this.EFF_Boost = false;
		this.TMR_Boost = 0;
		this.TMR_Scale = 0;
		this.EFF_HomeMove = false;
		this.TMR_HomeMove = 0;
		this.squeakSound = null;
    }
    
    preload() {
        // Load an image and call it 'logo'.
        this.load.image( 'mouse', 'assets/Mouse.png' );
		this.load.image('mousehome', 'assets/Mouse Home.png');
		this.load.spritesheet('poops', 'assets/Poops.png', {frameWidth: 30, frameHeight: 30});
		this.load.audio('squeak', 'assets/mouse squeak 2.ogg');
    }
    
    create() {
        // Create a sprite at the center of the screen using the 'logo' image.
		let randomMouseX = Phaser.Math.Between(37, 763);
		let randomMouseY = Phaser.Math.Between(37, 563);
		let randomHomeX = Phaser.Math.Between(50, 750);
		let randomHomeY = Phaser.Math.Between(50, 550);
		let distanceX = Math.pow(randomHomeX - randomMouseX, 2);
		let distanceY = Math.pow(randomHomeY - randomMouseY, 2);
		mousedistance = Math.round(Math.sqrt(distanceX + distanceY));
		this.mousehome = this.physics.add.sprite(randomHomeX, randomHomeY, 'mousehome');
        this.mouse = this.physics.add.sprite( randomMouseX, randomMouseY, 'mouse' );
		this.squeakSound = this.sound.add('squeak');
        
        // Make it bounce off of the world bounds.
        this.mouse.body.collideWorldBounds = true;
		this.mouse.setDrag(100);
		
		this.mousehome.body.collideWorldBounds = true;
		this.mousehome.setDrag(500);
		
		this.physics.add.overlap(this.mousehome, this.mouse, function(){this.scene.start('EndScene');}, null, this);
		
		this.cursors = this.input.keyboard.createCursorKeys();
		
		this.poopFunc = function(){
			if(this.pooptimer == 0){
				let poopNo = Phaser.Math.Between(0, 8)
				this.add.image(this.mouse.x, this.mouse.y, 'poops', poopNo);
				poopcounter++;
				this.pooptimer = 100;
				this.mouse.clearTint();
				this.squeakSound.play();
				let style = { font: "25px Verdana", fill: "#ffffff", align: "center" };
				switch(poopNo){
					case 0:			//red poop
						this.EFF_Boost = true;
						this.TMR_Boost = 40;
						this.effectText = this.add.text( this.cameras.main.centerX, 600, "Boost pooperup activated!", style );
						this.textTimer = 80;
						break;
					case 1:			//orange poop
						this.effectText = this.add.text( this.cameras.main.centerX, 600, "Pooperup not implemented", style );
						this.textTimer = 80;
						break;
					case 2:			//yellow poop
						this.effectText = this.add.text( this.cameras.main.centerX, 600, "Pooperup not implemented", style );
						this.textTimer = 80;
						break;
					case 3:			//green poop
						this.mouse.setScale(2);
						this.TMR_Scale = 40;
						this.effectText = this.add.text( this.cameras.main.centerX, 600, "Scale pooperup activated!", style );
						this.textTimer = 80;
						break;
					case 4:			//blue poop
						this.effectText = this.add.text( this.cameras.main.centerX, 600, "Pooperup not implemented", style );
						this.textTimer = 80;
						break;
					case 5:			//purple poop
						this.effectText = this.add.text( this.cameras.main.centerX, 600, "Teleportation pooperup activated!", style );
						this.textTimer = 80;
						this.mouse.setX(Phaser.Math.Between(37, 763));
						this.mouse.setY(Phaser.Math.Between(37, 563));
						break;
					case 6:			//white poop
						this.EFF_HomeMove = true;
						this.TMR_HomeMove = 40;
						this.effectText = this.add.text( this.cameras.main.centerX, 600, "Home move pooperup activated!", style );
						this.textTimer = 80;
						break;
					case 7:			//grey poop
						this.effectText = this.add.text( this.cameras.main.centerX, 600, "Pooperup not implemented", style );
						this.textTimer = 80;
						break;
					case 8:			//brown poop
						this.effectText = this.add.text( this.cameras.main.centerX, 600, "No powerup. This one is just a regular poop...", style );
						this.textTimer = 80;
						break;
				}
				this.effectText.setOrigin(0.5, 1.0);
			}
		};
		
		this.input.keyboard.on('keydown-SPACE', this.poopFunc, this);
        
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        //let style = { font: "15px Verdana", fill: "#9999ff", align: "center" };
        //let text = this.add.text( this.cameras.main.centerX, 15, "Build something amazing.", style );
        //text.setOrigin( 0.5, 0.0 );
    }
    
    update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
		//this.mouse.rotation = this.physics.accelerateToObject( this.mouse, this.input.activePointer, 150, 150, 150 );
		
		//movement stuff
		if (this.cursors.left.isDown){
			if(this.EFF_Boost){
				this.mouse.setVelocityX(-200);
			}
			else{
				this.mouse.setVelocityX(-100);
			}
			//this.mouse.setAccelerationX(100);
			this.mouse.setFlipX(true);
			this.mouse.setAngle(0);
		}
		else if (this.cursors.right.isDown){
			if(this.EFF_Boost){
				this.mouse.setVelocityX(200);
			}
			else{
				this.mouse.setVelocityX(100);
			}
			//this.mouse.setAccelerationX(-100);
			this.mouse.resetFlip();
			this.mouse.setAngle(0);
		}
		if (this.cursors.down.isDown){
			if(this.EFF_Boost){
				this.mouse.setVelocityY(200);
			}
			else{
				this.mouse.setVelocityY(100);
			}
			//this.mouse.setAccelerationY(-100);
			this.mouse.resetFlip();
			this.mouse.setAngle(90);
		}
		else if (this.cursors.up.isDown){
			if(this.EFF_Boost){
				this.mouse.setVelocityY(-200);
			}
			else{
				this.mouse.setVelocityY(-100);
			}
			//this.mouse.setAccelerationY(100);
			this.mouse.resetFlip();
			this.mouse.setAngle(270);
		}
		
		//powerup stuff not related to movement
		if(this.EFF_HomeMove){
			this.physics.accelerateToObject( this.mousehome, this.mouse, 150, 150, 150 );
		}
		
		//all the timer decrements go at the end for maximum time active
		if(this.pooptimer != 0){
			//this.add.image(this.mouse.x, this.mouse.y, 'poops', Phaser.Math.Between(0, 8));
			//this.pooptimer = 20;
			this.pooptimer--;
			if(this.pooptimer == 0){
				this.mouse.setTint(0xf3bf97);
			}
		}
		if(this.textTimer != 0){
			this.textTimer--;
			if(this.textTimer == 0){
				this.effectText.destroy();
			}
		}
		if(this.TMR_Boost != 0){
			this.TMR_Boost--;
			if(this.TMR_Boost == 0){
				this.EFF_Boost = false;
			}
		}
		if(this.TMR_Scale != 0){
			this.TMR_Scale--;
			if(this.TMR_Scale == 0){
				this.mouse.setScale(1);
			}
		}
		if(this.TMR_HomeMove != 0){
			this.TMR_HomeMove--;
			if(this.TMR_HomeMove == 0){
				this.EFF_HomeMove = false;
				this.mousehome.setVelocity(0);
				this.mousehome.setAcceleration(0);
			}
		}
	}
}

class EndScene extends Phaser.Scene{
	constructor(){
		super('EndScene');
	}
	
	preload(){
		
	}
	
	create(){
		let str = "Congratulations!!\nYou successfully got the mouse\nto the mouse house using only " + poopcounter + " pooperups!\nThe mouse started " + mousedistance + " units from the house.\nRefresh the page to play again"
		let style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        let text = this.add.text( this.cameras.main.centerX, this.cameras.main.centerY - 100, str, style );
        text.setOrigin( 0.5, 0.0 );
	}
	
	update(){
		
	}
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
	backgroundColor: '#000000',
    scene: [MyScene, EndScene],
    physics: { default: 'arcade' },
    });
