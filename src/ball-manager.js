var BallManager = pc.createScript('ballManager');


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
};

// swap method called for script hot-reloading
// inherit your script state here
// BallManager.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/