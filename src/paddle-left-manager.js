var PaddleManager = pc.createScript('paddleManager');

PaddleManager.attributes.add('upInput', { 
 type: 'number', default: 1});

PaddleManager.attributes.add('downInput', { 
 type: 'number', default: 1});

// initialize code called once per entity
PaddleManager.prototype.initialize = function() {
    
};

// update code called every frame
PaddleManager.prototype.update = function(dt) {
    if (this.app.keyboard.isPressed(this.upInput) && this.entity.position.y < 5) {
        this.entity.translate(0, 10 * dt, 0);
    }
    
    if (this.app.keyboard.isPressed(this.downInput) && this.entity.position.y > -5) {
        this.entity.translate(0, -10 * dt, 0);
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// PaddleLeftManager.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/