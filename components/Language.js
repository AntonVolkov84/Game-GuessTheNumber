import { View, Modal, SafeAreaView, Text, Button, FlatList, TouchableOpacity } from "react-native";
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
const ButtonLanguage = styled.TouchableOpacity`
  width: 150px;
  height: 50px;
  margin: 0 auto;
  border-radius: 28px;
  margin-top: 15%;
`;
const ButtonText = styled.Text`
  color: whitesmoke;
`;

export default function Language({ setLanguage }) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

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
      style={{ height: "100%", width: "100%", padding: 10, marginTop: 40 }}
    >
      <ButtonAgry onPress={() => setVisible(true)}>
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
      </ButtonAgry>
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
                  <ButtonText>{languageList[item].nativeName}</ButtonText>
                </LinearGradient>
              </ButtonLanguage>
            )}
          />
        </LinearGradient>
      </Modal>
    </LinearGradient>
  );
}
