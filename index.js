const canvas = document.querySelector("canvas");
const cvs = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  draw() {
    cvs.beginPath();
    cvs.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    cvs.fillStyle = this.color;
    cvs.fill();
  }
}

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    cvs.beginPath();
    cvs.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    cvs.fillStyle = this.color;
    cvs.fill();
  }
  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

const x = canvas.width / 2;
const y = canvas.height / 2;

const player = new Player(x, y, 30, "blue");

const projectile = new Projectile(
  canvas.width / 2,
  canvas.height / 2,
  5,
  "red",
  {
    x: 1,
    y: 1,
  }
);

class Enemies {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    cvs.beginPath();
    cvs.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    cvs.fillStyle = this.color;
    cvs.fill();
  }
  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

const projectiles = [];
const enemies = [];

function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() *  30
    let x;
    let y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    }
    else{
        x = Math.random() * canvas.width; 
        y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;    }
    const color = "green";

    const angle = Math.atan2(canvas.width / 2 - x, canvas.height / 2 - y);
    const velocity = {
      x: Math.sin(angle),
      y: Math.cos(angle),
    };
    enemies.push(new Enemies(x, y, radius, color, velocity));
  }, 500);
}

function animate() {
  requestAnimationFrame(animate);
  cvs.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();
  projectiles.forEach((projectile) => {
    projectile.update();
  });
  enemies.forEach((enemy) => {
    enemy.update();
  });
}

console.log(player);
addEventListener("click", (event) => {
  const angle = Math.atan2(
    event.clientX - canvas.width / 2,
    event.clientY - canvas.height / 2
  );
  console.log(angle);
  const velocity = {
    x: Math.sin(angle) * 5,
    y: Math.cos(angle) * 5,
  };
  projectiles.push(
    new Projectile(canvas.width / 2, canvas.height / 2, 5, "red", velocity)
  );
});

animate();
spawnEnemies();
