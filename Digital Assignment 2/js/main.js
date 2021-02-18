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
		this.cheese = null;
		this.pooptimer = 20;
		this.poopcounter = 0;
		//this.gameRun = true;
    }
    
    preload() {
        // Load an image and call it 'logo'.
        this.load.image( 'mouse', 'assets/Mouse.png' );
		this.load.image('mousehome', 'assets/Mouse Home.png');
		this.load.spritesheet('poops', 'assets/Poops.png', {frameWidth: 30, frameHeight: 30});
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
        
        // Make it bounce off of the world bounds.
        this.mouse.body.collideWorldBounds = true;
		
		this.physics.add.overlap(this.mousehome, this.mouse, function(){this.scene.start('EndScene');}, function(){return true;}, this);
        
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        //let style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        //let text = this.add.text( this.cameras.main.centerX, 15, "Build something amazing.", style );
        //text.setOrigin( 0.5, 0.0 );
    }
    
    update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
		//if(gameRun){
			this.mouse.rotation = this.physics.accelerateToObject( this.mouse, this.input.activePointer, 150, 150, 150 );
			if(this.pooptimer == 0){
				this.add.image(this.mouse.x, this.mouse.y, 'poops', Phaser.Math.Between(0, 8));
				this.pooptimer = 20;
				poopcounter++;
			}
			else{
				this.pooptimer--;
			}
		//}
	}
}

class EndScene extends Phaser.Scene{
	constructor(){
		super('EndScene');
	}
	
	preload(){
		
	}
	
	create(){
		let str = "Congratulations!!\nYou successfully got the mouse\nto the mouse house in only " + poopcounter + " poops!\nThe mouse started " + mousedistance + " units from the house.\nRefresh the page to play again"
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
