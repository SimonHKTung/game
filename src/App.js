import React, { useState } from "react";

const App = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState(null);

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
            aiMove(newBoard);
            setBoard([...newBoard]);
            if (calculateWinner(newBoard)) {
                setWinner("O");
            }
        }, 500);
    };

    const aiMove = (newBoard) => {
        let bestMove = findBestMove(newBoard);
        if (bestMove !== -1) {
            newBoard[bestMove] = "O";
        }
    };

    const findBestMove = (board) => {
        // Winning combinations
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        // Check if AI can win
        for (let [a, b, c] of winningCombinations) {
            if (board[a] === "O" && board[b] === "O" && !board[c]) return c;
            if (board[a] === "O" && board[c] === "O" && !board[b]) return b;
            if (board[b] === "O" && board[c] === "O" && !board[a]) return a;
        }

        // Check if AI needs to block player
        for (let [a, b, c] of winningCombinations) {
            if (board[a] === "X" && board[b] === "X" && !board[c]) return c;
            if (board[a] === "X" && board[c] === "X" && !board[b]) return b;
            if (board[b] === "X" && board[c] === "X" && !board[a]) return a;
        }

        // Pick center if available
        if (!board[4]) return 4;

        // Pick a random empty cell
        const emptyIndices = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
        return emptyIndices.length > 0 ? emptyIndices[Math.floor(Math.random() * emptyIndices.length)] : -1;
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
            <h1>Tic-Tac-Toe with Smarter AI</h1>
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
