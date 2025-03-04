export class UIManager {
    constructor(screen, calculator) {
        this.screen = screen;
        this.calculator = calculator;
    }
    initializeScreen() {
        if (!this.screen)
            return;
        this.screen.innerHTML = `
            <div class="expression-line">
                <div class="current-expression">0<span class="cursor"></span></div>
                <div class="preview"></div>
            </div>
        `;
    }
    updateScreen() {
        const currentExpression = this.screen.querySelector('.current-expression');
        const preview = this.screen.querySelector('.preview');
        if (!currentExpression || !preview)
            return;
        const state = this.calculator.getState();
        let displayText = state.buffer;
        if (state.previousOperator) {
            displayText = `${state.runningTotal} ${state.previousOperator} ${state.buffer}`;
        }
        const [before, after] = this.getExpressionParts(displayText);
        currentExpression.innerHTML = before + '<span class="cursor"></span>' + after;
        if (state.previousOperator && state.buffer !== "0") {
            const previewValue = this.calculator.calculatePreview();
            preview.textContent = previewValue !== '' ? `= ${previewValue}` : '';
        }
        else {
            preview.textContent = '';
        }
    }
    getExpressionParts(displayText) {
        const state = this.calculator.getState();
        let fullExpressionPosition = state.cursorPosition;
        if (state.previousOperator) {
            const operatorIndex = displayText.indexOf(state.previousOperator);
            if (operatorIndex !== -1) {
                if (state.cursorPosition > operatorIndex) {
                    fullExpressionPosition = operatorIndex + 2 + (state.cursorPosition - operatorIndex - 2);
                }
                else {
                    fullExpressionPosition = state.cursorPosition;
                }
            }
        }
        return [
            displayText.slice(0, fullExpressionPosition),
            displayText.slice(fullExpressionPosition)
        ];
    }
}
