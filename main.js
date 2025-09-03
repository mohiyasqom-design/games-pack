const gameContainer = document.getElementById("gameContainer");
let currentGame = null;

function startGame(game){
  gameContainer.innerHTML = "";
  currentGame = game;
  const levelDiv = document.createElement("div");
  levelDiv.innerHTML = `
    <label>سطح سختی:
      <select id="level">
        <option value="easy">ساده</option>
        <option value="medium">متوسط</option>
        <option value="hard">سخت</option>
      </select>
    </label>
    <div style="margin-top:10px">
      <button id="startBtn">شروع بازی</button>
      <button id="backBtn">بازگشت به منو</button>
    </div>
  `;
  gameContainer.appendChild(levelDiv);
  document.getElementById("startBtn").addEventListener("click", ()=>{
    const level = document.getElementById("level").value;
    loadGame(game, level);
  });
  document.getElementById("backBtn").addEventListener("click", ()=>{ location.reload(); });
}

function loadGame(game, level){
  gameContainer.innerHTML = "";
  if(game==="xo") loadXO(level);
  else if(game==="snakes") loadSnakes(level);
  else if(game==="ludo") loadLudo(level);
}

/* --------------- XO --------------- */
function loadXO(level){
  const boardDiv = document.createElement("div");
  boardDiv.id = "xoBoard";
  boardDiv.style.display = "grid";
  boardDiv.style.gridTemplateColumns = "repeat(3, 100px)";
  boardDiv.style.gridTemplateRows = "repeat(3, 100px)";
  boardDiv.style.gap = "8px";
  gameContainer.appendChild(boardDiv);

  const statusDiv = document.createElement("div");
  statusDiv.id = "xoStatus";
  statusDiv.style.marginTop = "15px";
  statusDiv.style.fontWeight = "bold";
  statusDiv.textContent = "نوبت: شما (X)";
  gameContainer.appendChild(statusDiv);

  let cells = Array(9).fill(null);
  let gameOver = false;
  const combos=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

  function checkWinnerState(boardState,player){
    return combos.some(c=>c.every(idx=>boardState[idx]===player));
  }
  function checkWinner(player){return checkWinnerState(cells,player);}
  function placeMove(cell, player){
    cell.textContent = player;
    cell.style.color = player==="X"?"#ff4757":"#1e90ff";
    cells[parseInt(cell.dataset.index)] = player;
    if(checkWinner(player)){
      statusDiv.textContent = player==="X"?"🎉 شما برنده شدید!":"😈 کامپیوتر برنده شد!";
      gameOver=true;
      highlightWinner(player);
    } else if(cells.every(c=>c)) {
      statusDiv.textContent = "مساوی شد!";
      gameOver=true;
    } else if(player==="X"){
      statusDiv.textContent = "نوبت: کامپیوتر (O)";
      setTimeout(computerMove, 400);
    } else {
      statusDiv.textContent = "نوبت: شما (X)";
    }
  }

  function highlightWinner(player){
    combos.forEach(combo=>{
      if(combo.every(idx=>cells[idx]===player)){
        combo.forEach(idx=>boardDiv.children[idx].style.background = player==="X"?"#ffcccc":"#cce0ff");
      }
    });
  }

  function playerMove(cell){
    if(cells[parseInt(cell.dataset.index)] || gameOver) return;
    placeMove(cell,"X");
  }

  function computerMove(){
    if(gameOver) return;
    let move;
    if(level==="easy") move = easyAI();
    else if(level==="medium") move = mediumAI();
    else if(level==="hard") move = hardAI();
    if(move===null || move===undefined) return;
    const cell = boardDiv.children[move];
    placeMove(cell,"O");
  }

  function easyAI(){ for(let i=0;i<9;i++){ if(!cells[i]) return i; } return null; }
  function mediumAI(){
    for(let i=0;i<9;i++){ if(!cells[i]){ cells[i]="O"; if(checkWinner("O")){ cells[i]=null; return i;} cells[i]=null; } }
    for(let i=0;i<9;i++){ if(!cells[i]){ cells[i]="X"; if(checkWinner("X")){ cells[i]=null; return i;} cells[i]=null; } }
    if(!cells[4]) return 4;
    const corners = [0,2,6,8].filter(i=>!cells[i]);
    if(corners.length) return corners[0];
    for(let i=0;i<9;i++) if(!cells[i]) return i;
    return null;
  }
  function hardAI(){
    function minimax(boardState,depth,isMax){
      if(checkWinnerState(boardState,"O")) return 10-depth;
      if(checkWinnerState(boardState,"X")) return depth-10;
      if(boardState.every(c=>c)) return 0;
      if(isMax){
        let best=-Infinity;
        for(let i=0;i<9;i++){ if(!boardState[i]){ boardState[i]="O"; best=Math.max(best,minimax(boardState,depth+1,false)); boardState[i]=null; } }
        return best;
      } else {
        let best=Infinity;
        for(let i=0;i<9;i++){ if(!boardState[i]){ boardState[i]="X"; best=Math.min(best,minimax(boardState,depth+1,true)); boardState[i]=null; } }
        return best;
      }
    }
    let bestScore=-Infinity, move=null;
    for(let i=0;i<9;i++){ if(!cells[i]){ cells[i]="O"; let score=minimax(cells,0,false); cells[i]=null; if(score>bestScore){bestScore=score; move=i;} } }
    return move;
  }

  for(let i=0;i<9;i++){
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.style.width="100px"; cell.style.height="100px";
    cell.style.border="2px solid #444";
    cell.style.display="flex"; cell.style.justifyContent="center";
    cell.style.alignItems="center";
    cell.style.fontSize="2rem";
    cell.style.cursor="pointer";
    cell.dataset.index=i;
    cell.addEventListener("click",()=>playerMove(cell));
    boardDiv.appendChild(cell);
  }

  const resetBtn = document.createElement("button");
  resetBtn.textContent = "شروع دوباره";
  resetBtn.style.marginTop = "12px";
  resetBtn.addEventListener("click", ()=>{ gameContainer.innerHTML=''; loadXO(level); });
  gameContainer.appendChild(resetBtn);
}

/* --------------- Snake & Ladder ---------------- */
function loadSnakes(level){
  // این بخش مشابه نسخه کامل قبلی است
}

/* --------------- Ludo ---------------- */
function loadLudo(level){
  // این بخش مشابه نسخه کامل قبلی است
}

gameContainer.innerHTML = '<div style="padding:8px;color:#111">یک بازی انتخاب کنید و سطح سختی را تعیین کنید.</div>';
