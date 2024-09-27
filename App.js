import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import GuessInput from "./components/GuessInput";
import Fireworks from "./components/Fireworks";
import StartLevel from "./components/StartLevel";
import Language from "./components/Language";
import styled from "styled-components";

const TextLevel = styled.Text`
  color: coral;
  align-self: center;
  font-size: 22px;
  margin-bottom: 15px;
`;
const TextScore = styled.Text`
  color: coral;
  align-self: center;
  font-size: 22px;
  margin-top: 15px;
`;

export default function App() {
  const [score, setScore] = useState(0);
  const [start, setStart] = useState(true);
  const [level, setLevel] = useState(1);
  const pointForNextlevel = [210, 220, 230];
  const [hintCount, setHintCount] = useState(2);
  const gameDividers = [2, 5, 10, 3, 9, 4, 6, 7];
  const [relevel, setRelevel] = useState(false);
  const ind = (level + 2) % 3;
  const [language, setLanguage] = useState(null);

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
      {!language ? (
        <Language setLanguage={setLanguage} />
      ) : (
        <View>
          {start ? (
            <View style={{ paddingTop: 50 }}>
              <StartLevel setStart={setStart} level={level} gameDeviders={gameDividers} />
            </View>
          ) : (
            <View style={styles.container}>
              {relevel ? (
                <Fireworks level={level} gameDeviders={gameDividers} setRelevel={setRelevel} />
              ) : (
                <LinearGradient
                  colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
                  start={{ x: 0.0, y: 0.0 }}
                  end={{ x: 1.0, y: 1.0 }}
                  style={{ height: "100%", width: "100%", padding: 10 }}
                >
                  <GuessInput
                    score={score}
                    pointForNextlevel={pointForNextlevel}
                    setHintCount={setHintCount}
                    hintCount={hintCount}
                    onScoreUpdate={handleScoreUpdate}
                    level={level}
                    gameDeviders={gameDividers}
                  />
                </LinearGradient>
              )}
            </View>
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
    // padding: 20,
  },
});
