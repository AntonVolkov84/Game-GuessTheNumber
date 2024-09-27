import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import styled from "styled-components";
import { LinearGradient } from "expo-linear-gradient";

const dataMathRule = {
  a: "Помни, что все четные числа делятся на 2! Если сложить два четных числа или два нечетных, гарантировано получим четное в результате.",
  b: "Помни, что все числа, которые заканчиваются на 5 и 0 - делятся на 5!",
  c: "Помни, что все двузначные числа и более, которые заканчиваются на 0 - делятся на 10!",
  d: "Помни, что все четные числа делятся на 2! Если сложить два четных числа, гарантировано получим четное в результате.",
  e: "Помни, что все четные числа делятся на 2! Если сложить два четных числа, гарантировано получим четное в результате.",
  f: "Помни, что все четные числа делятся на 2! Если сложить два четных числа, гарантировано получим четное в результате.",
  g: "Помни, что все четные числа делятся на 2! Если сложить два четных числа, гарантировано получим четное в результате.",
  h: "Помни, что все четные числа делятся на 2! Если сложить два четных числа, гарантировано получим четное в результате.",
};

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

export default function Fireworks({ level, setRelevel, gameDeviders }) {
  const levelIndex = Math.floor(level / 3);
  const levelDevider = gameDeviders[levelIndex];

  return (
    <LinearGradient
      colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={{ height: "100%", width: "100%", padding: 10 }}
    >
      <TextLevel>Вы переходите на уровень {level}</TextLevel>
      <TextExplaining>Теперь сумма чисел должна делиться на {levelDevider}</TextExplaining>
      {+level >= 1 && +level <= 2 ? <TextExplaining>{dataMathRule.a}</TextExplaining> : <></>}
      {+level >= 3 && +level <= 5 ? <TextExplaining>{dataMathRule.b}</TextExplaining> : <></>}
      {+level >= 6 && +level <= 8 ? <TextExplaining>{dataMathRule.c}</TextExplaining> : <></>}
      {+level >= 9 && +level <= 11 ? <TextExplaining>{dataMathRule.d}</TextExplaining> : <></>}
      {+level >= 12 && +level <= 14 ? <TextExplaining>{dataMathRule.e}</TextExplaining> : <></>}
      {+level >= 15 && +level <= 17 ? <TextExplaining>{dataMathRule.f}</TextExplaining> : <></>}
      {+level >= 18 && +level <= 20 ? <TextExplaining>{dataMathRule.g}</TextExplaining> : <></>}
      {+level >= 21 && +level <= 23 ? <TextExplaining>{dataMathRule.h}</TextExplaining> : <></>}
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
          <ButtonText>Ясно, понятно</ButtonText>
        </LinearGradient>
      </ButtonAgry>
    </LinearGradient>
  );
}
