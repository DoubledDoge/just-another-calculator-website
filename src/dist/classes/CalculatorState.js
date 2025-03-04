export class Calculator {
    constructor() {
        this.state = {
            runningTotal: 0,
            buffer: "0",
            previousOperator: null,
            expression: "",
            cursorPosition: 1
        };
    }
    getState() {
        return Object.assign({}, this.state);
    }
    calculatePreview() {
        if (!this.state.previousOperator)
            return '';
        const current = parseFloat(this.state.buffer.replace(',', '.'));
        const prev = this.state.runningTotal;
        switch (this.state.previousOperator) {
            case '+': return prev + current;
            case '−': return prev - current;
            case '×': return prev * current;
            case '÷': return current !== 0 ? prev / current : 'Error';
            default: return '';
        }
    }
    updateBuffer(value) {
        this.state.buffer = value;
    }
    updateOperator(operator) {
        this.state.previousOperator = operator;
    }
    updateCursor(position) {
        this.state.cursorPosition = position;
    }
    updateRunningTotal(value) {
        this.state.runningTotal = value;
    }
    updateExpression(value) {
        this.state.expression = value;
    }
}
