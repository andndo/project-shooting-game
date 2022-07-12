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
let item = false;

let dPressed = false;
let aPressed = false;
let wPressed = false;
let sPressed = false;

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

let x = canvas.width / 2;
let y = canvas.height / 2;

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
      "rgb(" +
        Math.random() * 255 +
        "," +
        Math.random() * 255 +
        "," +
        Math.random() * 255 +
        ")" ==
        "rgb(0,0,0)" ||
      "rgb(" +
        Math.random() * 255 +
        "," +
        Math.random() * 255 +
        "," +
        Math.random() * 255 +
        ")" ==
        "rgb(255,215,0)"
    ) {
      this.color = "yellow";
    } else {
      this.color =
        "rgb(" +
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
let num = 1; // 전역변수로 쓰지 말 것

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
    const angle = Math.atan2(canvas.width / 2 - x, canvas.height / 2 - y);
    let velocity;
    velocity = {
      x: Math.sin(angle),
      y: Math.cos(angle),
    };
    superItems.push(new SuperItem(x, y, radius, color, velocity));
  }, 15000);
}

function spawnEnemies() {
  setInterval(() => {
    if (num <= 12) {
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
    if (wPressed) {
      console.log("ds");
      player.y += -5;
    } else if (dPressed) {
      player.x += 5;
    } else if (aPressed) {
      player.x += -5;
    } else if (sPressed) {
      player.y += 5;
    }
    projectiles.forEach((projectile) => {
      projectile.update();
    });
    superItems.forEach((superItem, index) => {
      superItem.update();
      const dist2 = Math.hypot(player.x - superItem.x, player.y - superItem.y);
      projectiles.forEach((projectile, projectileIndex) => {
        const dist = Math.hypot(
          projectile.x - superItem.x,
          projectile.y - superItem.y
        );
        if (dist2 - superItem.radius - player.radius < 0) {
          superItems.splice(index, 1);
        } else if (dist - superItem.radius - projectile.radius < 1) {
          setTimeout(() => {
            item = true;
            superItems.splice(index, 1);
            projectiles.splice(projectileIndex, 1);
          }, 0);
        }
      });
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
          if (projectile.color == "red") {
            enemies.splice(index, 1);
            projectiles.splice(projectileIndex, 1);
            scores++;
            scoreDisplay.innerText = scores;
          } else {
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
        }
      });
    });
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keydown", keyUpHandler, false);
function keyDownHandler(e) {
  console.log(e.key);

  if (e.key == "w") {
    wPressed = true;
  } else if (e.key == "d") {
    dPressed = true;
  } else if (e.key == "a") {
    aPressed = true;
  } else if (e.key == "s") {
    sPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "w") {
    wPressed = false;
  } else if (e.key == "d") {
    dPressed = false;
  } else if (e.key == "a") {
    aPressed = false;
  } else if (e.key == "s") {
    sPressed = false;
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
  if (item) {
    projectiles.push(
      new Projectile(canvas.width / 2, canvas.height / 2, 12, "red", velocity)
    );
    setTimeout(() => {
      item = false;
    }, 6000);
  } else {
    projectiles.push(
      new Projectile(canvas.width / 2, canvas.height / 2, 5, "white", velocity)
    );
  }
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
