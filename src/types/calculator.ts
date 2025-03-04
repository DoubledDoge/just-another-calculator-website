export type Operator = '+' | '−' | '×' | '÷' | null;

export interface CalculatorState {
    runningTotal: number;
    buffer: string;
    previousOperator: Operator;
    expression: string;
    cursorPosition: number;
}
