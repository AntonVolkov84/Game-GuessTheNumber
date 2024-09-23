import { View, Text, Button } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

const dataMathRule = {
  a: "Помни, что все четные числа делятся на 2! Если сложить два четных числа, гарантировано получим четное в результате.",
  b: "Помни, что все числа, которые заканчиваются на 5 и 0 - делятся на 5!",
  c: "Помни, что все двузначные числа и более, которые заканчиваются на 0 - делятся на 10!",
  d: "Помни, что все четные числа делятся на 2! Если сложить два четных числа, гарантировано получим четное в результате.",
  e: "Помни, что все четные числа делятся на 2! Если сложить два четных числа, гарантировано получим четное в результате.",
  f: "Помни, что все четные числа делятся на 2! Если сложить два четных числа, гарантировано получим четное в результате.",
  g: "Помни, что все четные числа делятся на 2! Если сложить два четных числа, гарантировано получим четное в результате.",
  h: "Помни, что все четные числа делятся на 2! Если сложить два четных числа, гарантировано получим четное в результате.",
};

export default function Fireworks({ level, setRelevel, gameDeviders }) {
  const levelIndex = Math.floor(level / 3);
  const levelDevider = gameDeviders[levelIndex];

  return (
    <View>
      <Text>Вы переходите на уровень {level}</Text>
      <Text>Теперь сумма чисел должна делиться на {levelDevider}</Text>
      {+level >= 1 && +level <= 2 ? <Text>{dataMathRule.a}</Text> : <></>}
      {+level >= 3 && +level <= 5 ? <Text>{dataMathRule.b}</Text> : <></>}
      {+level >= 6 && +level <= 8 ? <Text>{dataMathRule.c}</Text> : <></>}
      {+level >= 9 && +level <= 11 ? <Text>{dataMathRule.d}</Text> : <></>}
      {+level >= 12 && +level <= 14 ? <Text>{dataMathRule.e}</Text> : <></>}
      {+level >= 15 && +level <= 17 ? <Text>{dataMathRule.f}</Text> : <></>}
      {+level >= 18 && +level <= 20 ? <Text>{dataMathRule.g}</Text> : <></>}
      {+level >= 21 && +level <= 23 ? <Text>{dataMathRule.h}</Text> : <></>}
      <Button title="Понял" onPress={() => setRelevel(false)}></Button>
      <LottieView
        autoPlay
        style={{
          width: "100%",
          height: 500,
          backgroundColor: "#eee",
        }}
        source={require("../Animation.json")}
      />
    </View>
  );
}
