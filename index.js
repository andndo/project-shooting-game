const canvas = document.querySelector("canvas");
const cvs = canvas.getContext("2d");
const reStartBtn = document.querySelector(".restartBtn");
const helpBtn = document.querySelector(".helpBtn");
const gameEnd = document.querySelector(".gameEnd");
const scoreDisplay = document.querySelector(".scores");
const elementToChange = document.getElementsByTagName("body")[0];
elementToChange.style.cursor = "url('./asset/aim.png'), auto";
canvas.width = innerWidth;
canvas.height = innerHeight;
let scores = 0;
let game = true;
let powerItem = false;
let invincibilityItem = false;

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

helpBtn.addEventListener("click", (event) => {
  game = !game;
});

class Dummy {
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

class Item {
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
const dummy = new Dummy(x, y, 30, "rgba(0,0,255,0.1)");

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
  console.log(dPressed);
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
  console.log(dPressed);
}

function playerMove() {
  if (wPressed) {
    console.log("ds");
    y -= 5;
  } else if (dPressed) {
    x += 5;
  } else if (aPressed) {
    x -= 5;
  } else if (sPressed) {
    y += 5;
  }
}
function ghostMode() {}

setInterval(playerMove, 10);
const projectiles = [];
const enemies = [];
const powerItems = [];
const invincibilityItems = [];

function spawnInvincibilityItem() {
  // 투명화 상태가 되는 아이템
  setInterval(() => {
    const radius = 40;
    const color = "white";
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
    invincibilityItems.push(new Item(x, y, radius, color, velocity));
  }, 20000);
}

function spawnSuperItem() {
  // 탄알커지고 한방컷내는 아이템
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
    powerItems.push(new Item(x, y, radius, color, velocity));
  }, 15000);
}

function spawnEnemies() {
  let num = 1;
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

let cnt = 0;

function animate() {
  requestAnimationFrame(animate);
  playerMove();
  if (game) {
    if (invincibilityItem) {
      player.x = ghostMode;
      player.y = ghostMode;
      if (cnt === 0) {
        setTimeout(() => {
          invincibilityItem = false;
        }, 5000);
        cnt = 1;
      }
    } else {
      player.x = canvas.width / 2;
      player.y = canvas.height / 2;
      cnt = 0;
    }
    cvs.fillStyle = "rgba(0, 0, 0, 0.1)";
    cvs.fillRect(0, 0, canvas.width, canvas.height);
    dummy.draw();
    player.draw();
    projectiles.forEach((projectile) => {
      projectile.update();
    });
    invincibilityItems.forEach((ghostItem, index) => {
      ghostItem.update();
      const dist2 = Math.hypot(player.x - ghostItem.x, player.y - ghostItem.y);
      projectiles.forEach((projectile, projectileIndex) => {
        const dist = Math.hypot(
          projectile.x - ghostItem.x,
          projectile.y - ghostItem.y
        );
        if (dist2 - ghostItem.radius - player.radius < 0) {
          invincibilityItems.splice(index, 1);
        } else if (dist - ghostItem.radius - projectile.radius < 1) {
          setTimeout(() => {
            invincibilityItem = true;
            invincibilityItems.splice(index, 1);
            projectiles.splice(projectileIndex, 1);
          }, 0);
        }
      });
    });
    powerItems.forEach((superItem, index) => {
      superItem.update();
      const dist2 = Math.hypot(player.x - superItem.x, player.y - superItem.y);
      projectiles.forEach((projectile, projectileIndex) => {
        const dist = Math.hypot(
          projectile.x - superItem.x,
          projectile.y - superItem.y
        );
        if (dist2 - superItem.radius - player.radius < 0) {
          powerItems.splice(index, 1);
        } else if (dist - superItem.radius - projectile.radius < 1) {
          setTimeout(() => {
            powerItem = true;
            powerItems.splice(index, 1);
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

addEventListener("click", (event) => {
  const angle = Math.atan2(
    event.clientX - canvas.width / 2,
    event.clientY - canvas.height / 2
  );
  const velocity = {
    x: Math.sin(angle) * 7,
    y: Math.cos(angle) * 7,
  };
  if (powerItem) {
    projectiles.push(
      new Projectile(canvas.width / 2, canvas.height / 2, 12, "red", velocity)
    );
    if (cnt === 0) {
      setTimeout(() => {
        powerItem = false;
      }, 6000);
      cnt = 1;
    }
  } else {
    projectiles.push(
      new Projectile(canvas.width / 2, canvas.height / 2, 5, "white", velocity)
    );
    cnt = 0;
  }
});

function init() {
  animate();
  spawnEnemies();
  spawnSuperItem();
  spawnInvincibilityItem();
  playerMove();
}

reStartBtn.addEventListener("click", () => {
  init();
  gameEnd.style.display = "flex"; //종료창 제거
  location.reload();
});
init();
