import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert, Text } from "react-native";
import GuessInput from "./components/GuessInput";
import Fireworks from "./components/Fireworks";

export default function App() {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const pointForNextlevel = [210, 220, 230];
  const gameDividers = [2, 5, 10, 3, 4, 9, 6, 7];
  const [relevel, setRelevel] = useState(false);
  const ind = (level + 2) % 3;

  useEffect(() => {
    if (+score > +pointForNextlevel[ind]) {
      setRelevel(true);
      setLevel(level + 1);
      setScore(0);
    }
  }, [score]);

  const handleScoreUpdate = (points) => {
    setScore(score + points);
  };

  return (
    <View style={styles.container}>
      {relevel ? (
        <Fireworks level={level} setRelevel={setRelevel} />
      ) : (
        <>
          <GuessInput onScoreUpdate={handleScoreUpdate} level={level} gameDeviders={gameDividers} />
          <Text style={styles.scoreText}>
            Очки: {score} / {pointForNextlevel[ind]}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    marginTop: 40,
    padding: 20,
  },
  scoreText: {
    fontSize: 24,
    marginTop: 20,
    textAlign: "center",
  },
});
