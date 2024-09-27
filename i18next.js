import { useEffect, useState, useeffect } from "react";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import ru from "./i18n/ru-RU.json";
import ua from "./i18n/ua-UA.json";
import en from "./i18n/en-US.json";

export const LanguageResources = {
  en: { translation: en },
  ru: { translation: ru },
  ua: { translation: ua },
};

i18next.use(initReactI18next).init({
  compatibilityJSON: "v3",
  lng: "en",
  fallbackLng: "en",
  resources: LanguageResources,
});

export default i18next;
