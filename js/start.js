window.onload = function() { //primeira função começa ao apertar o botão start
  document.getElementById('highScore').innerText = `Record: ${highScore}`;       // Atualiza o texto de record na tela

  obstacleTop = document.getElementById('obstacle-top'); // define o obstaculo de cima para não gerar no meio das funções
  obstacleBottom = document.getElementById('obstacle-bottom'); // define o obstaculo de baixo para não gerar no meio das funções
  flapBird = document.getElementById('flapBird'); // define o obstaculo do passaro para não gerar no meio das funções
  
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
let flapBird;
let currentAngle = 0;           // variável global para armazenar o ângulo atual
let gravity = 0.3;           // A força que puxa pra baixo
let velocity = 0;          // Velocidade atual do pássaro
let birdY = 250;           // Posição vertical inicial
let jumpSound = new Audio('./sound/audio_jump.mp3')
// Obstaculo
let obstacleX = window.innerWidth + 0; // 200px fora da tela     // posição X obstaculos
let alturaCano = 0;      // altura aleatoria dos canos
let obstacleSpeed = 0; // velocidade do obstaculo
const gapSize = Math.min(screenHeight, screenWidth) * 0.4; // 40% da menor dimensão (altura ou largura)
const minHeight = screenHeight * 0.1; // altura mínima do cano de cima (10%)
const maxHeight = screenHeight * 0.5; // altura máxima do cano de cima (50%)
// Pontuação
let highScore = Number(localStorage.getItem('highScore')) || 0;
let score = 0;
let scoreSound = new Audio('./sound/audio_score.mp3');
// Game
let gameInterval;
let isGameRunning = false; // Vê se o jogo esta rodando 
let gameLoopId;
let lastTime = 0;


function start() {
    const botao = document.getElementById("button")
    botao.removeEventListener("click", start);
    botao.disabled = true
    botao.style.display = 'none' // esconde o botão start

    gameStart(); // puxa a função gameStart e começa o jogo
}

function gameStart() {
    flapBird = document.getElementById('flapBird');
    isGameRunning = true;
    
    document.addEventListener('keydown', (event) => {
        // A propriedade identifica a tecla física espaço no teclado
        if (event.code === 'Space') {
            if (isGameRunning == true) { // se o jogo ta rodando
            jumpSound.currentTime = 0; // Volta o som pro 0 toda vez que o usuario pula de novo
            jumpSound.play();
            velocity = -7; // Adiciona um pulo ao boneco 8 pixels pra cima
        }}})

    document.addEventListener('touchstart', () => { // Toque na tela
        if (isGameRunning == true) {
          jumpSound.currentTime = 0; // Volta o som pro 0 toda vez que o usuario pula de novo
          jumpSound.play();
          velocity = -7;
          }});

          gameLoop(); // inicia o loop de animação
  }

function gameLoop() { // Começa o loop puxando as funções que fazem obstaculos, cenario e passaro moverem
  updateBird();
  updateObstacles();
  scenarie();
  colission();

  if (isGameRunning) { // Se o jogo estiver rodando
    gameLoopId = requestAnimationFrame(gameLoop);
  }
  }

function updateBird() {
    velocity += gravity; // velocidade é igual a velocidade mais gravidade
    birdY -= velocity; // linha vertical do passaro é igual a ela menos a velocidade

    let maxAngle = 45; // setta o angulo maximo que ele desce
    let minAngle = -30; // setta o angulo maximo que ele sobe
    let targetAngle = velocity * 5; //angulo do passaro igual velocidade * 5
  
    if (targetAngle > maxAngle) targetAngle = maxAngle; // limita o ângulo máximo para não passar do limite pra baixo
    if (targetAngle < minAngle) targetAngle = minAngle; // limita o ângulo máximo para não passar do limite pra cima
  
    // Lerp para suavizar a rotação
    currentAngle += (targetAngle - currentAngle) * 0.1; //Angulo atual, começa no 0 + (angulo meta - o angulo atual) * 0,1

    flapBird.style.transform = `translate3d(0px, -${birdY}px, 0px) rotate(${currentAngle}deg)`; // Uso de transform e translate3d pra forçar uso de gpu no celular


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

  bg1.style.transform = `translate3d(${bg1X}px, 0, 0)`;
  bg2.style.transform = `translate3d(${bg2X}px, 0, 0)`;

  // Quando um fundo sai totalmente da tela, move ele pro final do outro
  if (bg1X + window.innerWidth <= 0) {
    bg1X = bg2X + window.innerWidth;
  }

  if (bg2X + window.innerWidth <= 0) {
    bg2X = bg1X + window.innerWidth;

  }
}

function updateObstacles() {
    // Controle de velocidade do objeto por score
    if (score >= 0)
      obstacleSpeed = 3
    if (score >= 3)
      obstacleSpeed = 4
    if (score >= 6)
      obstacleSpeed = 6
    if (score >= 10)
      obstacleSpeed = 8
    if (score >= 15)
      obstacleSpeed = 10
    if (score >= 20)
      obstacleSpeed = 12
    if (score >= 30)
      obstacleSpeed = 14
    if (score >= 40)
      obstacleSpeed = 16

    obstacleX -= obstacleSpeed;  // posição do obstaculo é igual a posião menos a velocidade
    
    // Empurra os objetos para a esquerda usando translate3d para melhor otimização em celular
    obstacleTop.style.transform = `translate3d(${obstacleX}px, 0, 0) rotate(180deg)`;
    obstacleBottom.style.transform = `translate3d(${obstacleX}px, 0, 0)`;

    
    const gameBox = document.querySelector('.box'); // pega só o primeiro elemento com a classe 'box'
    const obstacleRect = obstacleTop.getBoundingClientRect();
    const boxRect = gameBox.getBoundingClientRect();
    
    // Se o obstáculo passou totalmente da tela
    if (obstacleRect.right < boxRect.left) {
      score++;  // Contabiliza +1 score
      scoreSound.play(); // Toca o som de ponto
      scoreNumber.innerHTML = score; // Muda o contador do score

        // Se o jogador faz um novo recorde
    if (score > highScore) { // Se o score for maior que o highScore
      highScore = score;
      localStorage.setItem('highScore', highScore); // Altera o valor do highScore
    }
    
    // Atualiza o texto na tela
    document.getElementById('highScore').innerText = `Record: ${highScore}`;

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
    cancelAnimationFrame(gameLoopId);
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
    currentAngle = 0;
    obstacleSpeed = 0;
    obstacleX = window.innerWidth + 0;
    bg1X = 0;
    bg2X = window.innerWidth;
    score = 0;
    scoreNumber.innerHTML = score;

    // Reinicia
    start();
}
  