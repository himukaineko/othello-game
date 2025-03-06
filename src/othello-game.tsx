import React, { useState, useEffect, useCallback } from 'react';

// イケメンお兄さんのセリフ集
const IkemenLines = {
  start: [
    "お？オセロ勝負か？面白ぇじゃん、相手してやるよ！",
    "俺に勝てると思ってんの？まぁ、試してみなって！",
    "楽しくやろうぜ？でも、手加減はしねーけどな！",
    "オセロってのは頭脳戦だからな？ほら、かかってこいよ！",
    "ま、サクッと終わらせるか。そっちが泣く前にな？"
  ],
  playerMove: [
    "おっ、いい手じゃん。でも、俺の方が上手いけどな！",
    "へぇ、そうくる？まぁまぁ、面白くなってきた！",
    "うんうん、悪くないね。でも、甘いよ？",
    "ふーん、なるほどね？じゃあ俺も本気出すか！",
    "へへっ、その程度で俺に勝てると思ってんの？"
  ],
  cpuMove: [
    "ほらよ、一手一手が大事なんだぜ？",
    "んー、これでどうだ？読めるか？",
    "ふっ、こっちの番な？まぁ、見とけって",
    "お前の手、全部見えてんだよなぁ",
    "そろそろ俺のターン、いっちゃうよ？"
  ],
  win: [
    "くっ...まさか負けるとは...次は負けないからな！",
    "お前、意外と強いじゃん。認めてやるよ。",
    "ちっ、今日は調子悪かっただけだからな！",
  ],
  lose: [
    "ほら見ろよ、言った通りだろ？俺の勝ちだ！",
    "まだまだだな！もっと練習してから来いよ！",
    "ふふん、当然の結果だな。また挑戦してくれよ！",
  ],
  draw: [
    "おっと、引き分けか。なかなかやるじゃん！",
    "ふーん、意外と粘るね。次は本気出すからな！",
  ]
};

// イケメンお兄さんの表情状態
const IkemenExpressions = {
  NORMAL: "normal",
  SMILE: "smile",
  SURPRISED: "surprised",
  PROUD: "proud",
  SHOCKED: "shocked",
  HAPPY: "happy",
  SAD: "sad"
};

// スタイル定義
const styles = {
  container: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    margin: '0 auto',
    maxWidth: '600px',
    position: 'relative' as const,
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  infoContainer: {
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  scoreContainer: {
    display: 'flex',
    gap: '16px',
    marginTop: '8px',
  },
  scoreItem: {
    display: 'flex',
    alignItems: 'center',
  },
  blackDisk: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: 'black',
    marginRight: '4px',
  },
  whiteDisk: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: 'white',
    border: '1px solid black',
    marginRight: '4px',
  },
  ikemenContainer: {
    marginBottom: '16px',
    padding: '12px',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '400px',
  },
  ikemenHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
  },
  ikemenAvatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    marginRight: '12px',
    overflow: 'hidden',
    position: 'relative' as const,
  },
  ikemenImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  board: {
    border: '4px solid black',
    backgroundColor: '#166534',
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)',
    gap: '1px',
    marginBottom: '16px',
    position: 'relative' as const,
  },
  cell: {
    width: '48px',
    height: '48px',
    border: '1px solid black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#15803d',
    position: 'relative' as const,
  },
  disk: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
  },
  blackDiskLarge: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'black',
  },
  whiteDiskLarge: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'white',
    border: '1px solid black',
  },
  availableMove: {
    position: 'absolute' as const,
    width: '16px',
    height: '16px',
    backgroundColor: '#22c55e',
    borderRadius: '50%',
    opacity: 0.5,
  },
  resetButton: {
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
  },
  gameOverContainer: {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: '#fef3c7',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center' as const,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    animation: 'fadeIn 0.5s ease-in-out',
  },
  gameOverTitle: {
    fontWeight: 'bold',
    fontSize: '24px',
    marginBottom: '8px',
    color: '#d97706',
  },
  resultText: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginTop: '8px',
  },
  victoryText: {
    color: '#047857',
    fontWeight: 'bold',
    fontSize: '28px',
    textShadow: '0 0 5px rgba(4, 120, 87, 0.3)',
    animation: 'pulse 1.5s infinite',
  },
  defeatText: {
    color: '#b91c1c',
    fontWeight: 'bold',
    fontSize: '28px',
    textShadow: '0 0 5px rgba(185, 28, 28, 0.3)',
    animation: 'shake 0.5s',
  },
  drawText: {
    color: '#4f46e5',
    fontWeight: 'bold',
    fontSize: '28px',
    textShadow: '0 0 5px rgba(79, 70, 229, 0.3)',
    animation: 'bounce 1s',
  },
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease-in-out',
  },
  overlayContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
    position: 'relative' as const,
  },
  confetti: {
    position: 'absolute' as const,
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    animation: 'fall 3s linear forwards',
  },
};

