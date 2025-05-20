import { View, Text, Dimensions } from "react-native";
import styled from "styled-components";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import LottieView from "lottie-react-native";

const screenHeight = Dimensions.get("window").height;
const isLowHeight = screenHeight < 700;

const EndlevelBlockText = styled.Text`
  width: 100%;
  height: 8%;
  font-size: ${isLowHeight ? "18px" : "22px"};
  margin-top: ${isLowHeight ? "10px" : "10%"};
  color: whitesmoke;
  text-align: center;
`;
const ButtonAgry = styled.TouchableOpacity`
  width: 200px;
  height: ${isLowHeight ? "40px" : "50px"};
  margin: 0 auto;
  border-radius: 28px;
`;
const ButtonText = styled.Text`
  color: whitesmoke;
`;

export default function Endlevel({ goToBegining, time }) {
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
      <EndlevelBlockText style={{ marginTop: 30 }}>{t("Endlevel greeting")}</EndlevelBlockText>
      <LottieView
        autoPlay
        style={{
          width: "100%",
          aspectRatio: 1 / 1,
          backgroundColor: "#1E2322",
          overflow: "hidden",
          marginBottom: isLowHeight ? 5 : 20,
        }}
        source={require("../Animation.json")}
      />
      <EndlevelBlockText>
        {t("Endlevel info")} {getFullTime()}
      </EndlevelBlockText>
      <ButtonAgry
        onPress={() => {
          goToBegining();
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
          <ButtonText>{t("Endlevel button")}</ButtonText>
        </LinearGradient>
      </ButtonAgry>
    </LinearGradient>
  );
}
