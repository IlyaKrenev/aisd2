function findClosestDistance (coordMas) {
  const len = coordMas.length;

  if (len === 1) {
    throw new Error('Сегодня улитка грустит одна :(');
  }
  
  if (len <= 3) {
    return brute(coordMas);
  }
  
  let middle = Math.floor(len / 2),
      leftPair = findClosestDistance(coordMas.slice(0,middle)),
      rightPair = findClosestDistance(coordMas.slice(middle)),
      minDista = minPair(leftPair, rightPair),
      closDividePair = [Infinity, Infinity], 
      bestPair;

  const DividePairs = coordMas.filter((coord) => {
    return coord[0] - coordMas[middle][0] < minDista[1]
  });
  
  if (DividePairs.length > 1) {
    closDividePair = brute(DividePairs);
  }

  bestPair = minPair(minDista,closDividePair);

  return bestPair;
}

function brute (coordMas) {
  let mDist,
      len = coordMas.length,
      closPair,
      currDist;
  
  for (let i = 0; i < len - 1; i++) {
    for (let j = i+1; j < len; j++) {
      currDist = dist(coordMas[i], coordMas[j]);

      if (currDist < mDist || !mDist) {
        mDist = currDist;
        closPair = [coordMas[i], coordMas[j]];
      }
    }
  }

  return [closPair, mDist];
}

function dist (point1, point2) {
  let x1 = point1[0] || point1.x,
      x2 = point2[0] || point2.x,
      y1 = point1[1] || point1.y,
      y2 = point2[1] || point2.y;

  return Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);
}

function minPair (pair1, pair2) {
  return pair1[1] < pair2[1] ? pair1 : pair2;
}

function parseInput (rawInput) {
  const coordMas = rawInput.split("\n").map(row => {
    return row.replace(/[^\w.,]/g, "").split(",")
  })
  
  return coordMas;
}

function clear () {
  const canvas = document.getElementById('paint');

  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, 1000, 1000);

}

function circle (coordMas, result) {
  const canvas = document.getElementById('paint');

  const ctx = canvas.getContext('2d');

  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo(0,1000);
  ctx.lineTo(1000,1000);
  ctx.lineTo(1000,0);
  ctx.lineTo(0,0);
  ctx.strokeStyle = 'grey';
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(result[0][0][0],result[0][0][1]);
  ctx.lineTo(result[0][1][0],result[0][1][1]);
  ctx.strokeStyle = 'red';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(result[0][0][0],result[0][0][1], 3, 0, 2*Math.PI, false);
  ctx.arc(result[0][1][0],result[0][1][1], 3, 0, 2*Math.PI, false);
  ctx.fillStyle='red';
  ctx.fill(); 
    
  for (let j = 0; j <= coordMas.length - 1; j++) {
    ctx.beginPath();
    ctx.arc(coordMas[j][0], coordMas[j][1], 3, 0, 2*Math.PI, false);
    ctx.fillStyle='black';
    ctx.fill(); 
  }
    
  return 0;
}

function init () {
  const coordMas = parseInput(document.getElementById("input").value),
        outputEl = document.getElementById("output");

  const container = document.getElementById("canvas-container");
  const outputText = document.getElementById("outputText");

  const sortedMas = coordMas.sort(function(a, b) {
    return a[0] - b[0];
  });

  clear();

  container.style.display = 'block';
  outputText.style.display = 'block';

  try {
    const start = new Date().getTime();;
    result = findClosestDistance(sortedMas);
    const finish = new Date().getTime();;

    console.log('Время выполнения:', finish - start, 'ms');
  } catch (err) {
    outputEl.innerHTML = printError(err.message);
    return;
  }


  outputEl.innerHTML = getOutput(result[0][0][0], result[0][0][1], result[0][1][0], result[0][1][1], result[1]);
  

  circle(sortedMas, result);
}

function getOutput (pos1x, pos1y, pos2x, pos2y, qDistance) {
  const distance = Math.sqrt(qDistance)
  const time = distance / 0.01 / 2;

  let res = (
    `<span>Позиция первой улитки: (${pos1x}; ${pos1y})</span><br>` +
    `<span>Позиция второй улитки: (${pos2x}; ${pos2y})</span><br>` +
    `<span>Дистанция: ${+distance.toFixed(5)} метров</span><br>` +
    `<span>Время: ${+time.toFixed(5)} секунд</span>`
  );

  return res;
}

function printError (msg) {
  return (
    `<span style="color: red">${msg}</span>`
  )
}

function changeText () {
  let mas = '';

  const randNum = +document.getElementById("amount").value;

  for (let i = 0; i < randNum; i ++) {
    const generated = generateRandomly();

    mas = mas + `(${generated[0]}, ${generated[1]})` + '\n'
  }

  document.getElementById("input").value = mas
}

function generateRandomly () {
  return [+(Math.random() * 1000).toFixed(2), +(Math.random() * 1000).toFixed(2)]
}

window.onload = function () {
  document.getElementById("submit").onclick = init;
  document.getElementById("generate").onclick = changeText;

  document.getElementById("input").value = defaultText
};

const defaultText =
`(50.42, 880.83)
(20.15, 560.06)
(170.89, 980.35)
(650.00, 350.07)
(250.10, 50.19)
(800.00, 679.07)
(153.10, 550.19)
(410.00, 729.07)
(300.10, 875.19)`