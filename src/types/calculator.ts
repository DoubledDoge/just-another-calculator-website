import { OPERATORS, SPECIAL_FUNCTIONS } from '../constants/CalculatorConstants';

export type Operator = typeof OPERATORS[keyof typeof OPERATORS] | null;
export type SpecialFunction = typeof SPECIAL_FUNCTIONS[keyof typeof SPECIAL_FUNCTIONS];
export type SymbolType = Operator | SpecialFunction | "←" | "→";

export interface CalculatorState {
    runningTotal: number;
    buffer: string;
    previousOperator: Operator;
    expression: string;
    cursorPosition: number;
    error?: string | null;
}

export interface CalculatorResult {
    value: number | string;
    error?: string | null;
}
