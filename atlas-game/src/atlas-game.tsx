import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trophy } from 'lucide-react';

// Types for TypeScript support
const GameState = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  FINISHED: 'finished'
};

// Component for displaying player scores
const PlayerScore = ({ player, score, isCurrentTurn }) => (
  <div className={`p-4 rounded-lg ${isCurrentTurn ? 'bg-blue-100' : 'bg-gray-100'}`}>
    <h3 className="font-semibold">{player}</h3>
    <div className="flex items-center gap-2">
      <Trophy size={20} />
      <span className="text-xl">{score}</span>
    </div>
  </div>
);

// Component for the places list
const PlacesList = ({ places }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
    {places.map((place, index) => (
      <div key={index} className="p-2 bg-gray-100 rounded flex justify-between">
        <span>{place.name}</span>
        <span className="text-sm text-gray-500">+1</span>
      </div>
    ))}
  </div>
);

// Main game component
const AtlasGame = () => {
  // Game state
  const [gameState, setGameState] = useState(GameState.WAITING);
  const [currentInput, setCurrentInput] = useState('');
  const [error, setError] = useState('');
  const [lastLetter, setLastLetter] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState(1);
  
  // Player state
  const [places, setPlaces] = useState([]);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });

  // Local storage key
  const STORAGE_KEY = 'atlas_game_state';

  // Simplified point calculation
  const calculatePoints = () => {
    return 1;
  };

  // Load game state from local storage
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const { places, scores, currentPlayer, gameState, lastLetter } = JSON.parse(savedState);
      setPlaces(places);
      setScores(scores);
      setCurrentPlayer(currentPlayer);
      setGameState(gameState);
      setLastLetter(lastLetter);
    }
  }, []);

  // Save game state to local storage
  const saveGameState = () => {
    const state = {
      places,
      scores,
      currentPlayer,
      gameState,
      lastLetter
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  // Handle place submission
  const validateAndAddPlace = () => {
    const place = currentInput.trim();
    
    // Basic validation
    if (place.length === 0) {
      setError('Please enter a place name');
      return;
    }

    // Check for duplicates
    if (places.some(p => p.name.toLowerCase() === place.toLowerCase())) {
      setError('This place has already been used!');
      return;
    }

    // Check if it starts with the last letter of previous word
    if (lastLetter && place[0].toLowerCase() !== lastLetter.toLowerCase()) {
      setError(`Place name must start with '${lastLetter}'`);
      return;
    }

    // Add place with simple scoring
    const points = calculatePoints();
    const newPlace = { name: place, points, player: currentPlayer };
    setPlaces([...places, newPlace]);
    setScores(prev => ({
      ...prev,
      [`player${currentPlayer}`]: prev[`player${currentPlayer}`] + points
    }));
    setLastLetter(place[place.length - 1]);
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    setCurrentInput('');
    setError('');
    
    // Save state
    saveGameState();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      validateAndAddPlace();
    }
  };

  const resetGame = () => {
    setPlaces([]);
    setScores({ player1: 0, player2: 0 });
    setCurrentInput('');
    setError('');
    setLastLetter('');
    setCurrentPlayer(1);
    setGameState(GameState.WAITING);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Atlas Game</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Player scores */}
        <div className="grid grid-cols-2 gap-4">
          <PlayerScore 
            player="Player 1" 
            score={scores.player1} 
            isCurrentTurn={currentPlayer === 1}
          />
          <PlayerScore 
            player="Player 2" 
            score={scores.player2} 
            isCurrentTurn={currentPlayer === 2}
          />
        </div>

        {/* Input section */}
        <div className="flex space-x-2">
          <Input
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={lastLetter ? `Player ${currentPlayer}: Enter a place starting with '${lastLetter}'` : `Player ${currentPlayer}: Enter a place name`}
            className="flex-1"
          />
          <Button onClick={validateAndAddPlace}>Submit</Button>
          <Button variant="outline" onClick={resetGame}>Reset</Button>
        </div>

        {/* Error messages */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Places list */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Places Used ({places.length})</h3>
          <PlacesList places={places} />
        </div>
      </CardContent>
    </Card>
  );
};

export default AtlasGame;
