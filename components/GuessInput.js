import React, { useState } from "react";
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from "react-native";

const GuessInput = ({ onScoreUpdate }) => {
  const [numbers, setNumbers] = useState(Array.from({ length: 100 }, () => Math.floor(Math.random() * 100)));
  const [selectedIndices, setSelectedIndices] = useState([]);

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
            // Если есть препятствие, сбрасываем выбранные ячейки
            setSelectedIndices([]);
          } else {
            const sum = newSelectedIndices.reduce((acc, curr) => acc + (numbers[curr] || 0), 0);
            if (sum % 10 === 0) {
              onScoreUpdate(sum); // Обновляем очки
              // Заменяем значения на пустые
              const updatedNumbers = [...numbers];
              newSelectedIndices.forEach((i) => (updatedNumbers[i] = null));
              setNumbers(updatedNumbers);
            }
            // Сбрасываем выбранные ячейки
            setSelectedIndices([]);
          }
        } else {
          // Если ячейки не в одной линии, сбрасываем выбор
          setSelectedIndices([]);
        }
      }
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[styles.cell, selectedIndices.includes(index) && styles.selectedCell]}
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
});

export default GuessInput;
