import { View, Text } from "react-native";
import React from "react";
import styled from "styled-components";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import LottieView from "lottie-react-native";

const EndlevelBlockText = styled.Text`
  width: 100%;
  height: 8%;
  font-size: 22px;
  margin-top: 10%;
  color: whitesmoke;
  text-align: center;
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

export default function Endlevel({ setLevel, time, setTime, savePlayerLevel, savePlayerTime }) {
  const { t } = useTranslation();

  const getFullTime = () => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min} ${t("Endlevel min")} : ${sec} ${t("Endlevel sec")}`;
  };
  return (
    <LinearGradient
      colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={{ height: "100%", width: "100%", padding: 10 }}
    >
      <EndlevelBlockText>{t("Endlevel greeting")}</EndlevelBlockText>
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
      <EndlevelBlockText>
        {t("Endlevel info")} {getFullTime()}
      </EndlevelBlockText>
      <ButtonAgry onPress={() => setLevel(1)}>
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
          <ButtonText
            onPress={() => {
              setLevel(1);
              savePlayerLevel("level", "1");
              savePlayerTime("time", `0`);
              setTime(0);
            }}
          >
            {t("Endlevel button")}
          </ButtonText>
        </LinearGradient>
      </ButtonAgry>
    </LinearGradient>
  );
}
