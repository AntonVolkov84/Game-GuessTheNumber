import { View, Modal, SafeAreaView, Text, Button, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageResources } from "../i18next.js";
import i18next from "../i18next.js";
import languageList from "../i18n/languageList.json";
import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components";

const ButtonAgry = styled.TouchableOpacity`
  width: 150px;
  height: 50px;
  margin: 0 auto;
  border-radius: 28px;
`;
const ButtonAgryLanguage = styled.TouchableOpacity`
  width: 150px;
  height: 50px;
  margin: 0 auto;
  border-radius: 28px;
  margin-top: 50px;
`;
const ButtonLanguage = styled.TouchableOpacity`
  width: 150px;
  height: 50px;
  margin: 0 auto;
  border-radius: 28px;
  margin-top: 40%;
`;
const ButtonText = styled.Text`
  color: whitesmoke;
  font-size: 15px;
`;

export default function Language({ setLanguage }) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const images = {
    en: require("../assets/england.png"),
    ru: require("../assets/russia.png"),
    ua: require("../assets/ukraine.png"),
  };

  const changeLng = (lng) => {
    i18next.changeLanguage(lng);
    setVisible(false);
    setLanguage(true);
  };

  return (
    <LinearGradient
      colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={{ height: "100%", width: "100%", padding: 10 }}
    >
      <Image
        source={require("../assets/Dance.png")}
        style={{ width: "100%", height: "60%", borderRadius: 15, objectFit: "cover", marginTop: 50 }}
      ></Image>
      <ButtonAgryLanguage onPress={() => setVisible(true)}>
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
          <ButtonText>Change language</ButtonText>
        </LinearGradient>
      </ButtonAgryLanguage>
      <Modal visible={visible} onRequestClose={() => setVisible(false)}>
        <LinearGradient
          colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 1.0 }}
          style={{
            height: "100%",
            width: "100%",
            padding: 10,
            marginTop: 0,
            flexDirection: "column",
          }}
        >
          <FlatList
            data={Object.keys(LanguageResources)}
            renderItem={({ item }) => (
              <ButtonLanguage onPress={() => changeLng(item)}>
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
                  <View style={{ flexDirection: "row", justifyContent: "center", gap: 10, alignItems: "center" }}>
                    <View style={{ width: 30, height: 30, borderRadius: 5 }}>
                      <Image source={images[item]}></Image>
                    </View>
                    <ButtonText>{languageList[item].nativeName}</ButtonText>
                  </View>
                </LinearGradient>
              </ButtonLanguage>
            )}
          />
        </LinearGradient>
      </Modal>
    </LinearGradient>
  );
}
