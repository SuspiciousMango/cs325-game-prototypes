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
        
        this.bg = null;
		this.title = null;
		this.imgKeys = null;
		this.result = 0;
		this.wins = [0, 0];
		this.p1img = null;
		this.p1Choice = 0;
		//I am commenting out everything related to the upgrade system as it made the whole game way too confusing, both from an input perspective and a gameplay perspective
		//I might revisit this for my iteration
		//this.p1Upgrade = false;
		//this.p1UpgImg = null;
		this.p1Done = false;
		this.p1WinCount = null;
		this.p2img = null;
		this.p2Choice = 0;
		//this.p2Upgrade = false;
		//this.p2UpgImg = null;
		this.p2Done = false;
		this.p2WinCount = null;
		this.titleOn = true;
		this.titleText = null;
		this.winText = null;
		this.playgame = false;
		this.gameKeys = null;
    }
    
    preload() {
        this.load.image('background', 'assets/Background.png');
		this.load.image('title', 'assets/TitleBG.png');
		this.load.image('check', 'assets/Check.png');
		this.load.image('rock', 'assets/Rock.png');
		this.load.image('paper', 'assets/Paper.png');
		this.load.image('scissors', 'assets/Scissors.png');
		this.load.image('purse', 'assets/Purse.png');
		this.load.image('can', 'assets/Can.png');
		this.load.image('coin', 'assets/Coin.png');
		//this.load.image('upgrade', 'assets/Upgrade.png');
    }
    
    create() {
		this.imgKeys = ['check', 'rock', 'paper', 'scissors', 'purse', 'can', 'coin'];
		
		this.bg = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'background');
		this.p1img = this.add.sprite(75, 300, this.imgKeys[this.p1Choice]);
		this.p1img.setAlpha(0.0);
		//this.p1UpgImg = this.add.sprite(75, 300, 'upgrade');
		//this.p1UpgImg.setAlpha(0.0);
		this.p2img = this.add.sprite(725, 300, this.imgKeys[this.p2Choice]);
		this.p2img.setAlpha(0.0);
		//this.p2UpgImg = this.add.sprite(725, 300, 'upgrade');
		//this.p2UpgImg.setAlpha(0.0);
		
        this.title = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'title');
        
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        let style = { font: "25px Verdana", fill: "#ffffff", align: "center" };
		let style2 = { font: "25px Verdana", fill: "#000000", align: "center" };
        this.titleText = this.add.text( this.cameras.main.centerX, 15, "Welcome to Rock, Paper, Scissors... TWO! Custom Coliseum\n\nThis game builds on the classic game of Rock, Paper, Scissors \nwith an additional triangle of objects to choose from:\nthe Purse, Coin, and Can\n\nEach player selects the object they want to play using either\nthe numbers 1-6 (Red corner) or\nthe numpad 1-6 (Blue corner)\n\nThere is a chart in the middle of the playing field on\nthe next screen that details every interaction\n\nPress \"enter\" to play!\n(Object \"upgrades\" coming soon(tm))\n(One player mode coming soon(tm))", style );
        //Unused upgrade text:
		//There is also an upgrade system, and\neach piece can be \"upgraded\" to act the reverse of its normal self\n(Rock beats Paper, but loses to Scissors)\nThis does not affect how the object interacts with\nobjects from the other triangle\n(Rock still beats Can and still loses to Coin)\nThey are activated by pressing ~ (Red corner) or numpad 0 (Blue corner)\n\n
		this.titleText.setOrigin(0.5, 0.0);
		this.winText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, '', style);
		this.winText.setOrigin(0.5, 0.5);
		this.winText.setAlpha(0.0);
		this.p1WinCount = this.add.text(10, 10, "Wins: " + this.wins[0], style2);
		this.p1WinCount.setAlpha(0.0);
		this.p2WinCount = this.add.text(790, 10, "Wins: " + this.wins[1], style2);
		this.p2WinCount.setOrigin(1.0, 0.0);
		this.p2WinCount.setAlpha(0.0);
		
		this.gameKeys = this.input.keyboard.addKeys("ONE,TWO,THREE,FOUR,FIVE,SIX,NUMPAD_ONE,NUMPAD_TWO,NUMPAD_THREE,NUMPAD_FOUR,NUMPAD_FIVE,NUMPAD_SIX");
		this.input.keyboard.on('keyup-ENTER', this.startGame, this);
		this.input.keyboard.on('keyup-SPACE', this.resetGame, this);
		//this.input.keyboard.on('keyup-BACKTICK', this.p1UpgToggle, this);
		//this.input.keyboard.on('keyup-NUMPAD_ZERO', this.p2UpgToggle, this);
		
		this.input.keyboard.addCapture('SPACE');
    }
    
    update() {
		if(this.playgame){
			if(this.p1Done && this.p2Done){
				this.playgame = false;
				this.p1img.setTexture(this.imgKeys[this.p1Choice]);
				this.p2img.setTexture(this.imgKeys[this.p2Choice]);
				//BEGIN WIN CONDITION CHECK
				//just so I dont have to type out "this.pXCheck" every time
				let p1 = this.p1Choice;
				//let p1u = this.p1Upgrade;
				let p2 = this.p2Choice;
				//let p2u = this.p2Upgrade;
				if(p1 == 1){
					//check ties
					//Rock ties against Rock and Purse
					if(p2 == 1 || p2 == 4){
						this.result = 't';
					}
					//check wins
					//Rock wins against Scissors and Can
					if(p2 == 3 || p2 == 5){
						this.result = '1';
					}
					//check losses
					//Rock loses against Paper and Coin
					if(p2 == 2 || p2 == 6){
						this.result = '2';
					}
				}
				if(p1 == 2){
					//check ties
					//Paper ties against Paper and Can
					if(p2 == 2 || p2 == 5){
						this.result = 't';
					}
					//check wins
					//Paper wins against Rock and Coin
					if(p2 == 1 || p2 == 6){
						this.result = '1';
					}
					//check losses
					//Paper loses against Scissors and Purse
					if(p2 == 3 || p2 == 4){
						this.result = '2';
					}
				}
				if(p1 == 3){
					//check ties
					//Scissors ties against Scissors and Coin
					if(p2 == 1 || p2 == 4){
						this.result = 't';
					}
					//check wins
					//Scissors wins against Paper and Purse
					if(p2 == 2 || p2 == 4){
						this.result = '1';
					}
					//check losses
					//Scissors loses against Rock and Can
					if(p2 == 1 || p2 == 5){
						this.result = '2';
					}
				}
				if(p1 == 4){
					//check ties
					//Purse ties against Purse and Rock
					if(p2 == 4 || p2 == 1){
						this.result = 't';
					}
					//check wins
					//Purse wins against Coin and Paper
					if(p2 == 6 || p2 == 2){
						this.result = '1';
					}
					//check losses
					//Purse loses against Can and Scissors
					if(p2 == 5 || p2 == 3){
						this.result = '2';
					}
				}
				if(p1 == 5){
					//check ties
					//Can ties against Can and Paper
					if(p2 == 5 || p2 == 2){
						this.result = 't';
					}
					//check wins
					//Can wins against Purse and Scissors
					if(p2 == 4 || p2 == 3){
						this.result = '1';
					}
					//check losses
					//Can loses against Coin and Rock
					if(p2 == 6 || p2 == 1){
						this.result = '2';
					}
				}
				if(p1 == 6){
					//check ties
					//Coin ties against Coin and Scissors
					if(p2 == 6 || p2 == 3){
						this.result = 't';
					}
					//check wins
					//Coin wins against Can and Rock
					if(p2 == 5 || p2 == 1){
						this.result = '1';
					}
					//check losses
					//Coin loses against Purse and Paper
					if(p2 == 4 || p2 == 2){
						this.result = '2';
					}
				}
				//END WIN CONDITION CHECK
				if(this.result == 't'){
					this.winText.setText("Tie...\nPress SPACE to play next round");
				}
				else if(this.result == '1'){
					this.winText.setText("Congratulations Red Corner!\nYour " + this.imgKeys[p1] + " beat the Blue Corner's " + this.imgKeys[p2] + "!\nPress SPACE to play next round");
					this.wins[0]++;
				}
				else if(this.result == '2'){
					this.winText.setText("Congratulations Blue Corner!\nYour " + this.imgKeys[p2] + " beat the Red Corner's " + this.imgKeys[p1] + "!\nPress SPACE to play next round");
					this.wins[1]++;
				}
				this.winText.setAlpha(1.0);
				/*if(this.p1Upgrade){
					this.p1UpgImg.setAlpha(0.8);
				}
				if(this.p2Upgrade){
					this.p2UpgImg.setAlpha(0.8);
				}*/
			}
			//1 is rock, 2 is paper, 3 is scissors, 4 is purse, 5 is can, 6 is coin
			if(!this.p1Done){
				if(this.gameKeys.ONE.isDown){
					this.p1Choice = 1;
					this.p1img.setAlpha(1.0);
					this.p1Done = true;
				}
				else if(this.gameKeys.TWO.isDown){
					this.p1Choice = 2;
					this.p1img.setAlpha(1.0);
					this.p1Done = true;
				}
				else if(this.gameKeys.THREE.isDown){
					this.p1Choice = 3;
					this.p1img.setAlpha(1.0);
					this.p1Done = true;
				}
				else if(this.gameKeys.FOUR.isDown){
					this.p1Choice = 4;
					this.p1img.setAlpha(1.0);
					this.p1Done = true;
				}
				else if(this.gameKeys.FIVE.isDown){
					this.p1Choice = 5;
					this.p1img.setAlpha(1.0);
					this.p1Done = true;
				}
				else if(this.gameKeys.SIX.isDown){
					this.p1Choice = 6;
					this.p1img.setAlpha(1.0);
					this.p1Done = true;
				}
			}
			if(!this.p2Done){
				if(this.gameKeys.NUMPAD_ONE.isDown){
					this.p2Choice = 1;
					this.p2img.setAlpha(1.0);
					this.p2Done = true;
				}
				else if(this.gameKeys.NUMPAD_TWO.isDown){
					this.p2Choice = 2;
					this.p2img.setAlpha(1.0);
					this.p2Done = true;
				}
				else if(this.gameKeys.NUMPAD_THREE.isDown){
					this.p2Choice = 3;
					this.p2img.setAlpha(1.0);
					this.p2Done = true;
				}
				else if(this.gameKeys.NUMPAD_FOUR.isDown){
					this.p2Choice = 4;
					this.p2img.setAlpha(1.0);
					this.p2Done = true;
				}
				else if(this.gameKeys.NUMPAD_FIVE.isDown){
					this.p2Choice = 5;
					this.p2img.setAlpha(1.0);
					this.p2Done = true;
				}else if(this.gameKeys.NUMPAD_SIX.isDown){
					this.p2Choice = 6;
					this.p2img.setAlpha(1.0);
					this.p2Done = true;
				}
			}
		}
    }
	
	startGame(){
		this.titleOn = false;
		this.playgame = true;
		this.titleText.setAlpha(0.0);
		this.title.setAlpha(0.0);
		this.p1WinCount.setAlpha(1.0);
		this.p2WinCount.setAlpha(1.0);
	}
	
	resetGame(){
		if(!this.playgame){
			this.p1img.setAlpha(0.0);
			//this.p1UpgImg.setAlpha(0.0);
			this.p1Choice = 0;
			this.p1img.setTexture(this.imgKeys[this.p1Choice]);
			this.p1Done = false;
		
			this.p2img.setAlpha(0.0);
			//this.p2UpgImg.setAlpha(0.0);
			this.p2Choice = 0;
			this.p2img.setTexture(this.imgKeys[this.p2Choice]);
			this.p2Done = false;
			
			this.winText.setAlpha(0.0);
			
			this.p1WinCount.setText("Wins: " + this.wins[0]);
			this.p2WinCount.setText("Wins: " + this.wins[1]);
			
			this.playgame = true;
		}
	}
	
	/*p1UpgToggle(){
		if(this.playgame){
			this.p1Upgrade = !this.p1Upgrade;
		}
	}
	
	p2UpgToggle(){
		if(this.playgame){
			this.p2Upgrade = !this.p2Upgrade;
		}
	}*/
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: MyScene,
    physics: { default: 'arcade' },
    });
