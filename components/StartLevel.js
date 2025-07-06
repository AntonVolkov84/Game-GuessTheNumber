import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

export default function StartLevel({ level, gameDeviders, setStart }) {
  const levelIndex = Math.floor(level / 3);
  const levelDevider = gameDeviders[levelIndex];
  const { t } = useTranslation();

  return (
    <LinearGradient
      colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.textLevel}>
        {t("StartLevel title")} {level}
      </Text>

      <Text style={styles.textExplaining}>
        {t("StartLevel rule")} {levelDevider}
      </Text>

      <Text style={styles.textExplaining}>{t("StartLevel info")}</Text>

      <LottieView autoPlay style={styles.lottie} source={require("../Lottie Lego.json")} />

      <TouchableOpacity style={styles.buttonAgry} onPress={() => setStart(false)}>
        <LinearGradient
          colors={["#849ae9", "#6ea0eb", "#2db3f1", "#2ab4f1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.linearGradient}
        >
          <Text style={styles.buttonText}>{t("StartLevel button")}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    padding: 10,
    paddingTop: "5%",
  },
  textLevel: {
    color: "coral",
    alignSelf: "center",
    fontSize: 22,
    marginBottom: 15,
    marginTop: "5%",
  },
  textExplaining: {
    color: "whitesmoke",
    alignSelf: "flex-start",
    justifyContent: "center",
    marginBottom: 15,
    fontSize: 15,
    paddingLeft: "2%",
  },
  lottie: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#1E2322",
    marginBottom: 20,
  },
  buttonAgry: {
    width: 200,
    height: 50,
    alignSelf: "center",
    borderRadius: 28,
    overflow: "hidden",
  },
  linearGradient: {
    height: "100%",
    width: "100%",
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "whitesmoke",
  },
});
