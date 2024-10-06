import React, { useEffect, useState, useRef } from "react";
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import styled from "styled-components";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

import {
  AdEventType,
  BannerAd,
  BannerAdSize,
  RewardedAd,
  RewardedAdEventType,
  RewardedInterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";

const TextLevel = styled.Text`
  color: coral;
  margin-top: 5%;
  align-self: center;
  font-size: 22px;
  margin-bottom: 15px;
`;
const TextExplaining = styled.Text`
  color: whitesmoke;
  align-self: flex-start;
  justify-content: center;
  margin-bottom: 15px;
  font-size: 15px;
  padding-left: 2%;
`;
const ButtonAll = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;
const ButtonAgry = styled.TouchableOpacity`
  width: 150px;
  height: 60px;
  margin: 0 auto;
  border-radius: 28px;
`;
const ButtonText = styled.Text`
  color: whitesmoke;
  text-align: center;
`;
const GridBox = styled.View`
  margin-bottom: 15px;
`;

const ModalBlock = styled.View`
  height: 100%;
  width: 100%;
  background-color: #1e2322;
  position: fixed;
`;
const ModalBlockInfo = styled.View`
  position: absolute;
  width: 90%;
  height: 40%;
  border-radius: 18px;
  top: 25%;
  left: 15px;
  background-color: #1f433a;
  padding: 0 5px 0 5px;
`;
const ModalButton = styled.TouchableOpacity`
  width: 150px;
  height: 50px;
  border-radius: 10px;
`;
const ModalButtonText = styled.Text`
  color: whitesmoke;
  text-align: center;
`;

const TextScore = styled.Text`
  color: coral;
  align-self: center;
  font-size: 22px;
  margin-top: 1%;
`;
const TextTime = styled.Text`
  color: coral;
  align-self: center;
  font-size: 22px;
  margin-top: 1%;
`;
const ModalText = styled.Text`
  color: coral;
  display: block;
  width: 100%;
  height: 70px;
  margin: 15px 15px 0 0;
  font-size: 18px;
  text-align: center;
`;

const rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(TestIds.REWARDED_INTERSTITIAL, {
  requestNonPersonalizedAdsOnly: true,
});
const rewardedInterstitialFillCells = RewardedInterstitialAd.createForAdRequest(TestIds.REWARDED_INTERSTITIAL, {
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
            setSelectedIndices([]);
          } else {
            const sum = newSelectedIndices.reduce((acc, curr) => acc + (numbers[curr] || 0), 0);
            const resultOfMathPlayer = sum % levelDevider;
            if (resultOfMathPlayer !== 0) {
              setHighlightedIndex(index);
              setTimeout(() => {
                setHighlightedIndex(null);
              }, 500);
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

  const fillEmptyCellsWithRandomNumbers = () => {
    const updatedNumbers = numbers.map((num) => (num === null ? getRandomNumber() : num));
    setNumbers(updatedNumbers);
  };

  const getRandomNumber = () => {
    return Math.floor(Math.random() * 100) + 1;
  };

  useEffect(() => {
    if (!clockRef.current) {
      clockStart();
    }
  }, []);

  useEffect(() => {
    if (!soundRef.current) {
      playSound();
    }
  }, []);
  useEffect(() => {
    const unsubscribeLoadedFillCells = rewardedInterstitialFillCells.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoadedAdvertisementFillCells(true);
      }
    );
    const unsubscribeLoaded = rewardedInterstitial.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setLoadedAdvertisement(true);
    });
    const unsubscribeEarnedFillCells = rewardedInterstitialFillCells.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        fillEmptyCellsWithRandomNumbers();
      }
    );
    const unsubscribeCloseFillCells = rewardedInterstitialFillCells.addAdEventListener(AdEventType.CLOSED, () => {
      setLoadedAdvertisementFillCells(false);
      rewardedInterstitialFillCells.load();
    });
    const unsubscribeEarned = rewardedInterstitial.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
      setHintCount(reward.amount);
    });
    const unsubscribeClosed = rewardedInterstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setLoadedAdvertisement(false);
      rewardedInterstitial.load();
    });
    rewardedInterstitial.load();
    rewardedInterstitialFillCells.load();
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeEarnedFillCells();
      unsubscribeLoadedFillCells();
      unsubscribeCloseFillCells();
      unsubscribeClosed();
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
      <ModalBlock style={{ display: modal ? "contents" : "none" }}>
        <ModalBlockInfo>
          <ModalText>{t("GuessModal info")}</ModalText>
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
            <ModalButton
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
                <ModalButtonText>{t("GuessModal buttoneject")}</ModalButtonText>
              </LinearGradient>
            </ModalButton>
            {videoADSref.current ? (
              <ModalButton
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
                  <ModalButtonText>{t("GuessModal buttonagry")}</ModalButtonText>
                </LinearGradient>
              </ModalButton>
            ) : (
              <ModalButton
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
                  <ModalButtonText>{t("GuessModal buttonNoads")}</ModalButtonText>
                </LinearGradient>
              </ModalButton>
            )}
          </View>
        </ModalBlockInfo>
      </ModalBlock>
      <TextLevel>{t("Guess title")}:</TextLevel>
      <TextExplaining>
        {t("Guess info")} {levelDevider}
      </TextExplaining>
      {levelDevider === 2 ? <TextExplaining>{t("Fireworks a")}</TextExplaining> : <></>}
      {levelDevider === 5 ? <TextExplaining>{t("Fireworks b")}</TextExplaining> : <></>}
      {levelDevider === 10 ? <TextExplaining>{t("Fireworks c")}</TextExplaining> : <></>}
      {levelDevider === 3 ? <TextExplaining>{t("Fireworks d")}</TextExplaining> : <></>}
      {levelDevider === 9 ? <TextExplaining>{t("Fireworks e")}</TextExplaining> : <></>}
      {levelDevider === 4 ? <TextExplaining>{t("Fireworks f")}</TextExplaining> : <></>}
      {levelDevider === 6 ? <TextExplaining>{t("Fireworks g")}</TextExplaining> : <></>}
      {levelDevider === 7 ? <TextExplaining>{t("Fireworks h")}</TextExplaining> : <></>}
      <GridBox>
        <FlatList
          data={numbers}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={10}
        />
      </GridBox>
      <ButtonAll>
        <ButtonAgry onPress={showHint}>
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
            {hintCount === 0 ? (
              <ButtonText>{t("Guess hintbuttonOff")}</ButtonText>
            ) : (
              <ButtonText>
                {t("Guess hintbutton")} {hintCount}
              </ButtonText>
            )}
          </LinearGradient>
        </ButtonAgry>
        <ButtonAgry
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
              padding: 10,
              overflow: "hidden",
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ButtonText>{t("Guess addbutton")}</ButtonText>
          </LinearGradient>
        </ButtonAgry>
      </ButtonAll>
      {hint ? <Text style={styles.hintText}>{hint}</Text> : null}
      <TextScore>
        {t("Guess score")}: {score} / {pointForNextlevel}
      </TextScore>
      <TextTime>
        {t("Guess time")}: {time}
      </TextTime>
      <View style={{ position: "absolute", bottom: 0 }}>
        <BannerAd
          unitId={TestIds.BANNER}
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
    backgroundColor: "red", // Цвет границы для ячейки с препятствием
  },
  highlightedHint: {
    backgroundColor: "green", // Цвет границы для ячейки с препятствием
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
});

export default GuessInput;
