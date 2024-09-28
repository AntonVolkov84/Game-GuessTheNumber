import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import styled from "styled-components";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

const TextLevel = styled.Text`
  color: coral;
  align-self: center;
  font-size: 22px;
  margin-bottom: 15px;
`;
const TextExplaining = styled.Text`
  color: whitesmoke;
  align-self: center;
  justify-content: center;
  margin-bottom: 15px;
  font-size: 18px;
`;
const ButtonAgry = styled.TouchableOpacity`
  width: 200px;
  height: 50px;
  margin: 0 auto;
  border-radius: 28px;
`;
const ButtonText = styled.Text`
  color: whitesmoke;
`;

export default function Fireworks({ level, setRelevel, gameDeviders }) {
  const levelIndex = Math.floor(level / 3);
  const levelDevider = gameDeviders[levelIndex];
  const { t } = useTranslation();

  return (
    <LinearGradient
      colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={{ height: "100%", width: "100%", padding: 10 }}
    >
      <TextLevel>
        {t("Fireworks title")} {level}
      </TextLevel>
      <TextExplaining>
        {t("Fireworks rule")} <Text style={{ color: "red" }}>{levelDevider}</Text>
      </TextExplaining>
      {+level >= 1 && +level <= 2 ? <TextExplaining>{t("Fireworks a")}</TextExplaining> : <></>}
      {+level >= 3 && +level <= 5 ? <TextExplaining>{t("Fireworks b")}</TextExplaining> : <></>}
      {+level >= 6 && +level <= 8 ? <TextExplaining>{t("Fireworks c")}</TextExplaining> : <></>}
      {+level >= 9 && +level <= 11 ? <TextExplaining>{t("Fireworks d")}</TextExplaining> : <></>}
      {+level >= 12 && +level <= 14 ? <TextExplaining>{t("Fireworks e")}</TextExplaining> : <></>}
      {+level >= 15 && +level <= 17 ? <TextExplaining>{t("Fireworks f")}</TextExplaining> : <></>}
      {+level >= 18 && +level <= 20 ? <TextExplaining>{t("Fireworks g")}</TextExplaining> : <></>}
      {+level >= 21 && +level <= 23 ? <TextExplaining>{t("Fireworks h")}</TextExplaining> : <></>}
      <LottieView
        autoPlay
        style={{
          width: "100%",
          height: 450,
          backgroundColor: "#1E2322",
          overflow: "hidden",
          marginBottom: 20,
        }}
        source={require("../Animation.json")}
      />

      <ButtonAgry onPress={() => setRelevel(false)}>
        <LinearGradient
          colors={["#849ae9", "#6ea0eb", "#2db3f1", "#2ab4f1"]}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 1.0 }}
          style={{
            height: "100%",
            width: "100%",
            padding: 10,
            overflow: "hidden",
            borderRadius: 30,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ButtonText>{t("Fireworks button")}</ButtonText>
        </LinearGradient>
      </ButtonAgry>
    </LinearGradient>
  );
}
