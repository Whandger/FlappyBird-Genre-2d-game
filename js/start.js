window.onload = function() { //primeira função começa ao apertar o botão start
    const botao = document.getElementById('button');
    botao.addEventListener('click', start);
}

// pc parameters
const screenHeight = window.innerHeight;
const screenWidth = window.innerWidth;
// background
let bg1X = 0;
let bg2X = window.innerWidth;
let bgSpeed = 2; // velocidade constante do cenário
// Passaro
let currentAngle = 0;           // variável global para armazenar o ângulo atual
let gravity = 0.4;           // A força que puxa pra baixo
let velocity = 0;          // Velocidade atual do pássaro
let birdY = 255;           // Posição vertical inicial
let jumpSound = new Audio('./sound/audio_jump.mp3')
// Obstaculo
let obstacleX = window.innerWidth + 0; // 200px fora da tela     // posição X obstaculos
let alturaCano = 0;      // altura aleatoria dos canos
let obstacleSpeed = 0; // velocidade do obstaculo
const gapSize = Math.min(screenHeight, screenWidth) * 0.4; // 40% da menor dimensão (altura ou largura)
const minHeight = screenHeight * 0.1; // altura mínima do cano de cima (10%)
const maxHeight = screenHeight * 0.5; // altura máxima do cano de cima (50%)
// Pontuação
let score = 0;
let scoreSound = new Audio('./sound/audio_score.mp3');
// Game
let gameInterval;
let isGameRunning = false; // Vê se o jogo esta rodando 



function start() {
    const botao = document.getElementById("button")
    botao.removeEventListener("click", start);
    botao.disabled = true
    botao.style.display = 'none' // esconde o botão start

    gameStart(); // puxa a função gameStart e começa o jogo
}

function gameStart() {
    const flapBird = document.getElementById('flapBird');
    isGameRunning = true;
    
    document.addEventListener('keydown', (event) => {
        // A propriedade identifica a tecla física espaço no teclado
        if (event.code === 'Space') {
            if (isGameRunning == true) { // se o jogo ta rodando
            jumpSound.play();
            velocity = -8; // Adiciona um pulo ao boneco 8 pixels pra cima
        }}})

    document.addEventListener('touchstart', () => {
        if (isGameRunning == true) {
          jumpSound.play();
          velocity = -8;
          }});

    gameInterval = setInterval(() => { //looping
        updateBird();  // puxa a função responsavel pela gravidade e limites do passaro
        updateObstacles(); // Puxa a função responsavel pela velocidade e recriação dos objetos
        scenarie();
        colission();
    }, 25); // em quantos milisegundos o jogo acontece
  }

function updateBird() {
    velocity += gravity; // velocidade é igual a velocidade mais gravidade
    birdY -= velocity; // linha vertical do passaro é igual a ela menos a velocidade
    flapBird.style.bottom = birdY + 'px'; // passaro altera a altura que esta, usando birdY + px

    let maxAngle = 45; // setta o angulo maximo que ele desce
    let minAngle = -30; // setta o angulo maximo que ele sobe
    let targetAngle = velocity * 5; //angulo do passaro igual velocidade * 5
  
    if (targetAngle > maxAngle) targetAngle = maxAngle; // limita o ângulo máximo para não passar do limite pra baixo
    if (targetAngle < minAngle) targetAngle = minAngle; // limita o ângulo máximo para não passar do limite pra cima
  
    // Lerp para suavizar a rotação
    currentAngle += (targetAngle - currentAngle) * 0.1; //Angulo atual, começa no 0 + (angulo meta - o angulo atual) * 0,1
  
    flapBird.style.transform = `rotate(${currentAngle}deg)`; //troca os graus da rotação do passaro

    // Impede de cair fora da tela
    if (birdY <= 0 || birdY >= 900) { // se o Y do passaro for menor que 0 ou maior que 900
      createRestartButton(); // ⬅️ aqui chamamos a função que mostra o botão
    }
}


