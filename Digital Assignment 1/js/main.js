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
    }
    
    preload() {
        // Load an image and call it 'logo'.
        //this.load.image( 'logo', 'assets/phaser.png' );
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
    }
    
    create() {
        // Create a sprite at the center of the screen using the 'logo' image.
        this.bouncy = this.physics.add.sprite( this.cameras.main.centerX, this.cameras.main.centerX, 'logo' );
		this.img_background = this.physics.add.sprite( 0, 0, 'background' );
		this.img_bird = this.physics.add.sprite( 0, 0, 'bird' );
		this.img_tree = this.physics.add.sprite( 0, 0, 'tree' );
		this.img_office = this.physics.add.sprite( 0, 0, 'office' );
		this.img_mouse = this.physics.add.sprite( 0, 0, 'mouse' );
		this.img_mouse_cover = this.physics.add.sprite( 0, 0, 'mouse_cover' );
		this.img_rug = this.physics.add.sprite( 0, 0, 'rug' );
		this.img_coffee_mug = this.physics.add.sprite( 0, 0, 'coffee_mug' );
		this.img_coffee_mug_spilled = this.physics.add.sprite( 0, 0, 'coffee_mug_spilled' );
		this.img_man = this.physics.add.sprite( 0, 0, 'man' );
        
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
