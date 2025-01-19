import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AtlasGame = () => {
  const [places, setPlaces] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [error, setError] = useState('');
  const [lastLetter, setLastLetter] = useState('');

  const validateAndAddPlace = () => {
    const place = currentInput.trim();
    
    // Basic validation
    if (place.length === 0) {
      setError('Please enter a place name');
      return;
    }

    // Check for duplicates
    if (places.includes(place.toLowerCase())) {
      setError('This place has already been used!');
      return;
    }

    // Check if it starts with the last letter of previous word
    if (lastLetter && place[0].toLowerCase() !== lastLetter.toLowerCase()) {
      setError(`Place name must start with '${lastLetter}'`);
      return;
    }

    // Add the place
    setPlaces([...places, place.toLowerCase()]);
    setLastLetter(place[place.length - 1]);
    setCurrentInput('');
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      validateAndAddPlace();
    }
  };

  const resetGame = () => {
    setPlaces([]);
    setCurrentInput('');
    setError('');
    setLastLetter('');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Atlas Game</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={lastLetter ? `Enter a place starting with '${lastLetter}'` : "Enter a place name"}
            className="flex-1"
          />
          <Button onClick={validateAndAddPlace}>Submit</Button>
          <Button variant="outline" onClick={resetGame}>Reset</Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Places Used ({places.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {places.map((place, index) => (
              <div key={index} className="p-2 bg-gray-100 rounded">
                {index + 1}. {place.charAt(0).toUpperCase() + place.slice(1)}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AtlasGame;
