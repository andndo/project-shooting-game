const canvas = document.querySelector("canvas");
const cvs = canvas.getContext("2d");
const reStartBtn = document.querySelector(".restartBtn");
const gameEnd = document.querySelector(".gameEnd");
const scoreDisplay = document.querySelector(".scores");
canvas.width = innerWidth;
canvas.height = innerHeight;
let scores = 0;
let game = true;

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

function showGameOverText() {
  gameEnd.style.display = "block";
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
    let radius = Math.random() * 30;
    if (radius < 4) {
      radius = 7;
    }
    let x;
    let y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
    const color = "green";

    const angle = Math.atan2(canvas.width / 2 - x, canvas.height / 2 - y);
    const velocity = {
      x: Math.sin(angle),
      y: Math.cos(angle),
    };
    enemies.push(new Enemies(x, y, radius, color, velocity));
  }, 1000);
}

function animate() {
  requestAnimationFrame(animate);

  if (game) {
    cvs.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    projectiles.forEach((projectile) => {
      projectile.update();
    });
    enemies.forEach((enemy, index) => {
      enemy.update();
      const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
      if (dist - enemy.radius - player.radius < 0) {
        showGameOverText();
        game = false;
      }
      projectiles.forEach((projectile, projectileIndex) => {
        const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
        if (dist - enemy.radius - projectile.radius < 1) {
          setTimeout(() => {
            enemies.splice(index, 1);
            projectiles.splice(projectileIndex, 1);
            scores++;
            scoreDisplay.innerText = scores;
          }, 0);
        }
      });
    });
  }
}

addEventListener("click", (event) => {
  const angle = Math.atan2(
    event.clientX - canvas.width / 2,
    event.clientY - canvas.height / 2
  );
  const velocity = {
    x: Math.sin(angle) * 5,
    y: Math.cos(angle) * 5,
  };
  projectiles.push(
    new Projectile(canvas.width / 2, canvas.height / 2, 5, "red", velocity)
  );
});

function init() {
  animate();
  spawnEnemies();
}

reStartBtn.addEventListener("click", () => {
  init(); //새로운 게임 시작
  gameEnd.style.display = "flex"; //종료창 제거
  location.reload();
});
init();
