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
import { useTranslation } from "react-i18next";
import { AdsConsent, AdsConsentDebugGeography, AdsConsentStatus, MobileAds } from "react-native-google-mobile-ads";

const SoundViewBlock = styled.View`
  flex-direction: row;
  position: absolute;
  width: 95%;
  height: 4%;
  top: 5%;
  right: 5%;
  align-items: center;
`;
const MusicAtrubation = styled.Text`
  color: #c7b22e;
  font-size: 6px;
  text-justify: center;
  text-align: center;
  margin-right: 4%;
`;
const BlockButton = styled.View`
  flex-direction: row;
  position: absolute;
  right: 0;
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
function savePlayerHints(key, value) {
  SecureStore.setItem(key, value);
}

function getSavedPlayerLevel(key) {
  return SecureStore.getItem(key);
}
function getSavedPlayerHints(key) {
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
  const [mistakes, setMistakes] = useState(0);
  const pointForNextlevel = [1000];
  const [hintCount, setHintCount] = useState(getSavedPlayerHints("hints") || 2);
  const gameDividers = [2, 5, 10, 3, 9, 4, 6, 7];
  const [relevel, setRelevel] = useState(false);
  const [language, setLanguage] = useState(getSavedPlayerLanguage("lng") || null);
  const [rule, setRule] = useState(false);
  const [time, setTime] = useState(getSavedPlayerTime("time") || 0);
  const [loadedAdvertisement, setLoadedAdvertisement] = useState(false);
  const [loadedAdvertisementFillCells, setLoadedAdvertisementFillCells] = useState(false);
  const { t } = useTranslation();

  const clockRef = useRef(null);
  const soundRef = useRef(null);
  const [soundPaused, setSoundPaused] = useState(false);
  let timer = time || 0;

  const customNavigationBar = async () => {
    await NavigationBar.setBackgroundColorAsync("#1E2322");
    await NavigationBar.setButtonStyleAsync("light");
  };
  useEffect(() => {
    const requestConsentInfo = async () => {
      try {
        await MobileAds().initialize();
        if (AdsConsent && typeof AdsConsent.requestInfoUpdate === "function") {
          await AdsConsent.requestInfoUpdate({
            debugGeography: AdsConsentDebugGeography.EEA,
          });
        } else {
          console.warn("AdsConsent API is not available");
          return;
        }
        await AdsConsent.loadAndShowConsentFormIfRequired();
        const consentStatus = await AdsConsent.gatherConsent();
        if (consentStatus.status === AdsConsentStatus.OBTAINED) {
          console.log("User gave consent!");
        } else if (consentStatus.status === AdsConsentStatus.REQUIRED) {
          console.log("Consent is still required.");
        }
        await MobileAds().setRequestConfiguration({
          tagForChildDirectedTreatment: true,
          tagForUnderAgeOfConsent: true,
          maxAdContentRating: "G",
        });
      } catch (error) {
        console.warn("Consent error:", error);
      }
    };

    requestConsentInfo();
  }, []);

  useEffect(() => {
    if (mistakes == 5) {
      if (level == 1) {
        Alert.alert(`${t("AlertMistakesLevelDown1level")}`);
        setMistakes(0);
        return setScore(0);
      }
      Alert.alert(`${t("AlertMistakesLevelDown")}`);
      setMistakes(0);
      savePlayerLevel("level", `${level - 1}`);
      setScore(0);
      setLevel(level - 1);
    }
  }, [mistakes]);

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
      savePlayerHints("hints", `${hintCount}`);
      setLevel(newLevel);
      setMistakes(0);
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

  const goToBegining = () => {
    setLevel(1);
    setRelevel(false);
    setRule(true);
    savePlayerLevel("level", "1");
    setTime("0");
    savePlayerTime("time", "0");
    clockRef.current = null;
  };

  if (level > 8) {
    clearInterval(clockRef.current);
    return (
      <>
        <StatusBar style="light" />
        <Endlevel goToBegining={goToBegining} time={time} />
      </>
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
                        {soundPaused ? null : (
                          <View>
                            <MusicAtrubation>Pufino - Thoughtful (freetouse.com)</MusicAtrubation>
                          </View>
                        )}
                        <BlockButton>
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
                          <TouchableOpacity
                            onPress={() => {
                              setLanguage(null);
                              setScore(0);
                            }}
                          >
                            <MaterialIcons name="language" size={24} color="#c7b22e" style={{ marginLeft: 30 }} />
                          </TouchableOpacity>
                        </BlockButton>
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
                        setMistakes={setMistakes}
                        mistakes={mistakes}
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
