import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import GuessInput from "./components/GuessInput";
import Fireworks from "./components/Fireworks";
import StartLevel from "./components/StartLevel";
import Language from "./components/Language";
import styled from "styled-components";
import Rule from "./components/Rule";
import Endlevel from "./components/Endlevel";
import { StatusBar } from "expo-status-bar";

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
  const pointForNextlevel = [1000, 1300, 1600];
  const [hintCount, setHintCount] = useState(2);
  const gameDividers = [2, 5, 10, 3, 9, 4, 6, 7];
  const [relevel, setRelevel] = useState(false);
  const ind = (level + 2) % 3;
  const [language, setLanguage] = useState(null);
  const [rule, setRule] = useState(false);

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

  if (+level === 24) {
    return <Endlevel setLevel={setLevel} />;
  }

  return (
    <>
      <StatusBar barStyle="light-content" />
      {!language ? (
        <Language setLanguage={setLanguage} />
      ) : (
        <>
          {!rule ? (
            <Rule setRule={setRule} />
          ) : (
            <>
              {start ? (
                <View>
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
            </>
          )}
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    marginTop: 0,
  },
});
