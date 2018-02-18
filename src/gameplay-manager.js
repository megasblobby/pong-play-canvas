var GameplayManager = pc.createScript('gameplayManager');

GameplayManager.attributes.add('ball', {
    type: 'entity'
});

GameplayManager.attributes.add('paddleLeft', {
    type: 'entity'
});

GameplayManager.attributes.add('paddleRight', {
    type: 'entity'
});

GameplayManager.attributes.add('cornerTopLeft', {
    type: 'vec2',
    default: [-13, 6.5]
});

GameplayManager.attributes.add('cornerBottomRight', {
    type: 'vec2',
    default: [13, -6.5]
});

GameplayManager.attributes.add('minX', {
    type: 'number'
});

GameplayManager.attributes.add('maxX', {
    type: 'number'
});

GameplayManager.attributes.add('bounceFactor', {
    type: 'number',
    default: 1
});

GameplayManager.attributes.add('accelFactor', {
    type: 'number',
    default: 0.2
});

GameplayManager.attributes.add('maxScore', {
    type: 'number',
    default: 10
});

GameplayManager.attributes.add('scorePlayer1', {
    type: 'entity',
});

GameplayManager.attributes.add('scorePlayer2', {
    type: 'entity',
});

GameplayManager.attributes.add('soundtrack', {
    type: 'entity',
});


// initialize code called once per entity
GameplayManager.prototype.initialize = function() {
    this.NORMAL_LEFT_PADDLE = 0; this.NORMAL_RIGHT_PADDLE = 1;
    this.NORMAL_LEFT_BORDER = 0; this.NORMAL_RIGHT_BORDER = 1;
    this.NORMAL_TOP_BORDER = 2; this.NORMAL_BOTTOM_BORDER = 3;
    this.normals = [new pc.Vec3(1, 0, 0), new pc.Vec3(-1, 0, 0),
                    new pc.Vec3(0, -1, 0), new pc.Vec3(0, 1, 0)];
    initialSpeed = this.ball.script.ballManager.__attributes.speed;
    this.scorePlayer1.element.scoreValue = 0;
    this.scorePlayer2.element.scoreValue = 0;
};

// update code called every frame
GameplayManager.prototype.update = function(dt) {
    var ballDirection = this.ball.script.ballManager.__attributes.direction;
    var deltaY = 0;
    if (this.ball.position.x < this.minX) {
        if (this.isBallYBetweenPaddleExtremes(this.ball.position.y, this.paddleLeft)) {
            this.ball.script.ballManager.__attributes.direction = this.changeBallDirection(ballDirection.clone(), this.normals[this.NORMAL_LEFT_PADDLE]);
            
            deltaY = this.ball.position.y - this.paddleLeft.position.y;
            this.ball.script.ballManager.__attributes.direction.y += deltaY * this.bounceFactor;
            
            this.ball.setPosition(this.minX, this.ball.position.y, this.ball.position.z);
            this.ball.script.ballManager.__attributes.speed+=this.accelFactor;
            this.soundtrack.sound.play('Pong');
        }
    }
    if (this.ball.position.x > this.maxX) {
        if (this.isBallYBetweenPaddleExtremes(this.ball.position.y, this.paddleRight)) {
            this.ball.script.ballManager.__attributes.direction = this.changeBallDirection(ballDirection.clone(), this.normals[this.NORMAL_RIGHT_PADDLE]);
          
            deltaY = this.ball.position.y - this.paddleRight.position.y;
            this.ball.script.ballManager.__attributes.direction.y += deltaY * this.bounceFactor;
            
            this.ball.setPosition(this.maxX, this.ball.position.y, this.ball.position.z);
            this.ball.script.ballManager.__attributes.speed+=this.accelFactor;
            this.soundtrack.sound.play('Pong');
        }
    }
    this.borderHit(this.ball, this.bounceFactor);
    
    this.scorePlayer1.element.text = this.scorePlayer1.element.scoreValue;
    this.scorePlayer2.element.text = this.scorePlayer2.element.scoreValue;

};

