window.onload = function() { //primeira função começa ao apertar o botão start
    const botao = document.getElementById('button');
    botao.addEventListener('click', start);
}

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
let obstacleGravity = 0.01;  // a força que puxa o obstaculo para esquerda
let obstacleSpeed = 0; // velocidade do obstaculo
// Pontuação
let score = 0;
let scoreSound = new Audio('./sound/audio_score.mp3');
let obstaclePassed = false;
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
        updateScore();
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

  bg1.style.left = bg1X + "px";
  bg2.style.left = bg2X + "px";

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

    obstacleSpeed += obstacleGravity; // velocidade do obstaculo é igual a velocidade dele mais a gravidade
    obstacleX -= obstacleSpeed;  // posição do obstaculo é igual a posião menos a velocidade
    
    obstacleTop.style.left = obstacleX + "px" // Vai puxando o obstaculo do topo
    obstacleBottom.style.left = obstacleX + "px" // Vai puxando o obstaculo de baixo

    if (obstacleX <= -90) { //se o obstaculo passar -60 do eixo X
        restartObject(); 
      }
}

function restartObject() {
    obstacleX = window.innerWidth + 350; // faz com que o X do obstaculo comece 350px após a borda da janela
    
    let alturaCano = Math.floor(Math.random() * (400 - 100 + 1)) + 100; //a altura do cano é gerada aleatoriamente
    let gap = -500; // espaço pro pássaro passar

    obstacleTop.style.height = alturaCano + "px"; //define a altura do cano de cima com o valor aleatorio
    obstacleBottom.style.height = (900 - alturaCano + gap) + "px"; // define a altura do cano de baixo sendo 900 base - a altura do cano + o espaço pro passaro passar

    obstaclePassed = false; // ✅ reseta a flag do score

    // Adia a liberação do updateScore para o próximo frame
    obstacleJustReset = true;
    setTimeout(() => {
        obstacleJustReset = false;
    }, 5); // Em quantos frames ocorre a limitação para conseguir outro ponto
}

function colission() {
    const birdRect = flapBird.getBoundingClientRect();
    const obstacles = [obstacleTop, obstacleBottom]; // lista de obstáculos

    for (let obstacle of obstacles) {
        const rect = obstacle.getBoundingClientRect();
        // Checagem de colisão
        if (!(birdRect.right < rect.left || //se o lado direito do passaro é menor que o canto esquerdo do objeto
              birdRect.left > rect.right || 
              birdRect.bottom < rect.top || 
              birdRect.top > rect.bottom)) {
            createRestartButton();
            break; // interrompe o loop, já que bateu em algum
        }
    }
}

function updateScore() {
    const birdRect = flapBird.getBoundingClientRect();
    const topRect = obstacleTop.getBoundingClientRect();
    const scoreNumber = document.getElementById('scoreNumber');

    // Se acabou de reiniciar, ignora este frame
    if (obstacleJustReset) return;

    if (!obstaclePassed && birdRect.left > topRect.right) {
      console.log("Contou ponto - obstacleX:", obstacleX);
      obstaclePassed = true;
      score++;  
      scoreSound.play();
      scoreNumber.innerHTML = score;
}}

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
    obstacleGravity = 0.01;
    obstacleSpeed = 0;
    obstacleX = window.innerWidth + 0;
    backgroundX = 0;
    score = 0;
    scoreNumber.innerHTML = score;

    // Reinicia
    start();
}
  