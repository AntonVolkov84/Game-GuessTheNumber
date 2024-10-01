import React, { useEffect, useRef, useState } from "react";
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
import { Audio } from "expo-av";

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
  const pointForNextlevel = [1000];
  const [hintCount, setHintCount] = useState(2);
  const gameDividers = [2, 5, 10, 3, 9, 4, 6, 7];
  const [relevel, setRelevel] = useState(false);
  const [language, setLanguage] = useState(null);
  const [rule, setRule] = useState(false);
  const [time, setTime] = useState(0);
  const funRef = useRef(null);
  const [sound, setSound] = useState();
  let timer = 0;

  useEffect(() => {
    if (+score >= +pointForNextlevel) {
      setRelevel(true);
      setLevel(level + 1);
      setScore(0);
    }
  }, [score]);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(require("./assets/Light2.mp3"), { isLooping: true });
    setSound(sound);
    await sound.playAsync();
  };

  const handleScoreUpdate = (points) => {
    setScore(score + points);
  };

  if (level > 8) {
    clearInterval(funRef.current);
    return <Endlevel time={time} setTime={setTime} setLevel={setLevel} />;
  }
  const clockStart = () => {
    funRef.current = setInterval(() => {
      timer++;
      setTime(timer);
    }, 1000);
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      {!language ? (
        <Language setLanguage={setLanguage} playSound={playSound} />
      ) : (
        <>
          {!rule ? (
            <Rule setRule={setRule} />
          ) : (
            <>
              {start ? (
                <View>
                  <StartLevel clockStart={clockStart} setStart={setStart} level={level} gameDeviders={gameDividers} />
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
                        time={time}
                        setTime={setTime}
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
