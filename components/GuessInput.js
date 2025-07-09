import { useEffect, useState, useRef } from "react";
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Image, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

const screenHeight = Dimensions.get("window").height;
const isLowHeight = screenHeight < 750;

import {
  AdEventType,
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  RewardedAdEventType,
  RewardedInterstitialAd,
} from "react-native-google-mobile-ads";

const rewardedInterstitial = RewardedInterstitialAd.createForAdRequest("ca-app-pub-9267417700367649/8895308151", {
  requestNonPersonalizedAdsOnly: true,
});
const rewardedInterstitialFillCells = InterstitialAd.createForAdRequest("ca-app-pub-9267417700367649/1163380145", {
  requestNonPersonalizedAdsOnly: true,
});

const GuessInput = ({
  onScoreUpdate,
  playSound,
  clockStart,
  gameDeviders,
  level,
  hintCount,
  setHintCount,
  score,
  time,
  pointForNextlevel,
  soundRef,
  clockRef,
  setLoadedAdvertisement,
  loadedAdvertisement,
  setLoadedAdvertisementFillCells,
  loadedAdvertisementFillCells,
  setMistakes,
  mistakes,
}) => {
  const [numbers, setNumbers] = useState(Array.from({ length: 100 }, () => Math.floor(Math.random() * 100)));
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [highlightedHintIndex, setHighlightedHintIndex] = useState([]);
  const [hint, setHint] = useState("");
  const [modal, setModal] = useState(false);
  const levelDevider = gameDeviders[level - 1];
  const { t } = useTranslation();
  const videoADSref = useRef(null);
  videoADSref.current = loadedAdvertisement;

  const handlePress = (index) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter((i) => i !== index));
    } else {
      const newSelectedIndices = [...selectedIndices, index];
      setSelectedIndices(newSelectedIndices);
      if (newSelectedIndices.length === 2) {
        const [firstIndex, secondIndex] = newSelectedIndices.sort((a, b) => a - b);
        const firstRow = Math.floor(firstIndex / 10);
        const firstCol = firstIndex % 10;
        const secondRow = Math.floor(secondIndex / 10);
        const secondCol = secondIndex % 10;
        const isSameRow = firstRow === secondRow;
        const isSameCol = firstCol === secondCol;
        const isDiagonal = Math.abs(firstRow - secondRow) === Math.abs(firstCol - secondCol);
        if (isSameRow || isSameCol || isDiagonal) {
          let hasObstacle = !isPathClear(firstIndex, secondIndex);
          if (hasObstacle) {
            setHighlightedIndex(index);
            setTimeout(() => {
              setHighlightedIndex(null);
            }, 500);
            setMistakes(mistakes + 1);
            setSelectedIndices([]);
          } else {
            const sum = newSelectedIndices.reduce((acc, curr) => acc + (numbers[curr] || 0), 0);
            const resultOfMathPlayer = sum % levelDevider;
            if (resultOfMathPlayer !== 0) {
              setHighlightedIndex(index);
              setTimeout(() => {
                setHighlightedIndex(null);
              }, 500);
              setMistakes(mistakes + 1);
              setSelectedIndices([]);
            }
            if (resultOfMathPlayer === 0) {
              onScoreUpdate(sum);
              const updatedNumbers = [...numbers];
              newSelectedIndices.forEach((i) => (updatedNumbers[i] = null));
              setNumbers(updatedNumbers);
              setHighlightedHintIndex([]);
            }
            setSelectedIndices([]);
          }
        } else {
          setHighlightedIndex(index);
          setTimeout(() => {
            setHighlightedIndex(null);
          }, 500);
          setMistakes(mistakes + 1);
          setSelectedIndices([]);
        }
      }
    }
  };
  const showHint = () => {
    if (+hintCount <= 0) {
      setModal(true);
      return;
    }
    setHintCount(hintCount - 1);
    for (let i = 0; i < numbers.length; i++) {
      for (let j = i + 1; j < numbers.length; j++) {
        const hintResult = numbers[i] + numbers[j];
        if (numbers[i] !== null && numbers[j] !== null && hintResult % levelDevider === 0) {
          if (isPathClear(i, j)) {
            setHighlightedHintIndex([i, j]);
            return;
          }
        }
      }
    }
    setHint("Совпадений по числам нет, заполните пустые поля");
  };

  const isPathClear = (firstIndex, secondIndex) => {
    const firstRow = Math.floor(firstIndex / 10);
    const firstCol = firstIndex % 10;
    const secondRow = Math.floor(secondIndex / 10);
    const secondCol = secondIndex % 10;
    const isSameRow = firstRow === secondRow;
    const isSameCol = firstCol === secondCol;
    const isDiagonal = Math.abs(firstRow - secondRow) === Math.abs(firstCol - secondCol);
    if (isSameRow || isSameCol || isDiagonal) {
      let hasObstacle = false;
      if (isSameRow) {
        for (let col = Math.min(firstCol, secondCol) + 1; col < Math.max(firstCol, secondCol); col++) {
          if (numbers[firstRow * 10 + col] !== null) {
            hasObstacle = true;
            break;
          }
        }
      } else if (isSameCol) {
        for (let row = Math.min(firstRow, secondRow) + 1; row < Math.max(firstRow, secondRow); row++) {
          if (numbers[row * 10 + firstCol] !== null) {
            hasObstacle = true;
            break;
          }
        }
      } else if (isDiagonal) {
        const rowStep = firstRow < secondRow ? 1 : -1;
        const colStep = firstCol < secondCol ? 1 : -1;
        let row = firstRow + rowStep;
        let col = firstCol + colStep;

        while (row !== secondRow && col !== secondCol) {
          if (numbers[row * 10 + col] !== null) {
            hasObstacle = true;
            break;
          }
          row += rowStep;
          col += colStep;
        }
      }

      if (hasObstacle) {
        return false;
      } else {
        return true;
      }
    }
  };

  const fillEmptyCellsWithRandomNumbers = () => setNumbers(numbers.map((e) => (e !== null ? e : getRandomNumber())));

  const getRandomNumber = () => {
    return Math.floor(Math.random() * 100);
  };
  useEffect(() => {
    if (mistakes == 5) {
      fillEmptyCellsWithRandomNumbers();
    }
  }, [mistakes]);
  useEffect(() => {
    if (!clockRef.current) clockStart();
    if (!soundRef.current) playSound();
  }, []);

  useEffect(() => {
    const unsubscribeLoadedFillCells = rewardedInterstitialFillCells.addAdEventListener(AdEventType.LOADED, () => {
      console.log("Interstitial ad loaded");
      setLoadedAdvertisementFillCells(true);
    });
    const unsubscribeLoaded = rewardedInterstitial.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setLoadedAdvertisement(true);
    });

    const unsubscribeCloseFillCells = rewardedInterstitialFillCells.addAdEventListener(AdEventType.CLOSED, () => {
      setLoadedAdvertisementFillCells(false);
      rewardedInterstitialFillCells.load();
      fillEmptyCellsWithRandomNumbers();
    });
    const unsubscribeEarned = rewardedInterstitial.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
      setHintCount(reward.amount);
    });
    const unsubscribeClosed = rewardedInterstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setLoadedAdvertisement(false);
      rewardedInterstitial.load();
    });
    const unsubscribeError = rewardedInterstitialFillCells.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log("Ad load error:", error);
    });
    rewardedInterstitial.load();
    rewardedInterstitialFillCells.load();
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeLoadedFillCells();
      unsubscribeCloseFillCells();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[
          styles.cell,
          selectedIndices.includes(index) && styles.selectedCell,
          highlightedIndex === index && styles.highlightedCell,
          highlightedHintIndex.includes(index) && styles.highlightedHint,
        ]}
        onPress={() => handlePress(index)}
      >
        <Text style={styles.cellText}>{item !== null ? item : ""}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ height: "100%" }}>
      <View style={[styles.modalBlock, { display: modal ? "flex" : "none" }]}>
        <View style={styles.modalBlockInfo}>
          <Text style={styles.modalText}>{t("GuessModal info")}</Text>
          <Image
            source={require("../assets/mind.png")}
            style={{
              width: 150,
              height: 150,
              marginTop: 15,
              marginHorizontal: "30%",
              borderRadius: 10,
              marginBottom: 15,
            }}
          ></Image>
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModal(false);
              }}
            >
              <LinearGradient
                colors={["#849ae9", "#6ea0eb", "#2db3f1", "#2ab4f1"]}
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 1.0, y: 1.0 }}
                style={{
                  height: "100%",
                  width: "100%",
                  padding: 5,
                  overflow: "hidden",
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.modalButtonText}>{t("GuessModal buttoneject")}</Text>
              </LinearGradient>
            </TouchableOpacity>
            {loadedAdvertisement ? (
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  rewardedInterstitial.show();
                  setModal(false);
                }}
              >
                <LinearGradient
                  colors={["#849ae9", "#6ea0eb", "#2db3f1", "#2ab4f1"]}
                  start={{ x: 0.0, y: 0.0 }}
                  end={{ x: 1.0, y: 1.0 }}
                  style={{
                    height: "100%",
                    width: "100%",
                    padding: 5,
                    overflow: "hidden",
                    borderRadius: 15,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={styles.modalButtonText}>{t("GuessModal buttonagry")}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setModal(false);
                }}
              >
                <LinearGradient
                  colors={["#849ae9", "#6ea0eb", "#2db3f1", "#2ab4f1"]}
                  start={{ x: 0.0, y: 0.0 }}
                  end={{ x: 1.0, y: 1.0 }}
                  style={{
                    height: "100%",
                    width: "100%",
                    padding: 5,
                    overflow: "hidden",
                    borderRadius: 15,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={styles.modalButtonText}>{t("GuessModal buttonNoads")}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <Text Text style={styles.textLevel}>
        {t("Guess title")}:
      </Text>
      <Text style={styles.textExplaining}>
        {t("Guess info")} {levelDevider}
      </Text>
      {levelDevider === 2 ? <Text style={styles.textExplaining}>{t("Fireworks a")}</Text> : <></>}
      {levelDevider === 5 ? <Text style={styles.textExplaining}>{t("Fireworks b")}</Text> : <></>}
      {levelDevider === 10 ? <Text style={styles.textExplaining}>{t("Fireworks c")}</Text> : <></>}
      {levelDevider === 3 ? <Text style={styles.textExplaining}>{t("Fireworks d")}</Text> : <></>}
      {levelDevider === 9 ? <Text style={styles.textExplaining}>{t("Fireworks e")}</Text> : <></>}
      {levelDevider === 4 ? <Text style={styles.textExplaining}>{t("Fireworks f")}</Text> : <></>}
      {levelDevider === 6 ? <Text style={styles.textExplaining}>{t("Fireworks g")}</Text> : <></>}
      {levelDevider === 7 ? <Text style={styles.textExplaining}>{t("Fireworks h")}</Text> : <></>}
      <View style={styles.gridBox}>
        <FlatList
          data={numbers}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={10}
        />
      </View>
      <View style={styles.buttonAll}>
        <TouchableOpacity style={styles.buttonAgry} onPress={showHint}>
          <LinearGradient
            colors={["#849ae9", "#6ea0eb", "#2db3f1", "#2ab4f1"]}
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1.0, y: 1.0 }}
            style={{
              height: "100%",
              width: "100%",
              overflow: "hidden",
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {hintCount === 0 ? (
              <Text style={styles.buttonText}>{t("Guess hintbuttonOff")}</Text>
            ) : (
              <Text style={styles.buttonText}>
                {t("Guess hintbutton")} {hintCount}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonAgry}
          onPress={() => {
            loadedAdvertisementFillCells ? rewardedInterstitialFillCells.show() : fillEmptyCellsWithRandomNumbers();
          }}
        >
          <LinearGradient
            colors={["#849ae9", "#6ea0eb", "#2db3f1", "#2ab4f1"]}
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1.0, y: 1.0 }}
            style={{
              height: "100%",
              width: "100%",
              overflow: "hidden",
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.buttonText}>{t("Guess addbutton")}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      {hint ? <Text style={styles.hintText}>{hint}</Text> : null}
      <View style={styles.levelInfo}>
        <Text style={styles.textScore}>
          {t("Guess score")}: {score} / {pointForNextlevel}
        </Text>
        <Text style={styles.textTime}>
          {t("Guess time")}: {time}
        </Text>
        <Text style={styles.textTime}>
          {t("Mistakes")}: {mistakes}
        </Text>
      </View>
      <View style={styles.adContainer}>
        <BannerAd
          unitId="ca-app-pub-9267417700367649/7435599553"
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
            networkExtras: {
              collapsible: "bottom",
            },
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
  },
  selectedCell: {
    backgroundColor: "#add8e6",
  },
  cellText: {
    fontSize: 16,
    color: "whitesmoke",
  },
  highlightedCell: {
    backgroundColor: "red",
  },
  highlightedHint: {
    backgroundColor: "green",
  },
  hintButton: {
    backgroundColor: "#ffa500",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  hintButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  hintText: {
    marginTop: 10,
    fontSize: 22,
    color: "coral",
  },
  adContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#1E1E1E",
    alignItems: "center",
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  adLabel: {
    fontSize: 10,
    color: "#aaa",
    marginTop: 2,
  },
  modalBlock: {
    height: "100%",
    width: "100%",
    backgroundColor: "#1e2322",
    position: "fixed",
  },
  modalBlockInfo: {
    position: "absolute",
    width: "90%",
    height: "40%",
    borderRadius: 18,
    top: "25%",
    left: 15,
    backgroundColor: "#1f433a",
    paddingHorizontal: 5,
  },
  textLevel: {
    color: "coral",
    marginTop: "6%",
    alignSelf: "center",
    fontSize: 20,
    marginBottom: 10,
  },
  textExplaining: {
    color: "whitesmoke",
    alignSelf: "flex-start",
    marginBottom: isLowHeight ? 5 : 10,
    fontSize: isLowHeight ? 13 : 15,
    paddingLeft: "2%",
  },
  buttonAll: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  buttonAgry: {
    width: isLowHeight ? 120 : 150,
    height: isLowHeight ? 45 : 55,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 28,
  },
  buttonText: {
    color: "whitesmoke",
    textAlign: "center",
    fontSize: isLowHeight ? 12 : 14,
  },
  gridBox: {
    marginBottom: isLowHeight ? 8 : 10,
  },
  modalButton: {
    width: 150,
    height: 50,
    borderRadius: 10,
  },
  modalButtonText: {
    color: "whitesmoke",
    textAlign: "center",
  },
  levelInfo: {
    flexDirection: isLowHeight ? "row" : "column",
    gap: isLowHeight ? 15 : 0,
    justifyContent: "center",
    alignItems: "center",
  },
  textScore: {
    color: "coral",
    alignSelf: "center",
    fontSize: isLowHeight ? 18 : 22,
  },
  textTime: {
    color: "coral",
    alignSelf: "center",
    fontSize: isLowHeight ? 18 : 22,
  },
  modalText: {
    color: "coral",
    width: "100%",
    height: 70,
    marginTop: 15,
    marginRight: 15,
    fontSize: 18,
    textAlign: "center",
  },
});

export default GuessInput;
