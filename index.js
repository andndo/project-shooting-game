const canvas = document.querySelector("canvas");
const cvs = canvas.getContext("2d");
const reStartBtn = document.querySelector(".restartBtn");
const gameEnd = document.querySelector(".gameEnd");
const scoreDisplay = document.querySelector(".scores");
const elementToChange = document.getElementsByTagName("body")[0];
elementToChange.style.cursor = "url('./asset/aim.png'), auto";
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

class SuperItem {
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
  "white",
  {
    x: 1,
    y: 1,
  }
);

class Enemies {
  constructor(x, y, radius, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    if (
      "rgba(" +
        Math.random() * 255 +
        "," +
        Math.random() * 255 +
        "," +
        Math.random() * 255 +
        ")" ==
      "black"
    ) {
      this.color = "yellow";
    } else {
      this.color =
        "rgba(" +
        Math.random() * 255 +
        "," +
        Math.random() * 255 +
        "," +
        Math.random() * 255 +
        ")";
    }
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
const superItems = [];
let num = 1;

function spawnSuperItem() {
  setInterval(() => {
    const radius = 40;
    const color = "gold";
    let x;
    let y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
    const velocity = {
      x: 1,
      y: 1,
    };
    superItems.push(new SuperItem(x, y, radius, color, velocity));
  }, 10000);
}
function spawnEnemies() {
  setInterval(() => {
    if (num <= 10) {
      num += 0.05;
    }
    let radius = Math.random() * 30;
    if (radius < 7) {
      radius = 25;
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
    const angle = Math.atan2(canvas.width / 2 - x, canvas.height / 2 - y);
    let velocity;
    velocity = {
      x: Math.sin(angle) * num,
      y: Math.cos(angle) * num,
    };
    enemies.push(new Enemies(x, y, radius, velocity));
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
    superItems.forEach((superItem, index)=>{
      superItem.update();

    })
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
          if (enemy.radius - 10 > 10) {
            gsap.to(enemy, {
              radius: enemy.radius - 10,
            });
            setTimeout(() => {
              projectiles.splice(projectileIndex, 1);
            }, 0);
          } else {
            setTimeout(() => {
              enemies.splice(index, 1);
              projectiles.splice(projectileIndex, 1);
              scores++;
              scoreDisplay.innerText = scores;
              document.getElementById("total").innerHTML = scores;
            }, 0);
          }
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
    x: Math.sin(angle) * 6,
    y: Math.cos(angle) * 6,
  };
  projectiles.push(
    new Projectile(canvas.width / 2, canvas.height / 2, 5, "white", velocity)
  );
});

function init() {
  animate();
  spawnEnemies();
  spawnSuperItem();
}

reStartBtn.addEventListener("click", () => {
  init();
  gameEnd.style.display = "flex"; //종료창 제거
  location.reload();
});
init();