// アニメーションスタイルを適用するためのCSS
const injectStyles = () => {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    @keyframes shake {
      0% { transform: translateX(0); }
      10% { transform: translateX(-5px); }
      20% { transform: translateX(5px); }
      30% { transform: translateX(-5px); }
      40% { transform: translateX(5px); }
      50% { transform: translateX(-5px); }
      60% { transform: translateX(5px); }
      70% { transform: translateX(-5px); }
      80% { transform: translateX(5px); }
      90% { transform: translateX(-5px); }
      100% { transform: translateX(0); }
    }
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-20px); }
      60% { transform: translateY(-10px); }
    }
    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    @keyframes fall {
      0% { transform: translateY(-100px); opacity: 1; }
      100% { transform: translateY(1000px); opacity: 0; }
    }
  `;
  document.head.appendChild(styleElement);
};

// イケメンの表情マッピング (画像ファイル名へのマッピング)
const expressionToImage = {
  [IkemenExpressions.NORMAL]: "normal.png",
  [IkemenExpressions.SMILE]: "smile.png",
  [IkemenExpressions.SURPRISED]: "surprised.png",
  [IkemenExpressions.PROUD]: "proud.png",
  [IkemenExpressions.SHOCKED]: "shocked.png",
  [IkemenExpressions.HAPPY]: "happy.png",
  [IkemenExpressions.SAD]: "sad.png"
};
// 画像が見つからない場合のフォールバック用絵文字
const expressionToFace = {
  [IkemenExpressions.NORMAL]: "😐",
  [IkemenExpressions.SMILE]: "😄",
  [IkemenExpressions.SURPRISED]: "😲",
  [IkemenExpressions.PROUD]: "😏",
  [IkemenExpressions.SHOCKED]: "😱",
  [IkemenExpressions.HAPPY]: "😁",
  [IkemenExpressions.SAD]: "😔"
};

// 紙吹雪の色
const confettiColors = [
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#FFA500', '#800080', '#008000', '#FF4500', '#1E90FF', '#FFD700'
];

const OthelloGame = () => {
  // ゲーム状態
  const [board, setBoard] = useState<string[][]>(Array.from({ length: 8 }, () => Array(8).fill(null)));
  const [playerColor, setPlayerColor] = useState<'black' | 'white'>('black');
  const [cpuColor, setCpuColor] = useState<'black' | 'white'>('white');
  const [currentTurn, setCurrentTurn] = useState<'black' | 'white'>('black');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState({ white: 2, black: 2 });
  const [message, setMessage] = useState('');
  const [ikemenExpression, setIkemenExpression] = useState(IkemenExpressions.NORMAL);
  const [availableMoves, setAvailableMoves] = useState<{ row: number; col: number }[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const [gameResult, setGameResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [confetti, setConfetti] = useState<{id: number, x: number, y: number, color: string}[]>([]);

  // 方向の定義（上、右上、右、右下、下、左下、左、左上）
  const directions = [
    { row: -1, col: 0 },
    { row: -1, col: 1 },
    { row: 0, col: 1 },
    { row: 1, col: 1 },
    { row: 1, col: 0 },
    { row: 1, col: -1 },
    { row: 0, col: -1 },
    { row: -1, col: -1 }
  ];

  // 画像の初期化とプリロード関数
  const preloadImages = () => {
    const expressions = Object.keys(expressionToImage);
    
    // すべての表情の画像をプリロード
    expressions.forEach(expression => {
      const imageName = expressionToImage[expression as keyof typeof expressionToImage];
      const imagePath = `${process.env.PUBLIC_URL}/images/${imageName}`;
      
      const img = new Image();
      img.src = imagePath;
      
      img.onload = () => {
        console.log(`Successfully loaded image: ${imagePath}`);
        setImagesLoaded(prev => ({
          ...prev,
          [expression]: true
        }));
      };
      
      img.onerror = (error) => {
        console.error(`Failed to load image: ${imagePath}`, error);
        setImagesLoaded(prev => ({
          ...prev,
          [expression]: false
        }));
      };
    });
  };

  // アニメーションスタイルの注入
  useEffect(() => {
    injectStyles();
    preloadImages(); // 画像をプリロード
  }, []);

  // 勝利時に紙吹雪を生成
  const createConfetti = () => {
    const newConfetti = [];
    const count = 100;
    
    for (let i = 0; i < count; i++) {
      const x = Math.random() * window.innerWidth;
      const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      newConfetti.push({
        id: i,
        x,
        y: -10,
        color
      });
    }
    
    setConfetti(newConfetti);
  };

  // 画像読み込みエラー時のハンドラ
  const handleImageError = (expression: string) => {
    setImagesLoaded(prev => ({
      ...prev,
      [expression]: false
    }));
  };

  // 画像読み込み成功時のハンドラ
  const handleImageLoad = (expression: string) => {
    setImagesLoaded(prev => ({
      ...prev,
      [expression]: true
    }));
  };

  // ランダムなメッセージを選択する関数
  const getRandomMessage = (messageType: keyof typeof IkemenLines) => {
    const messages = IkemenLines[messageType];
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  };

  // 新しいゲームの初期化
  const initializeGame = () => {
    const newBoard = Array.from({ length: 8 }, () => Array(8).fill(null));

    // 初期配置
    newBoard[3][3] = "white";
    newBoard[3][4] = "black";
    newBoard[4][3] = "black";
    newBoard[4][4] = "white";

    // プレイヤーとCPUの色をランダムに設定
    const colors: ("black" | "white")[] = ["black", "white"];
    const randomIndex = Math.floor(Math.random() * 2);
    setPlayerColor(colors[randomIndex]);
    setCpuColor(colors[1 - randomIndex]);
    
    // ゲーム状態を初期化
    setBoard(newBoard);
    setCurrentTurn("black");
    setGameStarted(true);
    setGameOver(false);
    setScores({ white: 2, black: 2 });
    setGameResult(null);
    setShowOverlay(false);
    
    // イケメンお兄さんの最初のセリフをセット
    setMessage(getRandomMessage('start'));
    setIkemenExpression(IkemenExpressions.SMILE);
  };

  // 有効な手かどうかをチェックする関数
  const isValidMove = (row: number, col: number, color: string) => {
    // 既に石が置かれている場所には置けない
    if (board[row][col]) return false;
    
    // 各方向に対してチェック
    for (const dir of directions) {
      let r = row + dir.row;
      let c = col + dir.col;
      let flips = [];
      
      // 盤面の範囲内かつ相手の石がある場合は先へ進む
      while (
        r >= 0 && r < 8 && c >= 0 && c < 8 && 
        board[r][c] && board[r][c] !== color
      ) {
        flips.push({ row: r, col: c });
        r += dir.row;
        c += dir.col;
      }
      
      // 盤面の範囲内かつ自分の石で終わる場合は有効な手
      if (
        flips.length > 0 && 
        r >= 0 && r < 8 && c >= 0 && c < 8 && 
        board[r][c] === color
      ) {
        return true;
      }
    }
    
    return false;
  };

  // 石をひっくり返す関数
  const flipStones = (row: number, col: number, color: string) => {
    const newBoard = JSON.parse(JSON.stringify(board));
    newBoard[row][col] = color;
    
    // 各方向に対してチェック
    for (const dir of directions) {
      let r = row + dir.row;
      let c = col + dir.col;
      let flips = [];
      
      // 盤面の範囲内かつ相手の石がある場合は先へ進む
      while (
        r >= 0 && r < 8 && c >= 0 && c < 8 && 
        board[r][c] && board[r][c] !== color
      ) {
        flips.push({ row: r, col: c });
        r += dir.row;
        c += dir.col;
      }
      
      // 盤面の範囲内かつ自分の石で終わる場合はひっくり返す
      if (
        flips.length > 0 && 
        r >= 0 && r < 8 && c >= 0 && c < 8 && 
        board[r][c] === color
      ) {
        flips.forEach(pos => {
          newBoard[pos.row][pos.col] = color;
        });
      }
    }
    
    return newBoard;
  };

  // 有効な手を全て取得する関数
  const getAvailableMoves = (color: string) => {
    const moves: { row: number; col: number }[] = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (isValidMove(row, col, color)) {
          moves.push({ row, col });
        }
      }
    }
    
    return moves;
  };

  // スコアを計算する関数
  const calculateScores = (board: string[][]) => {
    let black = 0;
    let white = 0;
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === 'black') black++;
        if (board[row][col] === 'white') white++;
      }
    }
    
    return { black, white };
  };

// ゲームが終了したかチェックする関数
const checkGameOver = (board: string[][]) => {
  const blackMoves = getAvailableMoves('black');
  const whiteMoves = getAvailableMoves('white');
  
  if (blackMoves.length === 0 && whiteMoves.length === 0) {
    const scores = calculateScores(board);
    setScores(scores);
    setGameOver(true);
    
    // 勝敗結果を設定
    let result: 'win' | 'lose' | 'draw' = 'draw';
    
    if (scores.black > scores.white) {
      // 黒の勝ち
      result = playerColor === 'black' ? 'win' : 'lose';
      
      if (playerColor === 'black') {
        // プレイヤーの勝ち - CPUの負けセリフを表示
        setMessage(getRandomMessage('win'));
        setIkemenExpression(IkemenExpressions.SAD);
      } else {
        // CPUの勝ち - CPUの勝ちセリフを表示
        setMessage(getRandomMessage('lose'));
        setIkemenExpression(IkemenExpressions.HAPPY);
      }
    } else if (scores.white > scores.black) {
      // 白の勝ち
      result = playerColor === 'white' ? 'win' : 'lose';
      
      if (playerColor === 'white') {
        // プレイヤーの勝ち - CPUの負けセリフを表示
        setMessage(getRandomMessage('win'));
        setIkemenExpression(IkemenExpressions.SAD);
      } else {
        // CPUの勝ち - CPUの勝ちセリフを表示
        setMessage(getRandomMessage('lose'));
        setIkemenExpression(IkemenExpressions.HAPPY);
      }
    } else {
      // 引き分け
      result = 'draw';
      setMessage(getRandomMessage('draw'));
      setIkemenExpression(IkemenExpressions.SURPRISED);
    }
    
    setGameResult(result);
    
    // オーバーレイと勝利演出を表示
    setTimeout(() => {
      setShowOverlay(true);
      if (result === 'win') {
        createConfetti();
      }
    }, 500);
    
    return true;
  }
  
  return false;
};

  // 石を置く処理（プレイヤーとCPU共通）
  const handleMove = (row: number, col: number, color: string) => {
    const newBoard = flipStones(row, col, color);
    setBoard(newBoard);
    
    // スコアを更新
    const newScores = calculateScores(newBoard);
    setScores(newScores);
    
    // ゲーム終了チェック
    if (!checkGameOver(newBoard)) {
      // ターンを切り替え
      const nextColor = color === 'black' ? 'white' : 'black';
      setCurrentTurn(nextColor);
    }
  };

  // セルがクリックされたときの処理
  const handleCellClick = (row: number, col: number) => {
    if (gameOver || currentTurn !== playerColor) return;
    
    if (isValidMove(row, col, playerColor)) {
      handleMove(row, col, playerColor);
      
      // ランダムでお兄さんの表情と台詞を変更
      setMessage(getRandomMessage('playerMove'));
      
      // プレイヤーの石の数が多い場合は驚き/ショック、少ない場合は余裕の表情
      const currentScores = calculateScores(board);
      const playerStones = playerColor === 'black' ? currentScores.black : currentScores.white;
      const cpuStones = cpuColor === 'black' ? currentScores.black : currentScores.white;
      
      if (playerStones > cpuStones + 5) {
        // プレイヤーがかなりリードしている場合
        setIkemenExpression(IkemenExpressions.SHOCKED);
      } else if (playerStones > cpuStones) {
        // プレイヤーが少しリードしている場合
        setIkemenExpression(IkemenExpressions.SURPRISED);
      } else {
        // CPUがリードしている場合
        setIkemenExpression(Math.random() > 0.5 ? IkemenExpressions.PROUD : IkemenExpressions.SMILE);
      }
    }
  };

  // CPUの手を選択する関数（石の数で評価する版）
  const cpuMove = useCallback(() => {
    const moves = getAvailableMoves(cpuColor);
    
    if (moves.length > 0) {
      // 各手の評価値を計算
      const scoredMoves = moves.map(move => {
        // その手を打った場合の盤面をシミュレーション
        const simulatedBoard = flipStones(move.row, move.col, cpuColor);
        
        // シミュレーション後の石の数を数える
        const cpuStones = simulatedBoard.flat().filter((cell: string | null) => cell === cpuColor).length;
        
        return {
          ...move,
          score: cpuStones  // CPUの石の数を評価値とする
        };
      });
      
      // 評価値が最大の手を選ぶ（CPUの石が最も多くなる手）
      const bestMove = scoredMoves.reduce((best, current) => 
        current.score > best.score ? current : best, 
        scoredMoves[0]
      );
      
      // 少し待ってから手を打つ
      setTimeout(() => {
        handleMove(bestMove.row, bestMove.col, cpuColor);
        
        // スコアに応じて表情とセリフを変更
        setMessage(getRandomMessage('cpuMove'));
        
        const currentScores = calculateScores(board);
        const playerStones = playerColor === 'black' ? currentScores.black : currentScores.white;
        const cpuStones = cpuColor === 'black' ? currentScores.black : currentScores.white;
        
        if (cpuStones > playerStones + 5) {
          // CPUが大きくリードしている場合
          setIkemenExpression(IkemenExpressions.PROUD);
        } else if (cpuStones > playerStones) {
          // CPUが少しリードしている場合
          setIkemenExpression(IkemenExpressions.HAPPY);
        } else if (cpuStones < playerStones - 5) {
          // CPUが大きく負けている場合
          setIkemenExpression(IkemenExpressions.SHOCKED);
        } else {
          // CPUが少し負けている場合
          setIkemenExpression(IkemenExpressions.NORMAL);
        }
      }, 1000);
    } else {
      // 手がない場合はパス
      setCurrentTurn(playerColor);
      setMessage("俺はパスだ。お前の番だぜ。");
      setIkemenExpression(IkemenExpressions.SURPRISED);
    }
  }, [cpuColor, playerColor, board]);

  // 初期化とターン管理
  useEffect(() => {
    initializeGame();
  }, []);

// 有効な手の更新
  useEffect(() => {
    if (gameStarted && !gameOver) {
      const moves = getAvailableMoves(currentTurn);
      setAvailableMoves(moves);
      
      // 有効な手がない場合はパス
      if (moves.length === 0) {
        const nextColor = currentTurn === 'black' ? 'white' : 'black';
        const nextMoves = getAvailableMoves(nextColor);
        
        if (nextMoves.length > 0) {
          setCurrentTurn(nextColor);
          setMessage(`${currentTurn === playerColor ? 'あなた' : '俺'}は手がないのでパスです。`);
          setIkemenExpression(IkemenExpressions.SURPRISED);
        } else {
          // 両者とも手がない場合はゲーム終了
          checkGameOver(board);
        }
      }
    }
  }, [board, currentTurn, gameStarted, gameOver, playerColor]);

  // CPUの手番管理
  useEffect(() => {
    if (gameStarted && !gameOver && currentTurn === cpuColor) {
      cpuMove();
    }
  }, [currentTurn, gameStarted, gameOver, cpuColor, cpuMove]);

  const resetGame = () => {
    initializeGame();
    setShowOverlay(false);
    setGameResult(null);
    setConfetti([]);
  };

  const closeOverlay = () => {
    setShowOverlay(false);
  };

  // イケメンお兄さんの表情を表示する関数
  const renderIkemenFace = () => {
    const imageName = expressionToImage[ikemenExpression];
    
    // GitHub Pagesのベースパスを考慮した画像パス
    const imagePath = `${process.env.PUBLIC_URL}/images/${imageName}`;
    
    console.log(`Attempting to load image: ${imagePath}`);
    
    return (
      <div style={styles.ikemenAvatar}>
        {imagesLoaded[ikemenExpression] !== false ? (
          <img 
            src={imagePath}
            alt={`お兄さん ${ikemenExpression}`} 
            style={styles.ikemenImage}
            onError={() => handleImageError(ikemenExpression)}
            onLoad={() => handleImageLoad(ikemenExpression)}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#3b82f6',
            fontSize: '24px',
          }}>
            {expressionToFace[ikemenExpression]}
          </div>
        )}
      </div>
    );
  };

  // 勝敗表示用テキスト
  const getResultText = () => {
    switch (gameResult) {
      case 'win':
        return (
          <div style={{ 
            ...styles.resultText, 
            ...styles.victoryText as any
          }}>
            あなたの勝ち！
          </div>
        );
      case 'lose':
        return (
          <div style={{ 
            ...styles.resultText, 
            ...styles.defeatText as any
          }}>
            お兄さんの勝ち！
          </div>
        );
      case 'draw':
        return (
          <div style={{ 
            ...styles.resultText, 
            ...styles.drawText as any
          }}>
            引き分け！
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>イケメンオセロゲーム</h1>
      
      {/* ゲーム情報 */}
      <div style={styles.infoContainer}>
        <p style={{ fontWeight: 'bold' }}>
          あなた: {playerColor === 'black' ? '黒' : '白'} / 
          お兄さん: {cpuColor === 'black' ? '黒' : '白'}
        </p>
        <p style={{ fontWeight: 'bold' }}>
          現在のターン: {currentTurn === 'black' ? '黒' : '白'}
          {currentTurn === playerColor ? '（あなた）' : '（お兄さん）'}
        </p>
        <div style={styles.scoreContainer}>
          <div style={styles.scoreItem}>
            <div style={styles.blackDisk}></div>
            <span>{scores.black}</span>
          </div>
          <div style={styles.scoreItem}>
            <div style={styles.whiteDisk}></div>
            <span>{scores.white}</span>
          </div>
        </div>
      </div>
      
      {/* イケメンお兄さんの表示エリア */}
      <div style={styles.ikemenContainer}>
        <div style={styles.ikemenHeader}>
          {renderIkemenFace()}
          <p style={{ fontWeight: 'bold' }}>お兄さん</p>
        </div>
        <p style={{ fontStyle: 'italic' }}>{message}</p>
      </div>
      
      {/* オセロ盤面を表示 */}
      <div style={styles.board}>
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => {
            const isAvailable = availableMoves.some(
              move => move.row === rowIndex && move.col === colIndex
            );
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{
                  ...styles.cell,
                  cursor: isAvailable && currentTurn === playerColor ? 'pointer' : 'default',
                }}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell ? (
                  <div 
                    style={cell === "black" ? styles.blackDiskLarge : styles.whiteDiskLarge}
                  ></div>
                ) : (
                  <div style={styles.disk}>
                    {isAvailable && currentTurn === playerColor && (
                      <div style={styles.availableMove}></div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ))}
      </div>
      
      {/* ゲーム操作ボタン */}
      <div>
        <button 
          onClick={resetGame}
          style={styles.resetButton}
        >
          ゲームをリセット
        </button>
      </div>
      
      {/* ゲーム終了メッセージ（通常表示） */}
      {gameOver && !showOverlay && (
        <div style={styles.gameOverContainer}>
          <p style={styles.gameOverTitle}>ゲーム終了！</p>
          <p>
            黒: {scores.black} / 白: {scores.white}
          </p>
          <p style={{ fontWeight: 'bold' }}>
            {scores.black > scores.white 
              ? (playerColor === 'black' ? "あなたの勝ち！" : "お兄さんの勝ち！") 
              : scores.white > scores.black 
                ? (playerColor === 'white' ? "あなたの勝ち！" : "お兄さんの勝ち！") 
                : "引き分け！"}
          </p>
        </div>
      )}
      
      {/* 勝敗オーバーレイ */}
      {showOverlay && (
        <div style={styles.overlay} onClick={closeOverlay}>
          <div style={styles.overlayContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.gameOverTitle}>ゲーム終了！</h2>
            
            {/* お兄さんの表情と台詞を追加 */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '16px',
              justifyContent: 'center'
            }}>
              {renderIkemenFace()}
              <div style={{ 
                marginLeft: '16px', 
                padding: '10px', 
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                maxWidth: '220px'
              }}>
                <p style={{ fontStyle: 'italic' }}>{message}</p>
              </div>
            </div>
            
            {getResultText()}
            
            <p style={{ margin: '16px 0' }}>
              最終スコア<br />
              黒: {scores.black} / 白: {scores.white}
            </p>
            
            <div style={{ marginTop: '20px' }}>
              <button 
                onClick={resetGame}
                style={{
                  ...styles.resetButton,
                  padding: '10px 20px',
                  fontSize: '16px',
                }}
              >
                もう一度プレイする
              </button>
            </div>
          </div>
          
          {/* 紙吹雪（勝利時のみ） */}
          {gameResult === 'win' && confetti.map((item) => (
            <div
              key={item.id}
              style={{
                ...styles.confetti as any,
                left: `${item.x}px`,
                top: `${item.y}px`,
                backgroundColor: item.color,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OthelloGame;