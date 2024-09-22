import { View, Text, Button } from "react-native";
import React from "react";

export default function Fireworks({ level, setRelevel }) {
  return (
    <View>
      <Text>Вы переходите на уровень {level}</Text>
      <Button title="Понял" onPress={() => setRelevel(false)}></Button>
    </View>
  );
}
