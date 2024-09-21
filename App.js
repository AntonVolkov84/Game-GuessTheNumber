import React, { useState } from "react";
import { StyleSheet, View, Alert, Text } from "react-native";
import GuessInput from "./components/GuessInput";

export default function App() {
  const [score, setScore] = useState(0);

  const handleScoreUpdate = (points) => {
    setScore(score + points);
  };

  return (
    <View style={styles.container}>
      <GuessInput onScoreUpdate={handleScoreUpdate} />
      <Text style={styles.scoreText}>Очки: {score}</Text>
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
