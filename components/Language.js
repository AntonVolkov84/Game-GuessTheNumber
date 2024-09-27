import { View, Modal, SafeAreaView, Text, Button, FlatList, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageResources } from "../i18next.js";
import i18next from "../i18next.js";
import languageList from "../i18n/languageList.json";

export default function Language({ setLanguage }) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const changeLng = (lng) => {
    i18next.changeLanguage(lng);
    setVisible(false);
    setLanguage(true);
  };

  return (
    <SafeAreaView style={{ marginTop: 50 }}>
      <Button title={t("Change language")} onPress={() => setVisible(true)} />
      <Modal visible={visible} onRequestClose={() => setVisible(false)}>
        <FlatList
          data={Object.keys(LanguageResources)}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => changeLng(item)}>
              <Text>{languageList[item].nativeName}</Text>
            </TouchableOpacity>
          )}
        />
      </Modal>
    </SafeAreaView>
  );
}
