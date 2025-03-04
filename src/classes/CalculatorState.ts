import { Operator, CalculatorState } from '../types/calculator';

export class Calculator {
    private state: CalculatorState;

    constructor() {
        this.state = {
            runningTotal: 0,
            buffer: "0",
            previousOperator: null,
            expression: "",
            cursorPosition: 1
        };
    }

    public getState(): CalculatorState {
        return { ...this.state };
    }

    public calculatePreview(): number | string {
        if (!this.state.previousOperator) return '';
        const current: number = parseFloat(this.state.buffer.replace(',', '.'));
        const prev: number = this.state.runningTotal;

        switch (this.state.previousOperator) {
            case '+': return prev + current;
            case '−': return prev - current;
            case '×': return prev * current;
            case '÷': return current !== 0 ? prev / current : 'Error';
            default: return '';
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
