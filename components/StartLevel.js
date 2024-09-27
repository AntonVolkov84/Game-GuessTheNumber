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
`;
const TextExplaining = styled.Text`
  color: whitesmoke;
  align-self: center;
  justify-content: center;
  margin-bottom: 15px;
  font-size: 15px;
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

export default function StartLevel({ level, gameDeviders, setStart }) {
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
        Вы на уровне {level} {t("yes")}
      </TextLevel>
      <TextExplaining>
        Сумма чисел по вертикали, горизонтали или диагонали должна делиться на {levelDevider}
      </TextExplaining>
      <TextExplaining>
        Помни, что все четные числа делятся на 2! Если сложить два четных числа или два нечетных - гарантировано получим
        четное в результате.
      </TextExplaining>
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
      <ButtonAgry onPress={() => setStart(false)}>
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
          <ButtonText>Понял</ButtonText>
        </LinearGradient>
      </ButtonAgry>
    </LinearGradient>
  );
}
