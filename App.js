import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Alert, Text, TouchableOpacity } from "react-native";
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
import Entypo from "@expo/vector-icons/Entypo";
import i18next from "./i18next";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as NavigationBar from "expo-navigation-bar";
import * as SecureStore from "expo-secure-store";

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
const SoundViewBlock = styled.View`
  flex-direction: row;
  position: absolute;
  width: fit-content;
  height: 30px;
  top: 5%;
  right: 5%;
`;

const setLng = (lng) => {
  i18next.changeLanguage(lng);
};

function savePlayerLevel(key, value) {
  SecureStore.setItem(key, value);
}
function savePlayerTime(key, value) {
  SecureStore.setItem(key, value);
}
function savePlayerLanguage(key, value) {
  SecureStore.setItem(key, value);
}
function getSavedPlayerLevel(key) {
  return SecureStore.getItem(key);
}
function getSavedPlayerTime(key) {
  return SecureStore.getItem(key);
}
function getSavedPlayerLanguage(key) {
  return SecureStore.getItem(key);
}

export default function App() {
  const [score, setScore] = useState(0);
  const [start, setStart] = useState(false);
  const [level, setLevel] = useState(getSavedPlayerLevel("level") || 1);
  const pointForNextlevel = [1000];
  const [hintCount, setHintCount] = useState(2);
  const gameDividers = [2, 5, 10, 3, 9, 4, 6, 7];
  const [relevel, setRelevel] = useState(false);
  const [language, setLanguage] = useState(getSavedPlayerLanguage("lng") || null);
  const [rule, setRule] = useState(false);
  const [time, setTime] = useState(getSavedPlayerTime("time") || 0);
  const [loadedAdvertisement, setLoadedAdvertisement] = useState(false);
  const [loadedAdvertisementFillCells, setLoadedAdvertisementFillCells] = useState(false);
  const clockRef = useRef(null);
  const soundRef = useRef(null);
  const [soundPaused, setSoundPaused] = useState(false);
  let timer = time || 0;

  const customNavigationBar = async () => {
    await NavigationBar.setBackgroundColorAsync("#1E2322");
    await NavigationBar.setButtonStyleAsync("light");
  };

  useEffect(() => {
    if (level === "1") {
      setStart(true);
    }
  }, [level]);
  useEffect(() => {
    if (language) {
      const lng = getSavedPlayerLanguage("lng");
      setLng(lng);
    }
  }, [language]);
  useEffect(() => {
    customNavigationBar();
    if (+score >= +pointForNextlevel) {
      setRelevel(true);
      const newLevel = Number(level) + Number(1);
      savePlayerLevel("level", `${newLevel}`);
      savePlayerTime("time", `${time}`);
      setLevel(newLevel);
      setScore(0);
    }
  }, [score]);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(require("./assets/Light2.mp3"), { isLooping: true });
    soundRef.current = sound;
    await sound.playAsync();
  };

  const handleScoreUpdate = (points) => {
    setScore(score + points);
  };

  if (level > 8) {
    clearInterval(clockRef.current);
    return (
      <Endlevel
        savePlayerLevel={savePlayerLevel}
        savePlayerTime={savePlayerTime}
        time={time}
        setTime={setTime}
        setLevel={setLevel}
        clockRef={clockRef}
      />
    );
  }
  const clockStart = () => {
    clockRef.current = setInterval(() => {
      timer++;
      setTime(timer);
    }, 1000);
  };
  return (
    <>
      <StatusBar style="light" />
      {!language ? (
        <Language savePlayerLanguage={savePlayerLanguage} setLanguage={setLanguage} />
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
                      style={{ height: "100%", width: "100%", padding: 10, paddingTop: "5%" }}
                    >
                      <SoundViewBlock>
                        <TouchableOpacity
                          onPress={() => {
                            setLanguage(null);
                            setScore(0);
                          }}
                        >
                          <MaterialIcons name="language" size={24} color="#c7b22e" style={{ marginRight: 30 }} />
                        </TouchableOpacity>
                        {soundPaused ? (
                          <TouchableOpacity
                            onPress={() => {
                              setSoundPaused(false);
                              soundRef.current.playAsync();
                            }}
                          >
                            <Entypo name="sound" size={24} color="#c7b22e" />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              setSoundPaused(true);
                              soundRef.current.pauseAsync();
                            }}
                          >
                            <Entypo name="sound-mute" size={24} color="#c7b22e" />
                          </TouchableOpacity>
                        )}
                      </SoundViewBlock>
                      <GuessInput
                        loadedAdvertisement={loadedAdvertisement}
                        setLoadedAdvertisement={setLoadedAdvertisement}
                        clockRef={clockRef}
                        playSound={playSound}
                        setLanguage={setLanguage}
                        clockStart={clockStart}
                        time={time}
                        setTime={setTime}
                        score={score}
                        pointForNextlevel={pointForNextlevel}
                        setHintCount={setHintCount}
                        hintCount={hintCount}
                        onScoreUpdate={handleScoreUpdate}
                        level={level}
                        gameDeviders={gameDividers}
                        soundRef={soundRef}
                        loadedAdvertisementFillCells={loadedAdvertisementFillCells}
                        setLoadedAdvertisementFillCells={setLoadedAdvertisementFillCells}
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
