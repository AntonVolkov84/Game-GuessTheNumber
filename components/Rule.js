import { View, Text, Image } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { LinearGradient } from "expo-linear-gradient";

const ButtonAgryLanguage = styled.TouchableOpacity`
  width: 150px;
  height: 60px;
  margin: 0 auto;
  border-radius: 28px;
`;
const ButtonText = styled.Text`
  color: whitesmoke;
  font-size: 15px;
  text-align: center;
`;
const RuleBlock = styled.View`
  flex-direction: row;
  height: 22%;
  gap: 10px;
  margin-top: 5%;
  justify-content: center;
  align-items: center;
`;
const RuleBlockInfo = styled.View`
  flex-direction: row;
  height: 12%;
  justify-content: center;
  align-items: center;
`;
const RuleBlockImage = styled.Image`
  width: 50%;
  height: 100%;
  border-radius: 18px;
`;
const RuleBlockText = styled.Text`
  display: block;
  width: 47%;
  height: content;
  border-radius: 18px;
  color: whitesmoke;
  padding: 5px;
  font-size: 22px;
  text-align: center;
`;
const RuleBlockTextInfo = styled.Text`
  display: block;
  width: 95%;
  height: content;
  border-radius: 18px;
  color: whitesmoke;
  padding: 10px;
  font-size: 22px;
  text-align: center;
`;

export default function Rule({ setRule }) {
  const { t } = useTranslation();
  return (
    <LinearGradient
      colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={{ height: "100%", width: "100%", padding: 10 }}
    >
      <RuleBlock>
        <RuleBlockImage source={require("../assets/Component 1.png")}></RuleBlockImage>
        <RuleBlockText>{t("Rule Component1")}</RuleBlockText>
      </RuleBlock>
      <RuleBlock>
        <RuleBlockText>{t("Rule Component2")}</RuleBlockText>
        <RuleBlockImage source={require("../assets/Component 2.png")}></RuleBlockImage>
      </RuleBlock>
      <RuleBlock>
        <RuleBlockImage source={require("../assets/Component 3.png")}></RuleBlockImage>
        <RuleBlockText>{t("Rule Component3")}</RuleBlockText>
      </RuleBlock>
      <RuleBlockInfo>
        <RuleBlockTextInfo>{t("Rule info")}</RuleBlockTextInfo>
      </RuleBlockInfo>
      <ButtonAgryLanguage>
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
          <ButtonText onPress={() => setRule(true)}>{t("Rule button")}</ButtonText>
        </LinearGradient>
      </ButtonAgryLanguage>
    </LinearGradient>
  );
}
