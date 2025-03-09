export const MAX_DIGITS = 16;
export const DECIMAL_PLACES = 8;
export const CURSOR_BLINK_RATE = 1000; // ms

export const ERROR_MESSAGES = {
    DIVISION_BY_ZERO: "Cannot divide by zero",
    INVALID_INPUT: "Invalid input",
    OVERFLOW: "Number too large",
    INVALID_OPERATION: "Invalid operation",
    MAX_DIGITS_EXCEEDED: `Maximum ${MAX_DIGITS} digits exceeded`,
    INVALID_DECIMAL: "Invalid decimal format"
} as const;

export const OPERATORS = {
    ADD: "+",
    SUBTRACT: "−",
    MULTIPLY: "×",
    DIVIDE: "÷"
} as const;

export const SPECIAL_FUNCTIONS = {
    SQUARE: "x²",
    SQUARE_ROOT: "√",
    CLEAR: "AC",
    DELETE: "DEL",
    EQUALS: "="
} as const;