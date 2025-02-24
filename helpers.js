export const capitalizeCategory = (word) => {
    const words = word.split(' ');
    return words
        .map((word, index) => {
            // Capitalize the first letter of the first and second word, if it exists
            if (index === 0 || index === 1) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }
            return word; // Return the rest of the words as is
        })
        .join(' ');
};
