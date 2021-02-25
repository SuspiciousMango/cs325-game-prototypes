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

var config = {
    type: Phaser.AUTO,
	parent: 'game',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var platforms;
var chest;
var dummyTreasure;
var treasureGroup;
var treasureChildren;
var cursors;
var totalTreasure = 0;
var paused = false;
var treasureText;
var stepSound;
var stepSoundTimer = 0;
var chestSound;
var wavesSound;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
	this.load.spritesheet('chest', 'assets/Chest.png', {frameWidth: 32, frameHeight: 32});
	this.load.spritesheet('treasure', 'assets/Treasure.png', {frameWidth: 32, frameHeight: 32});
	
	this.load.audio('step', 'assets/wood1.ogg');
	this.load.audio('chestUnlock', 'assets/chest unlock.wav');
	this.load.audio('waves', 'assets/waves.wav');
}

function create ()
{
    //  A simple background for our game
    this.add.image(400, 300, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    //  Now let's create some ledges
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');
	
	chest = this.physics.add.sprite(Phaser.Math.Between(200, 784), Phaser.Math.Between(16, 504), 'chest', 0);
	chest.setBounce(0.1);

    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'dude');

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.1);
    player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
	
	//sounds
	stepSound = this.sound.add('step');
	chestSound = this.sound.add('chestUnlock');
	wavesSound = this.sound.add('waves');
	wavesSound.play({loop: true});

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    treasureGroup = this.physics.add.staticGroup({
        key: 'treasure',
		frames: this.anims.generateFrameNumbers('treasure', {start: 0, end: 4}),
        repeat: 4,
        setXY: { x: 40, y: 72, stepX: 64 }
    });

	treasureChildren = treasureGroup.getChildren();
    for(let i = 0; i < treasureChildren.length; i++){
		let child = treasureChildren[i];
		child.setTexture('treasure', i);
		child.disableBody(true, true);
	}
	
	dummyTreasure = this.add.sprite(16, 16, 'treasure', 0);
	dummyTreasure.setAlpha(0);

    //bombs = this.physics.add.group();
	

    //  The score
    totalTreasure = this.add.text(16, 16, 'Unique Treasure Pieces Collected:', { fontSize: '32px', fill: '#000' });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(chest, platforms);
    //this.physics.add.collider(bombs, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, chest, collectTreasure, null, this);

    //this.physics.add.collider(player, bombs, hitBomb, null, this);
	
	this.input.keyboard.on('keydown-ENTER', resumeGame, this);
}

function update ()
{
	if (paused)
    {
        return;
    }

    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);
        player.anims.play('left', true);
		if(stepSoundTimer == 0 && player.body.touching.down){
			stepSound.play();
		}
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);
        player.anims.play('right', true);
		if(stepSoundTimer == 0 && player.body.touching.down){
			stepSound.play();
		}
    }
    else
    {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
	
    if(stepSoundTimer == 0){
		stepSoundTimer = 21;
	}
	stepSoundTimer--;
}

function collectTreasure (player, chest)
{
	this.physics.pause();
	paused = true;
	chestSound.play();
	chest.setTexture('chest', 1);
	player.anims.play('turn');
	let randomInt = Phaser.Math.Between(0, 4);
	dummyTreasure.setTexture('treasure', randomInt);
	dummyTreasure.setX(chest.x);
	dummyTreasure.setY(chest.y - 16);
	dummyTreasure.setAlpha(1);
	let child = treasureChildren[randomInt];
	if(child.active == false){
		treasureText = this.add.text(5, this.cameras.main.centerY - 32, 'Congratulations!!\nNew Treasure Collected!\nPress ENTER to continue.', { fontSize: '32px', fill: '#000' });
		child.enableBody(true, child.x, child.y, true, true);
	}
	else{
		treasureText = this.add.text(5, this.cameras.main.centerY - 32, 'Unfortunately it looks like you\nhad this one already. Try again!\nPress ENTER to continue.', { fontSize: '32px', fill: '#000' });
	}

    /*//  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0)
    {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    }*/
}

function resumeGame(){
	treasureText.destroy();
	if(treasureGroup.countActive(false) > 0){
		chest.setRandomPosition(16, 16, 768, 488);
		chest.setTexture('chest', 0);
		dummyTreasure.setAlpha(0);
		paused = false;
		this.physics.resume();
	}
	else{
		treasureText = this.add.text(5, this.cameras.main.centerY - 32, 'CONGRATULATIONS!!\nYou found all the treasure!\nRefresh the page to play again', { fontSize: '32px', fill: '#000' });
	}
}

/*function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}*/