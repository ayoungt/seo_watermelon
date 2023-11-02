import { Bodies, Body, Engine, Render, Runner, World } from "matter-js";
import { FRUITS } from "./fruits";

const engine = Engine.create();
const render = Render.create({
  engine,
  element: document.body,
  options: {
    wireframes: false,
    background: "#F7F4C8",
    width: 620,
    height: 850,
  },
});

const world = engine.world;

const leftWall = Bodies.rectangle(15, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle: "#E6B143" },
});

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle: "#E6B143" },
});

const ground = Bodies.rectangle(310, 820, 620, 60, {
  isStatic: true,
  render: { fillStyle: "#E6B143" },
});

const topLine = Bodies.rectangle(310, 150, 620, 2, {
  name: "topLine",
  isStatic: true,
  isSensor: true,
  render: { fillStyle: "#E6B143" },
});

World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;
let disableAction = false;
let interval = null;

function addFruit() {
  const index = Math.floor(Math.random() * 5);
  const fruit = FRUITS[index];

  const body = Bodies.circle(300, 50, fruit.radius, {
    index: index,
    isSleeping: true,
    render: {
      sprite: { texture: `${fruit.name}.png` },
    },
    restitution: 0.2,
  });

  currentBody = body;
  currentFruit = fruit;

  World.add(world, body);
}

function moveFruit(direction) {
  if (!currentBody || disableAction) {
    return;
  }

  const increment = direction === "left" ? -1 : 1;
  const newPositionX = currentBody.position.x + increment;

  if (newPositionX >= 30 && newPositionX <= 590) {
    Body.setPosition(currentBody, { x: newPositionX, y: currentBody.position.y });
  }
}

// Event listeners for clicking and touching
document.addEventListener("click", () => {
  if (disableAction) {
    return;
  }
  currentBody.isSleeping = false;
  disableAction = true;
  setTimeout(() => {
    addFruit();
    disableAction = false;
  }, 1000);
});

// Touch events for mobile
let touchStartX = 0;

document.addEventListener("touchstart", (event) => {
  touchStartX = event.touches[0].clientX;
});

document.addEventListener("touchmove", (event) => {
  const touchX = event.touches[0].clientX;
  const screenWidth = window.innerWidth;
  const moveThreshold = 30;

  if (touchX - touchStartX > moveThreshold) {
    moveFruit("right");
    touchStartX = touchX;
  } else if (touchStartX - touchX > moveThreshold) {
    moveFruit("left");
    touchStartX = touchX;
  }
});

document.addEventListener("touchend", () => {
  // Stop moving the fruit when the touch ends
  clearInterval(interval);
  interval = null;
});

addFruit();