GameplayManager.prototype.isBallYBetweenPaddleExtremes = function(ballY, paddle) {
    var paddleHalfHeight = paddle.getWorldTransform().getScale().y / 2;
    var paddleMaxY = paddle.position.y + paddleHalfHeight;
    var paddleMinY = paddle.position.y - paddleHalfHeight;
    
    return ballY <= paddleMaxY && ballY >= paddleMinY;
};


GameplayManager.prototype.changeBallDirection = function(ballDirection, normal) {
    var originalBallDirection = ballDirection.clone();
    var negativeBallDirection = ballDirection.clone().scale(-1);
    var dotProduct = negativeBallDirection.dot(normal);
    var normalScaled = normal.clone().scale(dotProduct);
    var normalScaledDoubled = normalScaled.scale(2);
    var newDirection = new pc.Vec3().add2(originalBallDirection, normalScaledDoubled);
    
    return newDirection;
};


GameplayManager.prototype.borderHit = function(ball, bounceFactor) {
    var ballDirection = ball.script.ballManager.__attributes.direction;
    var newDirection = new pc.Vec3();
    // rimbalzo a sinistra
    if (ball.position.x < this.cornerTopLeft.x) {
        newDirection = this.changeBallDirection(ballDirection.clone(), this.normals[this.NORMAL_LEFT_BORDER]); 
        ball.script.ballManager.__attributes.direction = newDirection;
        ball.script.ballManager.__attributes.speed+=this.accelFactor;
        this.soundtrack.sound.play('Pong');
        
        ball.setPosition(this.cornerTopLeft.x, ball.getPosition().y, ball.getPosition().z);
        this.scorePlayer2.element.scoreValue++;
        ball.script.ballManager.__attributes.speed = initialSpeed;
        if (this.scorePlayer2.element.scoreValue >= this.maxScore) {
            this.scorePlayer1.element.scoreValue = 0;
            this.scorePlayer2.element.scoreValue = 0;
            this.soundtrack.sound.play('Win');
        }
    }
    // rimbalzo a destra
    if (ball.position.x > this.cornerBottomRight.x) {
        newDirection = this.changeBallDirection(ballDirection.clone(), this.normals[this.NORMAL_RIGHT_BORDER]); 
        ball.script.ballManager.__attributes.direction = newDirection;
        ball.script.ballManager.__attributes.speed+=this.accelFactor;
        this.soundtrack.sound.play('Pong');
        
        ball.setPosition(this.cornerBottomRight.x, ball.getPosition().y, ball.getPosition().z);
        this.scorePlayer1.element.scoreValue++;
        ball.script.ballManager.__attributes.speed = initialSpeed;
        if (this.scorePlayer1.element.scoreValue >= this.maxScore) {
            this.scorePlayer1.element.scoreValue = 0;
            this.scorePlayer2.element.scoreValue = 0;
            this.soundtrack.sound.play('Win');
        }
    }
    // rimbalzo in basso
    if (ball.position.y < this.cornerBottomRight.y) {
        newDirection = this.changeBallDirection(ballDirection.clone(), this.normals[this.NORMAL_BOTTOM_BORDER]); 
        ball.script.ballManager.__attributes.direction = newDirection;
        
        ball.setPosition(ball.getPosition().x, this.cornerBottomRight.y, ball.getPosition().z);
        ball.script.ballManager.__attributes.speed+=this.accelFactor;
        this.soundtrack.sound.play('Pong');
    }
    // rimbalzo in alto
    if (ball.position.y > this.cornerTopLeft.y) {   
        newDirection =  this.changeBallDirection(ballDirection.clone(), this.normals[this.NORMAL_TOP_BORDER]);
        ball.script.ballManager.__attributes.direction = newDirection.clone(); 
        
        ball.setPosition(ball.getPosition().x, this.cornerTopLeft.y, ball.getPosition().z);
        ball.script.ballManager.__attributes.speed+=this.accelFactor;
        this.soundtrack.sound.play('Pong');
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// GameplayManager.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/