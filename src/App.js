import React, { useState } from "react";

const App = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [winner, setWinner] = useState(null);
    const [difficulty, setDifficulty] = useState("Medium");

    const handleClick = (index) => {
        if (board[index] || winner) return;
        const newBoard = [...board];
        newBoard[index] = "X";
        setBoard(newBoard);
        
        if (calculateWinner(newBoard)) {
            setWinner("X");
            return;
        }
        
        setTimeout(() => {
            let aiMove = findBestMove(newBoard);
            if (aiMove !== -1) {
                newBoard[aiMove] = "O";
            }
            setBoard([...newBoard]);
            if (calculateWinner(newBoard)) {
                setWinner("O");
            }
        }, 500);
    };

    const findBestMove = (board) => {
        if (difficulty === "Easy") {
            return findRandomMove(board);
        } else if (difficulty === "Medium") {
            return findSmartMove(board);
        } else {
            return findOptimalMove(board);
        }
    };

    const findRandomMove = (board) => {
        const emptyIndices = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
        return emptyIndices.length > 0 ? emptyIndices[Math.floor(Math.random() * emptyIndices.length)] : -1;
    };

    const findSmartMove = (board) => {
        // Medium AI: Tries to win, blocks opponent, then picks center or random
        let move = findWinningMove(board, "O");
        if (move !== -1) return move;

        move = findWinningMove(board, "X");
        if (move !== -1) return move;

        return Math.random() > 0.3 ? findOptimalMove(board) : findRandomMove(board);
    };

    const findWinningMove = (board, player) => {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let [a, b, c] of winningCombinations) {
            if (board[a] === player && board[b] === player && !board[c]) return c;
            if (board[a] === player && board[c] === player && !board[b]) return b;
            if (board[b] === player && board[c] === player && !board[a]) return a;
        }
        return -1;
    };

    const findOptimalMove = (board) => {
        let bestScore = -Infinity;
        let move = -1;

        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = "O";
                let score = minimax(board, false);
                board[i] = null;
                
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    };

    const minimax = (board, isMaximizing) => {
        const winner = calculateWinner(board);
        if (winner === "O") return 1;
        if (winner === "X") return -1;
        if (!board.includes(null)) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === null) {
                    board[i] = "O";
                    let score = minimax(board, false);
                    board[i] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === null) {
                    board[i] = "X";
                    let score = minimax(board, true);
                    board[i] = null;
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };

    const calculateWinner = (board) => {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let [a, b, c] of winningCombinations) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    };

    return (
        <div>
            <h1>Tic-Tac-Toe with Advanced AI</h1>
            <div>
                <label>Difficulty: </label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 100px)", gap: "5px" }}>
                {board.map((cell, index) => (
                    <button 
                        key={index} 
                        onClick={() => handleClick(index)} 
                        style={{ width: "100px", height: "100px", fontSize: "24px" }}
                        disabled={cell !== null || winner !== null}
                    >
                        {cell}
                    </button>
                ))}
            </div>
            <h2>{winner ? `Winner: ${winner}` : `Next Player: X`}</h2>
            <button onClick={() => { setBoard(Array(9).fill(null)); setWinner(null); }}>Restart Game</button>
        </div>
    );
};

export default App;
