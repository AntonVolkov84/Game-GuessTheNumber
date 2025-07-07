import React, { useState } from "react";
import { View, FlatList, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import i18next from "../i18next.js";
import { AdsConsent } from "react-native-google-mobile-ads";

import { LanguageResources } from "../i18next.js";
import languageList from "../i18n/languageList.json";

export default function Language({ setLanguage, savePlayerLanguage }) {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  const images = {
    en: require("../assets/england.png"),
    ua: require("../assets/ukraine.png"),
  };

  const changeLng = (lng) => {
    savePlayerLanguage("lng", `${lng}`);
    i18next.changeLanguage(lng);
    setVisible(false);
    setLanguage(true);
  };

  const showConsentFormForce = async () => {
    try {
      await AdsConsent.reset();
      await AdsConsent.requestInfoUpdate();
      const consentStatus = await AdsConsent.getStatus();
      console.log(consentStatus);
      await AdsConsent.showPrivacyOptionsForm();
      const newConsentStatus = await AdsConsent.getStatus();
      console.log("Consent status after showing form:", newConsentStatus);
    } catch (error) {
      console.warn("Error forcing privacy options form show:", error);
    }
  };

  const renderLanguageItem = ({ item }) => (
    <View style={styles.languageItem}>
      <TouchableOpacity onPress={() => changeLng(item)} style={styles.flagWrapper}>
        <Image source={images[item]} style={styles.flagImage} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => changeLng(item)} style={styles.buttonLanguage}>
        <LinearGradient
          colors={["#849ae9", "#6ea0eb", "#2db3f1", "#2ab4f1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.linearGradient}
        >
          <View style={styles.buttonContent}>
            <View style={styles.smallFlagWrapper}>
              <Image source={images[item]} style={styles.smallFlagImage} />
            </View>
            <Text style={styles.buttonText}>{languageList[item].nativeName}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  if (visible) {
    return (
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientContainer}
        >
          <FlatList
            data={Object.keys(LanguageResources)}
            renderItem={renderLanguageItem}
            keyExtractor={(item) => item}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
          <TouchableOpacity style={styles.requestAdsButton} onPress={showConsentFormForce}>
            <Text style={[styles.buttonText, { textAlign: "center" }]}>{t("requestads")}</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      <Image source={require("../assets/Dance.png")} style={styles.danceImage} />
      <TouchableOpacity style={styles.buttonAgryLanguage} onPress={() => setVisible(true)}>
        <LinearGradient
          colors={["#849ae9", "#6ea0eb", "#2db3f1", "#2ab4f1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.linearGradient}
        >
          <Text style={styles.buttonText}>Change language</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    padding: 10,
    paddingTop: "5%",
  },

  languageItem: {
    marginTop: "10%",
    alignItems: "center",
  },

  flagWrapper: {
    width: "27%",
    aspectRatio: 1,
    justifyContent: "center",
    alignSelf: "center",
  },
  flagImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  buttonLanguage: {
    width: 150,
    height: 50,
    marginTop: "5%",
    borderRadius: 28,
    overflow: "hidden",
  },

  linearGradient: {
    flex: 1,
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },

  smallFlagWrapper: {
    width: "25%",
    height: 30,
    borderRadius: 5,
    overflow: "hidden",
  },
  smallFlagImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  buttonText: {
    color: "whitesmoke",
    fontSize: 15,
  },

  requestAdsButton: {
    marginBottom: 60,
  },

  danceImage: {
    width: "100%",
    height: "60%",
    borderRadius: 15,
    marginTop: 50,
    resizeMode: "cover",
  },

  buttonAgryLanguage: {
    width: 150,
    height: 50,
    marginTop: 50,
    borderRadius: 28,
    overflow: "hidden",
    alignSelf: "center",
  },
});
