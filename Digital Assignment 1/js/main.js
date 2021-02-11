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
        
		//create all local variables
		
		//create all image variables
        this.img_background = null;
		this.img_bird = null;
		this.img_tree = null;
		this.img_office = null;
		this.img_mouse = null;
		this.img_mouse_cover = null;
		this.img_rug = null;
		this.img_coffee_mug = null;
		this.img_coffee_mug_spilled = null;
		this.img_man = null;
		
		//create all sound variables
		this.snd_bird = null;
		this.snd_mouse = null;
		this.snd_keyboard = null;
		this.snd_farmville = null;
		this.snd_coffee = null;
		this.snd_inner_thoughts = null;
		
		//create all variables that control game actions and movements
		this.coffeeSpilled = false;
		this.birdShouldMove = false;
		this.mouseShouldMove = false;
    }
	
    preload() {
        //Load all images
		this.load.image( 'background', 'assets/Background.png' );
		this.load.image( 'bird', 'assets/Bird.png' );
		this.load.image( 'tree', 'assets/Tree.png' );
		this.load.image( 'office', 'assets/Office.png' );
		this.load.image( 'mouse', 'assets/Mouse.png' );
		this.load.image( 'mouse_cover', 'assets/Mouse Cover.png' );
		this.load.image( 'rug', 'assets/Rug.png' );
		this.load.image( 'coffee_mug', 'assets/Coffee Mug.png' );
		this.load.image( 'coffee_mug_spilled', 'assets/Coffee Mug Spilled.png' );
		this.load.image( 'man', 'assets/Man at Desk.png' );
		
		//Load all audio
		this.load.audio('bird_sound', 'assets/bird.ogg');
		this.load.audio('mouse_sound', 'assets/mouse.ogg');
		this.load.audio('keyboard', 'assets/typing.ogg');
		this.load.audio('farmville', 'assets/farmville.ogg');
		this.load.audio('coffee', 'assets/coffee.ogg');
		this.load.audio('inner_thoughts', 'assets/thoughts.ogg');
		this.load.audio('outside', 'assets/outside.ogg');
		this.load.audio('empty_office', 'assets/empty.ogg');
    }
    
    create() {
		//var graphics = this.add.graphics();
		
		//Create all the image sprites
		this.img_background = this.add.sprite( this.cameras.main.centerX, this.cameras.main.centerY, 'background' );
		this.img_bird = this.add.sprite( this.cameras.main.centerX, this.cameras.main.centerY, 'bird' );
		this.img_tree = this.add.sprite( this.cameras.main.centerX, this.cameras.main.centerY, 'tree' );
		this.img_office = this.add.sprite( this.cameras.main.centerX, this.cameras.main.centerY, 'office' );
		this.img_mouse = this.add.sprite( this.cameras.main.centerX, this.cameras.main.centerY, 'mouse' );
		this.img_mouse_cover = this.add.sprite( this.cameras.main.centerX, this.cameras.main.centerY, 'mouse_cover' );
		this.img_rug = this.add.sprite( this.cameras.main.centerX, this.cameras.main.centerY, 'rug' );
		this.img_coffee_mug = this.add.sprite( this.cameras.main.centerX, this.cameras.main.centerY, 'coffee_mug' );
		this.img_coffee_mug_spilled = this.add.sprite( this.cameras.main.centerX, this.cameras.main.centerY, 'coffee_mug_spilled' );
		//Make the spilled mug invisible for now
		this.img_coffee_mug_spilled.setAlpha(0);
		this.img_man = this.add.sprite( this.cameras.main.centerX, this.cameras.main.centerY, 'man' );
		
		//create all sound events
		this.snd_bird = this.sound.add('bird_sound');
		this.snd_mouse = this.sound.add('mouse_sound');
		this.snd_keyboard = this.sound.add('keyboard');
		this.snd_farmville = this.sound.add('farmville');
		this.snd_coffee = this.sound.add('coffee');
		this.snd_inner_thoughts = this.sound.add('inner_thoughts');
		this.snd_outside = this.sound.add('outside');
		this.snd_empty = this.sound.add('empty_office');
		
		
		//all input for this game is handled by the one pointerdown callback function... oh boy
		this.input.on('pointerdown', function (pointer){
			var currX = pointer.x;
			var currY = pointer.y;
			/*template:
			if(currX >= MIN && currY >= MIN && currX <= MAX && currY <= MAX){
				do the thing
			}
			*/
			//when the coffee mug is clicked on, it spills over
			if(currX >= 561 && currY >= 87 && currX <= 650 && currY <= 130){
				this.scene.snd_bird.play();
				this.scene.birdShouldMove = true;
			}
			if(currX >= 714 && currY >= 349 && currX <= 728 && currY <= 374){
				this.scene.snd_mouse.play();
				this.scene.mouseShouldMove = true;
			}
			if(currX >= 372 && currY >= 247 && currX <= 424 && currY <= 268){
				this.scene.snd_keyboard.play();
			}
			if(currX >= 263 && currY >= 150 && currX <= 377 && currY <= 246){
				this.scene.snd_farmville.play();
			}
			if(currX >= 484 && currY >= 154 && currX <= 512 && currY <= 185){
				this.scene.snd_coffee.play();
			}
			if(currX >= 391 && currY >= 162 && currX <= 468 && currY <= 212){
				this.scene.snd_inner_thoughts.play();
			}
			if(currX >= 54 && currY >= 87 && currX <= 280 && currY <= 183){
				this.scene.snd_outside.play();
			}
			if(currX >= 0 && currY >= 192 && currX <= 248 && currY <= 437){
				this.scene.snd_empty.play();
			}
		});
		
        
        // Make it bounce off of the world bounds.
        /*this.bouncy.body.collideWorldBounds = true;
        
        // Make the camera shake when clicking/tapping on it.
        this.bouncy.setInteractive();
        this.bouncy.on( 'pointerdown', function( pointer ) {
            this.scene.cameras.main.shake(500);
            });
        
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        let style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        //let text = this.add.text( this.cameras.main.centerX, 15, "Build something amazing.", style );
        //text.setOrigin( 0.5, 0.0 );*/
    }
    
    update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //this.bouncy.rotation = this.physics.accelerateToObject( this.bouncy, this.input.activePointer, 500, 500, 500 );
		//var color = 0xffff00;
		//var thickness = 2;
		//var alpha = 1;
		
		//graphics.clear();
		//graphics.lineStyle(thickness, color, alpha);
		//graphics.strokeRect(484, 154, 512 - 484, 185 - 154);
		if(this.birdShouldMove && this.img_bird.y < this.cameras.main.centerY + 65){
			this.img_bird.x -= 1;
			this.img_bird.y += 1;
		}
		
		if(this.mouseShouldMove && this.img_mouse.x > this.cameras.main.centerX - 40){
			this.img_mouse.x -= 2;
		}
		else if(this.mouseShouldMove && this.img_mouse.x > 50){
			this.img_mouse.x -= 2;
			this.img_mouse.y += 1;
		}
		else{
			this.img_mouse.x = this.cameras.main.centerX;
			this.img_mouse.y = this.cameras.main.centerY;
			this.mouseShouldMove = false;
		}
		if(this.coffeeSpilled == true){
			this.coffee_mug.setAlpha(0);
			this.coffee_mug_spilled.setAlpha(1);
		}
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: MyScene,
    audio: {
        disableWebAudio: true
    }
    });
