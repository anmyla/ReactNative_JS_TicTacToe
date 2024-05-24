import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';

export default function App() {
  return (
    <View style={styles.container}>
      <Game />
      <StatusBar style="auto" />
    </View>
  );
}

function Square({ value, onSquareClick }) {
  return (
    <TouchableOpacity style={styles.square} onPress={onSquareClick}>
      <Text style={styles.squareText}>{value}</Text>
    </TouchableOpacity>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const status = winner ? 'Winner: ' + winner : 'Next player: ' + (xIsNext ? 'X' : 'O');

  return (
    <View>
      <Text style={styles.status}>{status}</Text>
      <View style={styles.boardRow}>
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </View>
      <View style={styles.boardRow}>
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </View>
      <View style={styles.boardRow}>
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </View>
    </View>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function isBoardFull(squares) {
  return squares.every(square => square !== null);
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const winner = calculateWinner(currentSquares);
  const isDraw = !winner && isBoardFull(currentSquares);

  const moves = history.map((squares, move) => {
    const description = move > 0 ? move + '.  Go to move #' + move : 'Game starts here';
    return (
      <TouchableOpacity style={styles.gameInfoButton} key={move} onPress={() => jumpTo(move)}>
        <Text style={styles.gameInfoButtonText}>{description}</Text>
      </TouchableOpacity>
    );
  });

  if (winner || isDraw) {
    moves.push(
      <TouchableOpacity style={styles.gameInfoButton} key="game-over" onPress={resetGame}>
        <Text style={styles.gameInfoButtonText}>Game Over! Start Again!</Text>
      </TouchableOpacity>
    );
  }
  
  return (
    <View style={styles.game}>
      <View style={styles.gameBoard}>
        <Text style={styles.title}>TicTacToe</Text>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </View>
      <ScrollView style={styles.gameInfo}>
        {moves.map((move, index) => (
          <View key={index}>
            {move}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 60,
    borderWidth: 1,
    borderColor: '#999',
    paddingLeft: 40,
    paddingRight: 40,
    alignSelf: 'center',
    marginBottom: 5,
    color: 'rgb(93, 90, 142)',
  },
  status: {
    alignSelf: 'center',
    marginBottom: 5,
    fontSize: 24,
    fontWeight: '800',
    color: 'rgb(93, 90, 142)',
  },
  square: {
    backgroundColor: '#e8e4f6',
    borderWidth: 1,
    borderColor: '#999',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3,
  },
  squareText: {
    fontSize: 62,
    fontWeight: 'bold',
    color: '#5d4a84',
  },
  boardRow: {
    flexDirection: 'row',
  },
  game: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameBoard: {
    marginBottom: 5,
  },
  gameInfo: {
    marginTop: 5,
  },

  gameInfoButtonText: {
    fontSize: '18px',
    color: 'rgb(93, 90, 142)'
  },

  gameInfoButton: {
    backgroundColor: '#e8e4f6',
    borderWidth: 1,
    borderColor: '#999',
    padding: 3,
    margin: 2
  },
});
