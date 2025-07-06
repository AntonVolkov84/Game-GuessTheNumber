import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import LottieView from "lottie-react-native";

const screenHeight = Dimensions.get("window").height;
const isLowHeight = screenHeight < 700;

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
      style={styles.container}
    >
      <Text style={[styles.endlevelBlockText, { marginTop: 30 }]}>{t("Endlevel greeting")}</Text>

      <LottieView autoPlay style={styles.lottie} source={require("../Animation.json")} />

      <Text style={styles.endlevelBlockText}>
        {t("Endlevel info")} {getFullTime()}
      </Text>

      <TouchableOpacity style={styles.buttonAgry} onPress={goToBegining}>
        <LinearGradient
          colors={["#849ae9", "#6ea0eb", "#2db3f1", "#2ab4f1"]}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 1.0 }}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>{t("Endlevel button")}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    padding: 10,
  },
  endlevelBlockText: {
    width: "100%",
    height: "8%",
    fontSize: isLowHeight ? 18 : 22,
    marginTop: isLowHeight ? 10 : "10%",
    color: "whitesmoke",
    textAlign: "center",
  },
  lottie: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#1E2322",
    overflow: "hidden",
    marginBottom: isLowHeight ? 5 : 20,
  },
  buttonAgry: {
    width: 200,
    height: isLowHeight ? 40 : 50,
    alignSelf: "center",
    borderRadius: 28,
  },
  buttonGradient: {
    height: "100%",
    width: "100%",
    padding: 10,
    overflow: "hidden",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "whitesmoke",
  },
});
