var BallManager = pc.createScript('ballManager');

//var TOP_LEFT_CORNER = new pc.Vec2(-13, 6.5);
//var BOTTOM_RIGHT_CORNER = new pc.Vec2(13, -6.5);
//var velocity = new pc.Vec2();

BallManager.attributes.add('direction', {
    type: 'vec3', default: [1, 1, 0]
});

BallManager.attributes.add('speed', { 
 type: 'number', default: 1});

// initialize code called once per entity
BallManager.prototype.initialize = function() {
    
};

// update code called every frame
BallManager.prototype.update = function(dt) {
    var velocity = this.direction.clone().normalize().scale(this.speed * dt);
    this.entity.translate(velocity.x, velocity.y, 0);
            
    /* if (this.entity.position.x < TOP_LEFT_CORNER.x) {
        this.direction.x = 1;
        this.entity.position.x = TOP_LEFT_CORNER.x;
    }
    if (this.entity.position.x > BOTTOM_RIGHT_CORNER.x) {
        this.direction.x = -1;
        this.entity.position.x = BOTTOM_RIGHT_CORNER.x;
    }

    if (this.entity.position.y < BOTTOM_RIGHT_CORNER.y) {
        this.direction.y = 1;
        this.entity.position.y = BOTTOM_RIGHT_CORNER.y;
    }
    if (this.entity.position.y > TOP_LEFT_CORNER.y) {
        this.direction.y = -1;
        this.entity.position.y = TOP_LEFT_CORNER.y;
    } */
    
    //if (this.entity.position.x - 0.5 <= -7.25) {}
    
};

// swap method called for script hot-reloading
// inherit your script state here
// BallManager.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/