function scenarie() {
  const bg1 = document.getElementById('background1');
  const bg2 = document.getElementById('background2');

  // Move os dois fundos para a esquerda
  bg1X -= bgSpeed;
  bg2X -= bgSpeed;

  bg1.style.transform = `translateX(${bg1X}px)`;
  bg2.style.transform = `translateX(${bg2X}px)`;

  // Quando um fundo sai totalmente da tela, move ele pro final do outro
  if (bg1X + window.innerWidth <= 0) {
    bg1X = bg2X + window.innerWidth;
  }

  if (bg2X + window.innerWidth <= 0) {
    bg2X = bg1X + window.innerWidth;

  }
}


function updateObstacles() {
    obstacleTop = document.getElementById('obstacle-top') // Pega a div obstacle-top e usa como variavel
    obstacleBottom = document.getElementById('obstacle-bottom') //Pega a div obstacle-bottom e usa como variavel

    // Controle de velocidade do objeto por score
    if (score >= 0)
      obstacleSpeed = 4
    if (score >= 3)
      obstacleSpeed = 6
    if (score >= 6)
      obstacleSpeed = 8
    if (score >= 10)
      obstacleSpeed = 10
    if (score >= 15)
      obstacleSpeed = 12
    if (score >= 20)
      obstacleSpeed = 14

    obstacleX -= obstacleSpeed;  // posição do obstaculo é igual a posião menos a velocidade
    
    // Empurra os objetos para a esquerda usando translateX
    obstacleTop.style.transform = `translateX(${obstacleX}px) rotate(180deg)`; //Rotaciona o cano de cima para ficar virado para baixo
    obstacleBottom.style.transform = `translateX(${obstacleX}px)`;

    
    const gameBox = document.querySelector('.box'); // pega só o primeiro elemento com a classe 'box'
    const obstacleRect = obstacleTop.getBoundingClientRect();
    const boxRect = gameBox.getBoundingClientRect();
    
    // Se o obstáculo passou totalmente da tela
    if (obstacleRect.right < boxRect.left) {
      score++;  
      scoreSound.play();
      scoreNumber.innerHTML = score;
      restartObject();
    }
}

function restartObject() {
    obstacleX = window.innerWidth + 450; // começa fora da tela
  
    // gera uma altura aleatória dentro do intervalo
    let alturaCano = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
  
    // aplica as alturas dinamicamente
    obstacleTop.style.height = alturaCano + "px";
    obstacleBottom.style.height = (screenHeight - alturaCano - gapSize) + "px";
  }
  

function colission() {
  const birdRect = flapBird.getBoundingClientRect();
  const birdLeft = birdRect.left;
  const birdRight = birdRect.right;
  const birdTop = birdRect.top;
  const birdBottom = birdRect.bottom;
  
  const obstacles = [obstacleTop, obstacleBottom];
  
  for (let obstacle of obstacles) {
    const rect = obstacle.getBoundingClientRect();
    const obstacleLeft = rect.left;
    const obstacleRight = rect.right;
    const obstacleTop = rect.top;
    const obstacleBottom = rect.bottom;
  
    // Verificação de colisão (usando as bordas)
    if (!(birdRight < obstacleLeft || 
          birdLeft > obstacleRight || 
          birdBottom < obstacleTop || 
          birdTop > obstacleBottom)) {
       createRestartButton();
       break;
    }
  }
  
}

function createRestartButton() {
    const restartButton = document.getElementById("restartButton");
  
    // Mostra o botão
    restartButton.style.display = "block";
    restartButton.disabled = false;
  
    // Adiciona o evento só uma vez
    restartButton.addEventListener('click', restartGame);
  
    // Chama o endGame para parar o jogo
    endGame();
}
  
function endGame() {
    clearInterval(gameInterval); // ✅ para o loop
    isGameRunning = false;
}
  
function restartGame() {
    const restartButton = document.getElementById("restartButton");
  
    // Esconde o botão e remove o evento
    restartButton.style.display = "none";
    restartButton.disabled = true;
    restartButton.removeEventListener('click', restartGame);
  
    // Reseta o jogo
    velocity = 0;
    birdY = 255;
    obstacleSpeed = 0;
    obstacleX = window.innerWidth + 0;
    bg1X = 0;
    bg2X = window.innerWidth;
    score = 0;
    scoreNumber.innerHTML = score;

    // Reinicia
    start();
}
  