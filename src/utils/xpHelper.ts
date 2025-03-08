export const setXPForRecipeDifficulty = (difficulty:string): number => {
    switch (difficulty) {
        case "hard":
            return 30;
        case "intermediate":
            return 20;
        default:
            return 10; 
    }
}