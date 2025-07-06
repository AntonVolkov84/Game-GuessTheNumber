import React from "react";
import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";

const screenHeight = Dimensions.get("window").height;
const isLowHeight = screenHeight < 700;

export default function Rule({ setRule }) {
  const { t } = useTranslation();

  return (
    <LinearGradient
      colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={styles.gradient}
    >
      <View style={styles.ruleBlock}>
        <Image source={require("../assets/Component 1.png")} style={styles.ruleBlockImage} />
        <Text style={styles.ruleBlockText}>{t("Rule Component1")}</Text>
      </View>

      <View style={styles.ruleBlock}>
        <Text style={styles.ruleBlockText}>{t("Rule Component2")}</Text>
        <Image source={require("../assets/Component 2.png")} style={styles.ruleBlockImage} />
      </View>

      <View style={styles.ruleBlock}>
        <Image source={require("../assets/Component 3.png")} style={styles.ruleBlockImage} />
        <Text style={styles.ruleBlockText}>{t("Rule Component3")}</Text>
      </View>

      <View style={styles.ruleBlockInfo}>
        <Text style={styles.ruleBlockTextInfo}>{t("Rule info")}</Text>
      </View>

      <TouchableOpacity style={styles.buttonAgryLanguage} onPress={() => setRule(true)}>
        <LinearGradient
          colors={["#849ae9", "#6ea0eb", "#2db3f1", "#2ab4f1"]}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 1.0 }}
          style={styles.linearGradientButton}
        >
          <Text style={styles.buttonText}>{t("Rule button")}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    height: "100%",
    width: "100%",
    padding: 10,
    paddingTop: "7%",
  },
  ruleBlock: {
    flexDirection: "row",
    height: isLowHeight ? "20%" : "22%",
    gap: 10,
    marginTop: "5%",
    justifyContent: "center",
    alignItems: "center",
  },
  ruleBlockInfo: {
    flexDirection: "row",
    height: "10%",
    marginTop: "2%",
    justifyContent: "center",
    alignItems: "center",
  },
  ruleBlockImage: {
    width: isLowHeight ? "35%" : "40%",
    height: "100%",
    aspectRatio: 1,
    borderRadius: 18,
  },
  ruleBlockText: {
    width: "47%",
    borderRadius: 18,
    color: "whitesmoke",
    padding: 3,
    fontSize: isLowHeight ? 16 : 18,
    textAlign: "center",
  },
  ruleBlockTextInfo: {
    width: "95%",
    borderRadius: 18,
    color: "whitesmoke",
    padding: 10,
    fontSize: 16,
    textAlign: "center",
  },
  buttonAgryLanguage: {
    width: 150,
    height: 60,
    marginTop: "2%",
    marginHorizontal: "auto",
    borderRadius: 28,
    overflow: "hidden",
    alignSelf: "center",
  },
  linearGradientButton: {
    flex: 1,
    padding: 10,
    borderRadius: 30,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "whitesmoke",
    fontSize: 15,
    textAlign: "center",
  },
});
