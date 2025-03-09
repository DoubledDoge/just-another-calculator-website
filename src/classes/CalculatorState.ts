import type { Operator, CalculatorState } from '../types/Calculator';
import { MAX_DIGITS, DECIMAL_PLACES, ERROR_MESSAGES } from '../constants/CalculatorConstants';

export class Calculator {
    private state: CalculatorState;
    private error: string | null;

    constructor() {
        this.state = {
            runningTotal: 0,
            buffer: "0",
            previousOperator: null,
            expression: "",
            cursorPosition: 1
        };
        this.error = null;
    }

    public getState(): CalculatorState {
        return { ...this.state };
    }

    public calculatePreview(): string {
        if (this.error) return this.error;
        if (!this.state.previousOperator) return '';

        const current = parseFloat(this.state.buffer.replace(',', '.'));
        const prev = this.state.runningTotal;

        try {
            let result: number;
            switch (this.state.previousOperator) {
                case '+': result = prev + current; break;
                case '−': result = prev - current; break;
                case '×': result = prev * current; break;
                case '÷':
                    if (current === 0) throw new Error(ERROR_MESSAGES.DIVISION_BY_ZERO);
                    result = prev / current;
                    break;
                default: return '';
            }

            if (!Number.isFinite(result) || result.toString().length > MAX_DIGITS) {
                throw new Error(ERROR_MESSAGES.OVERFLOW);
            }

            return result.toFixed(DECIMAL_PLACES).replace(/\.?0+$/, '');
        } catch (err) {
            this.error = err instanceof Error ? err.message : ERROR_MESSAGES.INVALID_INPUT;
            return this.error;
        }
    }

    public updateBuffer(value: string): void {
        this.state.buffer = value;
    }

    public updateOperator(operator: Operator): void {
        this.state.previousOperator = operator;
    }

    public updateCursor(position: number): void {
        this.state.cursorPosition = position;
    }

    public updateRunningTotal(value: number): void {
        this.state.runningTotal = value;
    }

    public updateExpression(value: string): void {
        this.state.expression = value;
    }
}
