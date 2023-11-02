import {Bodies, Body, Engine, Events, Render, Runner,World} from "matter-js";
import {FRUITS } from  "./fruits"

const engine = Engine.create();
const render = Render.create({
  engine,
  element: document. body,
  options: {
    wireframes: false,
    background: "#F7F4C8",
    width: 620,
    height: 850,
  }
});

const world = engine.world;

const leftWall = Bodies.rectangle(15,395,30,790, {
  isStatic: true,
  render: {fillStyle: "#E6B143"}
});

const rightWall = Bodies.rectangle(605,395,30,790, {
  isStatic: true,
  render: {fillStyle: "#E6B143"}
});

const ground = Bodies.rectangle(310,820,620,60, {
  isStatic: true,
  render: {fillStyle: "#E6B143"}
});

const topLine = Bodies.rectangle(310,150,620,2, {
  name: "topLine",
  isStatic: true,
  isSensor: true,
  render: {fillStyle: "#E6B143"}
});

World.add(world, [leftWall,rightWall,ground,topLine]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;
let disableAction = null;
let interval = null;

function addFruit() {
  const index = Math.floor(Math.random() * 5);
  const fruit = FRUITS[index];

  const body = Bodies.circle(300,50, fruit.radius, {
    index: index,
    isSleeping: true,
    render: {
      sprite: { texture: `${fruit.name}.png`}
    },
    restitution:0.2,
  });

  currentBody = body;
  currentFruit = fruit;

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

document.addEventListener("touchstart", (event) => {
  const touchX = event.touches[0].clientX;
  const screenWidth = window.innerWidth;
  if (touchX < screenWidth / 2) {
    moveFruit("left");
  } else {
    moveFruit("right");
  }
});

document.addEventListener("touchend", () => {
  // Stop moving the fruit when the touch ends
  clearInterval(interval);
  interval = null;
});

  World.add(world, body);
}

window.onkeydown = (event) => {
  if (disableAction)
  {
    return;
  }
  switch(event.code)
  {
    case "KeyA":
      if (interval)
      return;

      interval = setInterval(() => {
        if (currentBody.position.x - currentFruit.radius > 30)
        Body.setPosition(currentBody,{
          x:currentBody.position.x - 1,
          y: currentBody.position.y,
        });
      },);
      
      break;


    case "KeyD":
      if (interval)
        return;
      
      interval = setInterval(() => {
        if (currentBody.position.x + currentFruit.radius < 590)
        Body.setPosition(currentBody,{
         x:currentBody.position.x + 1,
         y: currentBody.position.y,
        });
      },5)

      
      break;

    case "KeyS":
      currentBody.isSleeping = false;
      disableAction = true;

      setTimeout(() => {
        addFruit();  
        disableAction = false;
      },1000);
      
      break;

  }
}

window.onkeyup = (event) => {
  switch (event.code){
    case "KeyA":
    case "KeyD":
        clearInterval(interval);
        interval = null;
  }
}

Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((collision => {
    if (collision.bodyA.index === collision.bodyB.index) {
      const index = collision.bodyA.index;
      if(index === FRUITS.length - 1){
        return;
      }
      
      World.remove(world, [collision.bodyA, collision.bodyB]);

      const newFruit = FRUITS[index + 1];
      
      const newBody = Bodies.circle(
        collision.collision.supports[0].x,
        collision.collision.supports[0].y,
        newFruit.radius,
        {
          render: {
            sprite: {texture: `${newFruit.name}.png`}
          },
          index: index + 1,
        }
      );

     World.add(world, newBody);
    }

    if (
      !disableAction &&
      (collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine")) {
      alert("One more time DOPAMIN?");
    }


  }));
});

addFruit();




