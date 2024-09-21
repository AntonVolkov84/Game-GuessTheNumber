import React, { useState } from "react";
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from "react-native";

const GuessInput = ({ onScoreUpdate }) => {
  const [numbers, setNumbers] = useState(Array.from({ length: 100 }, () => Math.floor(Math.random() * 100)));
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [highlightedHintIndex, setHighlightedHintIndex] = useState([]);
  const [hint, setHint] = useState(""); // Состояние для подсказки

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
            if (sum % 10 !== 0) {
              setHighlightedIndex(index);
              setTimeout(() => {
                setHighlightedIndex(null);
              }, 500);
              // Если ячейки не в одной линии, сбрасываем выбор
              setSelectedIndices([]);
            }
            if (sum % 10 === 0) {
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
    for (let i = 0; i < numbers.length; i++) {
      for (let j = i + 1; j < numbers.length; j++) {
        // Проверяем, что сумма значений делится на 10
        if (numbers[i] !== null && numbers[j] !== null && (numbers[i] + numbers[j]) % 10 === 0) {
          // Проверяем, есть ли препятствия между ячейками
          if (isPathClear(i, j)) {
            // Устанавливаем индексы ячеек для подсветки
            setHighlightedHintIndex([i, j]);
            console.log(highlightedHintIndex); // Подсвечиваем первую ячейку
            // Подсвечиваем вторую ячейку
            return; // Выходим из функции после нахождения первой пары
          }
        }
      }
    }
    // Если подходящих ячеек не найдено
    setHint("Подсказок больше нет!"); // Сообщение, если подсказок больше нет
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
    <View>
      <FlatList
        data={numbers}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={10}
      />
      <TouchableOpacity style={styles.hintButton} onPress={showHint}>
        <Text style={styles.hintButtonText}>Подсказка</Text>
      </TouchableOpacity>
      {hint ? <Text style={styles.hintText}>{hint}</Text> : null}
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
  },
  highlightedCell: {
    borderColor: "red", // Цвет границы для ячейки с препятствием
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
    fontSize: 16,
    color: "gray",
  },
});

export default GuessInput;
