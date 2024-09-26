import React, { useState, useeffect } from "react";
import { View, FlatList, TouchableOpacity, Text, Alert, StyleSheet, Image } from "react-native";
import styled from "styled-components";
import { LinearGradient } from "expo-linear-gradient";

const TextLevel = styled.Text`
  color: coral;
  align-self: center;
  font-size: 22px;
  margin-bottom: 15px;
`;
const TextExplaining = styled.Text`
  color: whitesmoke;
  align-self: center;
  justify-content: center;
  margin-bottom: 15px;
  font-size: 15px;
`;
const ButtonAll = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;
const ButtonAgry = styled.TouchableOpacity`
  width: 150px;
  height: 50px;
  margin: 0 auto;
  border-radius: 28px;
`;
const ButtonText = styled.Text`
  color: whitesmoke;
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
`;
const ModalButton = styled.TouchableOpacity`
  width: 150px;
  height: 50px;
  border-radius: 10px;
`;
const ModalButtonText = styled.Text`
  color: whitesmoke;
`;

const TextScore = styled.Text`
  color: coral;
  align-self: center;
  font-size: 22px;
  margin-top: 15px;
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

const GuessInput = ({ onScoreUpdate, gameDeviders, level, hintCount, setHintCount, score, pointForNextlevel }) => {
  const [numbers, setNumbers] = useState(Array.from({ length: 100 }, () => Math.floor(Math.random() * 100)));
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [highlightedHintIndex, setHighlightedHintIndex] = useState([]);
  const [hint, setHint] = useState(""); // Состояние для подсказки
  const [modal, setModal] = useState(false);
  const levelIndex = Math.floor(level / 3);
  const levelDevider = gameDeviders[levelIndex];
  const ind = (level + 2) % 3;

  const handlePress = (index) => {
    if (selectedIndices.includes(index)) {
      // Удаляем индекс, если он уже выбран
      setSelectedIndices(selectedIndices.filter((i) => i !== index));
    } else {
      // Добавляем индекс в выбранные
      const newSelectedIndices = [...selectedIndices, index];
      setSelectedIndices(newSelectedIndices);

      // Проверяем, если выбрано 2 ячейки
      if (newSelectedIndices.length === 2) {
        const [firstIndex, secondIndex] = newSelectedIndices.sort((a, b) => a - b);

        // Получаем координаты ячеек
        const firstRow = Math.floor(firstIndex / 10);
        const firstCol = firstIndex % 10;
        const secondRow = Math.floor(secondIndex / 10);
        const secondCol = secondIndex % 10;

        // Проверяем, если ячейки находятся в одной вертикали, горизонтали или диагонали
        const isSameRow = firstRow === secondRow;
        const isSameCol = firstCol === secondCol;
        const isDiagonal = Math.abs(firstRow - secondRow) === Math.abs(firstCol - secondCol);

        if (isSameRow || isSameCol || isDiagonal) {
          // Проверяем наличие препятствий между выбранными ячейками
          let hasObstacle = false;
          if (isSameRow) {
            // Проверяем по горизонтали
            for (let col = Math.min(firstCol, secondCol) + 1; col < Math.max(firstCol, secondCol); col++) {
              if (numbers[firstRow * 10 + col] !== null) {
                hasObstacle = true;
                break;
              }
            }
          } else if (isSameCol) {
            // Проверяем по вертикали
            for (let row = Math.min(firstRow, secondRow) + 1; row < Math.max(firstRow, secondRow); row++) {
              if (numbers[row * 10 + firstCol] !== null) {
                hasObstacle = true;
                break;
              }
            }
          } else if (isDiagonal) {
            // Проверяем по диагонали
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
            setHighlightedIndex(index);
            setTimeout(() => {
              setHighlightedIndex(null);
            }, 500);
            // Если есть препятствие, сбрасываем выбранные ячейки
            setSelectedIndices([]);
          } else {
            const sum = newSelectedIndices.reduce((acc, curr) => acc + (numbers[curr] || 0), 0);
            const resultOfMathPlayer = sum % levelDevider;
            if (resultOfMathPlayer !== 0) {
              setHighlightedIndex(index);
              setTimeout(() => {
                setHighlightedIndex(null);
              }, 500);
              // Если ячейки не в одной линии, сбрасываем выбор
              setSelectedIndices([]);
            }
            if (resultOfMathPlayer === 0) {
              onScoreUpdate(sum); // Обновляем очки
              // Заменяем значения на пустые
              const updatedNumbers = [...numbers];
              newSelectedIndices.forEach((i) => (updatedNumbers[i] = null));
              setNumbers(updatedNumbers);
              setHighlightedHintIndex([]);
            }
            // Сбрасываем выбранные ячейки
            setSelectedIndices([]);
          }
        } else {
          setHighlightedIndex(index);
          setTimeout(() => {
            setHighlightedIndex(null);
          }, 500);
          // Если ячейки не в одной линии, сбрасываем выбор
          setSelectedIndices([]);
        }
      }
    }
  };
  const showHint = () => {
    if (+hintCount <= 0) {
      // return Alert.alert("Подсказки закончились", "Упс", [
      //   {
      //     text: "Cancel",
      //     onPress: () => console.log("Cancel Pressed"),
      //     style: "cancel",
      //   },
      //   { text: "Просмотреть рекламу", onPress: () => console.log(setHintCount(hintCount + 10)) },
      // ]);
      setModal(true);
      return;
    }
    setHintCount(hintCount - 1);
    for (let i = 0; i < numbers.length; i++) {
      for (let j = i + 1; j < numbers.length; j++) {
        // Проверяем, что сумма значений делится на 10
        const hintResult = numbers[i] + numbers[j];
        if (numbers[i] !== null && numbers[j] !== null && hintResult % levelDevider === 0) {
          // Проверяем, есть ли препятствия между ячейками
          if (isPathClear(i, j)) {
            // Устанавливаем индексы ячеек для подсветки
            setHighlightedHintIndex([i, j]);
            return; // Выходим из функции после нахождения первой пары
          }
        }
      }
    }
    // Если подходящих ячеек не найдено
    setHint("Совпадений по числам нет, заполните пустые поля"); // Сообщение, если подсказок больше нет
  };

  const isPathClear = (firstIndex, secondIndex) => {
    const firstRow = Math.floor(firstIndex / 10);
    const firstCol = firstIndex % 10;
    const secondRow = Math.floor(secondIndex / 10);
    const secondCol = secondIndex % 10;

    // Проверяем, если ячейки находятся в одной вертикали, горизонтали или диагонали
    const isSameRow = firstRow === secondRow;
    const isSameCol = firstCol === secondCol;
    const isDiagonal = Math.abs(firstRow - secondRow) === Math.abs(firstCol - secondCol);

    if (isSameRow || isSameCol || isDiagonal) {
      // Проверяем наличие препятствий между выбранными ячейками
      let hasObstacle = false;
      if (isSameRow) {
        // Проверяем по горизонтали
        for (let col = Math.min(firstCol, secondCol) + 1; col < Math.max(firstCol, secondCol); col++) {
          if (numbers[firstRow * 10 + col] !== null) {
            hasObstacle = true;
            break;
          }
        }
      } else if (isSameCol) {
        // Проверяем по вертикали
        for (let row = Math.min(firstRow, secondRow) + 1; row < Math.max(firstRow, secondRow); row++) {
          if (numbers[row * 10 + firstCol] !== null) {
            hasObstacle = true;
            break;
          }
        }
      } else if (isDiagonal) {
        // Проверяем по диагонали
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
    // Генерируем случайное число от 1 до 100
    return Math.floor(Math.random() * 100) + 1;
  };

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
          <ModalText>У вас не осталось подсказок. Вы можете просмотреть рекламу и получить еще 10 шт</ModalText>
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
                <ModalButtonText>Отмена</ModalButtonText>
              </LinearGradient>
            </ModalButton>
            <ModalButton
              onPress={() => {
                setModal(false);
                console.log("Просмотр и добавление подсказок");
                setHintCount(hintCount + 10);
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
                <ModalButtonText>Посмотреть рекламу</ModalButtonText>
              </LinearGradient>
            </ModalButton>
          </View>
        </ModalBlockInfo>
      </ModalBlock>
      <TextLevel>Условие:</TextLevel>
      <TextExplaining>
        Сумма чисел по вертикали, горизонтали или диагонали должна делиться на {levelDevider}
      </TextExplaining>
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
            <ButtonText>Подсказка {hintCount}</ButtonText>
          </LinearGradient>
        </ButtonAgry>
        <ButtonAgry onPress={fillEmptyCellsWithRandomNumbers}>
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
            <ButtonText>Заполнить поля</ButtonText>
          </LinearGradient>
        </ButtonAgry>
      </ButtonAll>
      {hint ? <Text style={styles.hintText}>{hint}</Text> : null}
      <TextScore>
        Очки: {score} / {pointForNextlevel[ind]}
      </TextScore>
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
