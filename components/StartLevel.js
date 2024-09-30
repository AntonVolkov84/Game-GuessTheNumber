import { View, Text, Button, TouchableOpacity } from "react-native";
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
  margin-top: 5%;
`;
const TextExplaining = styled.Text`
  color: whitesmoke;
  align-self: flex-start;
  justify-content: center;
  margin-bottom: 15px;
  font-size: 15px;
  padding-left: 2%;
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

export default function StartLevel({ level, gameDeviders, setStart, clockStart }) {
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
        {t("StartLevel title")} {level}
      </TextLevel>
      <TextExplaining>
        {t("StartLevel rule")} {levelDevider}
      </TextExplaining>
      <TextExplaining>{t("StartLevel info")}</TextExplaining>
      <LottieView
        autoPlay
        style={{
          width: "100%",
          height: 450,
          backgroundColor: "#1E2322",
          marginBottom: 20,
        }}
        source={require("../Lottie Lego.json")}
      />
      <ButtonAgry
        onPress={() => {
          setStart(false);
          clockStart();
        }}
      >
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
          <ButtonText>{t("StartLevel button")}</ButtonText>
        </LinearGradient>
      </ButtonAgry>
    </LinearGradient>
  );
}
