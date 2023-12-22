import { subjects } from "../Types/components.types";

export const useText = () => {
  const getFirstLetterAndCapitalize = (text: string): string => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const truncateWord = (word: string, maxLength: number): string => {
    if (!word) return "";
    return word.length > maxLength ? word.slice(0, maxLength) + "..." : word;
  };

  const removeWhiteSpace = (text?: string) => {
    if (!text) return;
    return text.trim().toLocaleLowerCase();
  };

  const tagColor = (subject: subjects) => {
    const tagColor = {
      Chemistry: "destructive",
      Biology: "success",
      English: "warning",
      Physics: "default",
      Mathematics: "outline",
      Computer: "secondary",
      Science: "destructive",
      Agriculture: "friendly",
    };

    return tagColor[subject];
  };

  const getLetter = (number: number): string | undefined => {
    if (typeof number !== "number" || isNaN(number)) {
      return undefined;
    }

    const letters = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];

    if (number >= 0 && number < letters.length) {
      return letters[number];
    } else {
      return undefined;
    }
  };

  return {
    getFirstLetterAndCapitalize,
    truncateWord,
    tagColor,
    getLetter,
    removeWhiteSpace,
  };
};
