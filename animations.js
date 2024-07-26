let headYoyo;
document.addEventListener("DOMContentLoaded", function () {
  gsap.set("#spiralEyeRight, #spiralEyeLeft, #dizzyMouth", { opacity: 0 });
  addMouseEvent();

  headYoyo = gsap
    .to(".head", {
      x: "+=10",
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      duration: 1,
      onYoyoComplete: function () {
        gsap.to(".head", { x: 0, duration: 0.5, ease: "power4.out" });
      },
    })
    .pause();
});

let lastY = 0;
let lastTime = Date.now();
let dizzyActive = false;
let agitationPoints = 0;

const meTl = gsap.timeline({
  onComplete: addMouseEvent,
  delay: 1,
});

gsap.set(".bg", { transformOrigin: "50% 50%" });
gsap.set(".ear-right", { transformOrigin: "0% 50%" });
gsap.set(".ear-left", { transformOrigin: "100% 50%" });
gsap.set(".me", { opacity: 1 });

// Animaciones iniciales
meTl
  .from(".me", { duration: 1, yPercent: 100, ease: "elastic.out(1, 0.3)" }, 0.5)
  .from(".head, .hair, .shadow", { duration: 0.9, yPercent: 20, ease: "elastic.out(1, 0.3)" }, 0.6)
  .from(".ear-right", { duration: 1, rotate: 40, yPercent: 10, ease: "elastic.out(1, 0.3)" }, 0.7)
  .from(".ear-left", { duration: 1, rotate: -40, yPercent: 10, ease: "elastic.out(1, 0.3)" }, 0.7)
  .from(".eyebrow-right, .eyebrow-left", { duration: 1, yPercent: 300, ease: "elastic.out(1, 0.3)" }, 0.7)
  .to(".eye-right, .eye-left", { duration: 0.01, opacity: 1 }, 0.85)
  .to(".eye-right-2, .eye-left-2", { duration: 0.01, opacity: 0 }, 0.85);

const blink = gsap.timeline({
  repeat: -1,
  repeatDelay: 5,
  paused: false,
});

blink
  .to(".eye-right, .eye-left", { duration: 0.1, opacity: 0 }, 0)
  .to(".eye-right-2, .eye-left-2", { duration: 0.1, opacity: 1 }, 0)
  .to(".eye-right, .eye-left", { duration: 0.1, opacity: 1 }, 0.2)
  .to(".eye-right-2, .eye-left-2", { duration: 0.1, opacity: 0 }, 0.2);

meTl.add(blink, 0.5);

gsap.from(".bg", {
  duration: 2,
  scale: 0.5,
  rotation: 360,
  opacity: 0,
  ease: "elastic.out(1, 0.75)",
  delay: 0.5,
});

function startDizzyEffect() {
  if (!dizzyActive && agitationPoints > 900) {
    dizzyActive = true;
    agitationPoints = 0;
    console.log("Dizzy effect starting, points reset.");
    blink.pause();
    headYoyo.resume(); // Reanuda la animación de la cabeza

    gsap.to(".eye-right, .eye-left, #mouthNormal, #mouthUp", {
      opacity: 0,
      duration: 0.1,
      onComplete: function () {
        gsap.to("#spiralEyeRight, #spiralEyeLeft, #dizzyMouth", { opacity: 1, duration: 0.1 });
        gsap.fromTo(
          "#spiralEyeRight, #spiralEyeLeft",
          { rotation: 0 },
          {
            rotation: 360,
            duration: 2,
            repeat: -1,
            ease: "linear",
            transformOrigin: "center center",
          }
        );
      },
    });

    setTimeout(resetDizzyEffect, 7000);
  }
}

function resetDizzyEffect() {
  dizzyActive = false;
  blink.resume();
  headYoyo.pause(); // Pausa la animación de la cabeza y la resetea a su posición inicial
  gsap.to(".head", { x: 0, duration: 0.1, clearProps: "all" });

  gsap.to("#spiralEyeRight, #spiralEyeLeft, #dizzyMouth", { opacity: 0, rotation: 0, duration: 0.1 });
  gsap.to(".eye-right, .eye-left", { opacity: 1, duration: 0.1 });
  gsap.to("#mouthNormal", { opacity: 1, duration: 0.1 });
  gsap.to("#mouthUp", { opacity: 0, duration: 0.1 });
}

function updateScreenCoords(event) {
  let currentY = event.clientY;
  let deltaY = Math.abs(currentY - lastY);
  let timeDiff = Date.now() - lastTime;
  let speedY = (deltaY / timeDiff) * 1000;

  if (speedY > 300) {
    agitationPoints++;
    console.log("Agitation points:", agitationPoints);
  } else {
    agitationPoints = Math.max(0, agitationPoints - 1);
  }

  if (agitationPoints > 900) {
    startDizzyEffect();
  }

  lastY = currentY;
  lastTime = Date.now();

  if (!dizzyActive) {
    animateFace(event);
    updateMouthExpression(event);
  }
}

function animateFace(event) {
  let xPercent = (event.clientX / window.innerWidth) * 100 - 50;
  let yPercent = (event.clientY / window.innerHeight) * 100 - 50;

  gsap.to(".eyes, .eyebrow-right, .eyebrow-left, .mouth", {
    xPercent: xPercent / 9,
    yPercent: yPercent / 3,
    duration: 0.1,
  });

  gsap.to(".inner-face, .head, .ear-right, .ear-left, .hair-front, .hair-back, .blush-right, .blush-left", {
    xPercent: xPercent / 25,
    yPercent: yPercent / 25,
    duration: 0.1,
  });
}

function updateMouthExpression(event) {
  let isCursorUp = event.clientY < window.innerHeight / 2;
  gsap.to("#mouthNormal", { opacity: isCursorUp ? 0 : 1, duration: 0.1 });
  gsap.to("#mouthUp", { opacity: isCursorUp ? 1 : 0, duration: 0.1 });
}

function addMouseEvent() {
  console.log("Adding mouse event listener");
  window.addEventListener("mousemove", updateScreenCoords);
}
