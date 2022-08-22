const musicBtn = document.querySelector(".label__on-off");
let BGM_btn_control = false;

musicBtn.addEventListener("click", (event) => {
  BGM_btn_control = !BGM_btn_control;
  if (BGM_btn_control) {
    document.getElementById("mybgm").play();
  } else {
    document.getElementById("mybgm").pause();
  }
});
