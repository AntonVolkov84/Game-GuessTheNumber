import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert, Text } from "react-native";
import GuessInput from "./components/GuessInput";
import Fireworks from "./components/Fireworks";
import StartLevel from "./components/StartLevel";

export default function App() {
  const [score, setScore] = useState(0);
  const [start, setStart] = useState(true);
  const [level, setLevel] = useState(1);
  const pointForNextlevel = [210, 220, 230];
  const [hintCount, setHintCount] = useState(2);
  const gameDividers = [2, 5, 10, 3, 9, 4, 6, 7];
  const [relevel, setRelevel] = useState(false);
  const ind = (level + 2) % 3;

  useEffect(() => {
    if (+score >= +pointForNextlevel[ind]) {
      setRelevel(true);
      setLevel(level + 1);
      setScore(0);
    }
  }, [score]);

  const handleScoreUpdate = (points) => {
    setScore(score + points);
  };

  return (
    <>
      {start ? (
        <View style={{ paddingTop: 50, paddingHorizontal: 20 }}>
          <StartLevel setStart={setStart} level={level} gameDeviders={gameDividers} />
        </View>
      ) : (
        <View style={styles.container}>
          {relevel ? (
            <Fireworks level={level} gameDeviders={gameDividers} setRelevel={setRelevel} />
          ) : (
            <>
              <GuessInput
                setHintCount={setHintCount}
                hintCount={hintCount}
                onScoreUpdate={handleScoreUpdate}
                level={level}
                gameDeviders={gameDividers}
              />
              <Text style={styles.scoreText}>
                Очки: {score} / {pointForNextlevel[ind]}
              </Text>
            </>
          )}
        </View>
      )}
    </>
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
