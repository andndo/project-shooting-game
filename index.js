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

let x = canvas.width / 2;
let y = canvas.height / 2;

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

const player = new Player(x, y, 20, "blue");

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

class Boss {
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
      this.color = "red";
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
document.addEventListener("keyup", keyUpHandler, false);
function keyDownHandler(e) {
  if (e.key == "ArrowUp" || e.key == "w") {
    wPressed = true;
  } else if (e.key == "ArrowRight" || e.key == "d") {
    dPressed = true;
  } else if (e.key == "ArrowLeft" || e.key == "a") {
    aPressed = true;
  } else if (e.key == "ArrowDown" || e.key == "s") {
    sPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "ArrowUp" || e.key == "w") {
    wPressed = false;
  } else if (e.key == "ArrowRight" || e.key == "d") {
    dPressed = false;
  } else if (e.key == "ArrowLeft" || e.key == "a") {
    aPressed = false;
  } else if (e.key == "ArrowDown" || e.key == "s") {
    sPressed = false;
  }
}

function playerDraw() {
  if (scores >= 60) {
    //60점이상이 되면 움직여지기
    player.draw();

    if (dPressed && x < canvas.width - 20) {
      player.x += 2;
    } else if (aPressed && x > 0) {
      player.x -= 2;
    } else if (sPressed && y < canvas.height - 20) {
      player.y += 2;
    } else if (wPressed && y > 0) {
      player.y -= 2;
    }
  }
}

setInterval(playerDraw, 10);

const projectiles = [];
const enemies = [];
const powerItems = [];
const bossArray = [];

function spawnSuperItem() {
  // 탄알커지고 한방컷내는 아이템
  if (scores <= 60) {
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
    }, 7000);
  }
}

function spawnBoss() {
  if (scores >= 60) {
    const x = canvas.width / 2;
    const y = 100;
    const radius = 5000;
    const color = "#fff";
    const angle = Math.atan2(canvas.height / 2, canvas.width / 2 - x);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    bossArray.push(new Boss(x, y, radius, color, velocity));
  }
}

function spawnEnemies() {
  if (scores <= 60) {
    let num = 1;
    setInterval(() => {
      if (num <= 12) {
        num += 0.1;
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
}

let cnt = 0;

function animate() {
  requestAnimationFrame(animate);
  playerDraw();
  if (game) {
    cvs.fillStyle = "rgba(0, 0, 0, 0.15)";
    cvs.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();
    projectiles.forEach((projectile) => {
      projectile.update();
    });

    powerItems.forEach((superItem, index) => {
      superItem.update();
      const dist2 = Math.hypot(player.x - superItem.x, player.y - superItem.y);
      projectiles.forEach((projectile, projectileIndex) => {
        const dist = Math.hypot(
          projectile.x - superItem.x,
          projectile.y - superItem.y
        );
        const asdf = "adfs00";
        if (dist2 - superItem.radius - player.radius < 0) {
          powerItems.splice(index, 1);
        } else if (dist - superItem.radius - projectile.radius < 1) {
          player.color = "yellow";

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

const soundEffectBtn = document.querySelector("#sound-effect_on-off");
let soundEffect_btn_control = false;

// Audio객체를 담아둘 배열
const arr_sound = [];
if (game) {
  // 50개의 Audio객체를 배열에 담아둔다.
  for (let i = 0; i < 20; i++) {
    const sound = new Audio();
    sound.src = "./asset/효과음.mp3";

    // 크롬 예외 처리: audio 재생이 끝나면, 다시 로드해준다
    sound.addEventListener("ended", function () {
      if (window.chrome) {
        this.load();
      }
      this.pause();
    });

    arr_sound.push(sound);
  }
}

// 버튼을 누를 때마다, Audio객체를 재생
canvas.addEventListener("click", (event) => {
  if (game) {
    if (soundEffect_btn_control) {
      for (let i = 0; i < arr_sound.length; i++) {
        if (arr_sound[i].paused) {
          // 재생중이 아닌 Audio객체를 찾아서
          arr_sound[i].play(); // 1회만 재생하고
          break; // 반복문을 나간다.
        }
      }
    }

    const angle = Math.atan2(
      event.clientX - player.x,
      event.clientY - player.y
    );
    const velocity = {
      x: Math.sin(angle) * 7,
      y: Math.cos(angle) * 7,
    };
    if (powerItem) {
      projectiles.push(new Projectile(player.x, player.y, 12, "red", velocity));
      if (cnt === 0) {
        setTimeout(() => {
          powerItem = false;
        }, 6000);
        cnt = 1;
      }
    } else {
      projectiles.push(
        new Projectile(player.x, player.y, 5, "white", velocity)
      );
      player.color = "blue";
      cnt = 0;
    }
  }
});

function init() {
  animate();
  spawnEnemies();
  spawnSuperItem();
  playerDraw();
}

reStartBtn.addEventListener("click", () => {
  init();
  gameEnd.style.display = "flex"; //종료창 제거
  location.reload();
});

const musicBtn = document.querySelector("#BGM_on-off");
const effectBtn = document.querySelector("#sound-effect_on-off");

/*추가된 부분: 종료되면 처음부터 다시 재생*/

let BGM_btn_control = false;
const audio = new Audio("./asset/베토벤 바이러스 편집본 (mp3cut.net).mp3");
//audio.autoplay = true;
//bgm버튼 클릭시 음악 재생
musicBtn.addEventListener("click", (event) => {
  BGM_btn_control = !BGM_btn_control;
  if (BGM_btn_control) {
    audio.play();

    audio.loop = BGM_btn_control;
  } else audio.pause();
});

effectBtn.addEventListener("click", (event) => {
  soundEffect_btn_control = !soundEffect_btn_control;
});

const gameStart = document.querySelector(".gameStart");
const StartBtn = document.querySelector(".startBtn");

StartBtn.addEventListener("click", () => {
  gameStart.style.display = "none";
  console.log("Start");
  init();
});

const advice = document.querySelector(".advice");
const adviceBtn = document.querySelector("#adviceBtn");

function showAdviceText() {
  advice.style.display = "block";
}

adviceBtn.addEventListener("click", (event) => {
  showAdviceText();
  console.log("Asdf");
});
