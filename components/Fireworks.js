import { Text, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

const screenHeight = Dimensions.get("window").height;
const isLowHeight = screenHeight < 700;

export default function Fireworks({ level, setRelevel, gameDeviders }) {
  const levelDevider = gameDeviders[level - 1];
  const { t } = useTranslation();

  return (
    <LinearGradient
      colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={styles.container}
    >
      <Text style={styles.textLevel}>
        {t("Fireworks title")} {level}
      </Text>

      <Text style={styles.textExplaining}>
        {t("Fireworks rule")} <Text style={styles.inlineRed}>{levelDevider}</Text>
      </Text>

      {levelDevider === 2 && <Text style={styles.textExplaining}>{t("Fireworks a")}</Text>}
      {levelDevider === 5 && <Text style={styles.textExplaining}>{t("Fireworks b")}</Text>}
      {levelDevider === 10 && <Text style={styles.textExplaining}>{t("Fireworks c")}</Text>}
      {levelDevider === 3 && <Text style={styles.textExplaining}>{t("Fireworks d")}</Text>}
      {levelDevider === 9 && <Text style={styles.textExplaining}>{t("Fireworks e")}</Text>}
      {levelDevider === 4 && <Text style={styles.textExplaining}>{t("Fireworks f")}</Text>}
      {levelDevider === 6 && <Text style={styles.textExplaining}>{t("Fireworks g")}</Text>}
      {levelDevider === 7 && <Text style={styles.textExplaining}>{t("Fireworks h")}</Text>}

      <LottieView autoPlay style={styles.lottie} source={require("../Animation.json")} />

      <TouchableOpacity style={styles.buttonAgry} onPress={() => setRelevel(false)}>
        <LinearGradient
          colors={["#849ae9", "#6ea0eb", "#2db3f1", "#2ab4f1"]}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 1.0 }}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>{t("Fireworks button")}</Text>
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
    paddingTop: "5%",
  },
  textLevel: {
    marginTop: "5%",
    color: "coral",
    alignSelf: "center",
    fontSize: isLowHeight ? 18 : 22,
    marginBottom: isLowHeight ? 10 : 15,
  },
  textExplaining: {
    color: "whitesmoke",
    alignSelf: "flex-start",
    marginBottom: isLowHeight ? 10 : 15,
    fontSize: isLowHeight ? 15 : 18,
  },
  inlineRed: {
    color: "red",
  },
  lottie: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#1E2322",
    overflow: "hidden",
    marginBottom: 20,
  },
  buttonAgry: {
    width: 200,
    height: 50,
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
