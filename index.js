// Instead of importing the image directly, load it dynamically --- © Code by | Aditya Tomar
const platformImage = new Image();
platformImage.src = './imgs/platform.png';  
const background = new Image();
background.src = './imgs/background.png';
const hills = new Image();
hills.src = './imgs/hills.png';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5;

class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        };
        this.velocity = {
            x: 0,
            y: 1
        };
        this.width = 30;
        this.height = 30;
    }

    draw() {
        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity;
        else this.velocity.y = 0;
    }
}

class Platform {
    constructor({ x, y }) {
        this.position = { x, y };
        this.width = 200;
        this.height = 20;
    }

    draw() {
// Draw the image on the platform instead of a fillRect --- © Code by | Aditya Tomar
        c.drawImage(platformImage, this.position.x, this.position.y, this.width, this.height);
    }
}

class GenericObject {
    constructor({ x, y, image, width = canvas.width, height = canvas.height }) { // Added width and height parameters
        this.position = { x, y };
        this.image = image;
        this.width = width;
        this.height = height;
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height); // Using this.width and this.height
    }
}

// Fixed image source to use imgSrc parameter --- © Code by | Aditya Tomar
function createImage(imgSrc) {   
    const image = new Image();
    image.src = imgSrc;
    return image;
}

const player = new Player();
const platforms = [
    new Platform({ x: -1, y: 557 }),
    new Platform({ x: 198, y: 557 })
];

const genericObjects = [
    new GenericObject({
        x: 0,
        y: 0,
        image: createImage('./imgs/background.png'),  // Corrected image source --- © Code by | Aditya Tomar
        width: canvas.width,  // Set background to cover the full canvas width --- © Code by | Aditya Tomar
        height: canvas.height  // Set background to cover the full canvas height --- © Code by | Aditya Tomar
    })
];

const keys = {
    right: { pressed: false },
    left: { pressed: false }
};

let scrollOffset = 0;

function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);

    genericObjects.forEach(genericObject => {
        genericObject.draw();
    });
    
    platforms.forEach(platform => {
        platform.draw();
    });
    player.update();

    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = 5;
    } else if (keys.left.pressed && player.position.x > 100) {
        player.velocity.x = -5;
    } else {
        player.velocity.x = 0;

// Illusion of movement of the platform --- © Code by | Aditya Tomar
        if (keys.right.pressed) {
            scrollOffset += 5;
            platforms.forEach(platform => {
                platform.position.x -= 5;
            });
        } else if (keys.left.pressed) {
            scrollOffset -= 5;
            platforms.forEach(platform => {
                platform.position.x += 5;
            });
        }
    }

    // Platform collision detection --- © Code by | Aditya Tomar
    platforms.forEach(platform => {
        if (
            player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width
        ) {
            player.velocity.y = 0;
        }
    });

    if (scrollOffset > 2000) {
        console.log('You Win');
    }
}

animate();

addEventListener('keydown', ({ keyCode }) => {
    switch (keyCode) {
        case 65:
            console.log('left');
            keys.left.pressed = true;
            break;
        case 83:
            console.log('down');
            break;
        case 68:
            console.log('right');
            keys.right.pressed = true;
            break;
        case 87:
            console.log('up');
            player.velocity.y = -10;
            break;
    }
});

addEventListener('keyup', ({ keyCode }) => {
    switch (keyCode) {
        case 65:
            console.log('left');
            keys.left.pressed = false;
            break;
        case 83:
            console.log('down');
            break;
        case 68:
            console.log('right');
            keys.right.pressed = false;
            break;
        case 87:
            console.log('up');
            player.velocity.y = 0; // Reset vertical velocity on key release --- © Code by | Aditya Tomar
            break;
    }
});
