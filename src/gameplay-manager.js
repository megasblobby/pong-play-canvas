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

GameplayManager.attributes.add('cornerTopLeft', { //aggiunto 5/2
    type: 'vec2',
    default: [-13, 6.5] //i valori di default me li ha ignorati
});

GameplayManager.attributes.add('cornerBottomRight', { //aggiunto 5/2
    type: 'vec2',
    default: [13, -6.5] //i valori di default me li ha ignorati
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


// initialize code called once per entity
GameplayManager.prototype.initialize = function() {
    this.NORMAL_LEFT_PADDLE = 0; this.NORMAL_RIGHT_PADDLE = 1;
    this.NORMAL_LEFT_BORDER = 0; this.NORMAL_RIGHT_BORDER = 1;
    this.NORMAL_TOP_BORDER = 2; this.NORMAL_BOTTOM_BORDER = 3;
    this.normals = [new pc.Vec3(1, 0, 0), new pc.Vec3(-1, 0, 0),
                    new pc.Vec3(0, -1, 0), new pc.Vec3(0, 1, 0)];
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
        }
    }
    if (this.ball.position.x > this.maxX) {
        if (this.isBallYBetweenPaddleExtremes(this.ball.position.y, this.paddleRight)) {
            this.ball.script.ballManager.__attributes.direction = this.changeBallDirection(ballDirection.clone(), this.normals[this.NORMAL_RIGHT_PADDLE]);
          
            deltaY = this.ball.position.y - this.paddleRight.position.y;
            this.ball.script.ballManager.__attributes.direction.y += deltaY * this.bounceFactor;
            
            this.ball.setPosition(this.maxX, this.ball.position.y, this.ball.position.z);
        }
    }
    this.borderHit(this.ball, this.bounceFactor);
};

GameplayManager.prototype.isBallYBetweenPaddleExtremes = function(ballY, paddle) {
    var paddleHalfHeight = paddle.getWorldTransform().getScale().y / 2;
    var paddleMaxY = paddle.position.y + paddleHalfHeight;
    var paddleMinY = paddle.position.y - paddleHalfHeight;
    
    return ballY <= paddleMaxY && ballY >= paddleMinY;
};

/*GameplayManager.prototype.changeBallDirection = function(ball, paddle, bounceFactor) {
    var ballDirection = ball.script.ballManager.__attributes.direction;
    var deltaY = ball.position.y - paddle.position.y;
    ballDirection.y += deltaY * bounceFactor;
    ballDirection.x *= -1;
};*/

GameplayManager.prototype.changeBallDirection = function(ballDirection, normal) {
    var originalBallDirection = ballDirection.clone();
    //console.log("originalBallDirection: " + originalBallDirection );
    var negativeBallDirection = ballDirection.clone().scale(-1);
    //console.log("negativeBallDirection: " + negativeBallDirection );
    var dotProduct = negativeBallDirection.dot(normal);
    //console.log("dotProduct: " + dotProduct );
    var normalScaled = normal.clone().scale(dotProduct);
    //console.log("normalScaled: " + normalScaled );
    var normalScaledDoubled = normalScaled.scale(2);
    //console.log("normalScaledDoubled: " + normalScaledDoubled );
    var newDirection = new pc.Vec3().add2(originalBallDirection, normalScaledDoubled);
    //console.log("normalScaledDoubled + ballDirection: " + newDirection);
    //console.log("attribute Direction: " + ballDirection);
    return newDirection;
};

//aggiunto 5/2 - controllo collisione col bordo dello schermo spostato da ballManager a gameplayManager
//fatto giusto per capire se avevo capito
//l'idea era di fare un unico controllo per le collisioni, sia con le racchette che con i bordi
//col metodo changeBallDirection attuale i bordi dovrebbero essere creati come entities e passati normalmente
//esempio: GameplayManager.prototype.changeBallDirection = function(ball, SURFACE, bounceFactor)
//conviene? è bello?
GameplayManager.prototype.borderHit = function(ball, bounceFactor) {
    var ballDirection = ball.script.ballManager.__attributes.direction;
    var newDirection = new pc.Vec3();
    if (ball.position.x < this.cornerTopLeft.x) {
        newDirection = this.changeBallDirection(ballDirection.clone(), this.normals[this.NORMAL_LEFT_BORDER]); 
        ball.script.ballManager.__attributes.direction = newDirection;
        
        ball.setPosition(this.cornerTopLeft.x, ball.getPosition().y, ball.getPosition().z); 
    }
    if (ball.position.x > this.cornerBottomRight.x) {
        newDirection = this.changeBallDirection(ballDirection.clone(), this.normals[this.NORMAL_RIGHT_BORDER]); 
        ball.script.ballManager.__attributes.direction = newDirection;
        
        ball.setPosition(this.cornerBottomRight.x, ball.getPosition().y, ball.getPosition().z);
    }
    if (ball.position.y < this.cornerBottomRight.y) {
        newDirection = this.changeBallDirection(ballDirection.clone(), this.normals[this.NORMAL_BOTTOM_BORDER]); 
        ball.script.ballManager.__attributes.direction = newDirection;
        
        ball.setPosition(ball.getPosition().x, this.cornerBottomRight.y, ball.getPosition().z);
    }
    if (ball.position.y > this.cornerTopLeft.y) {   
        newDirection =  this.changeBallDirection(ballDirection.clone(), this.normals[this.NORMAL_TOP_BORDER]);
        ball.script.ballManager.__attributes.direction = newDirection.clone(); 
        
        ball.setPosition(ball.getPosition().x, this.cornerTopLeft.y, ball.getPosition().z);
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// GameplayManager.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/