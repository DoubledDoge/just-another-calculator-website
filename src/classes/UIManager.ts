import { Calculator } from './CalculatorState';

export class UIManager {
    private screen: HTMLElement;
    private calculator: Calculator;

    constructor(screen: HTMLElement, calculator: Calculator) {
        this.screen = screen;
        this.calculator = calculator;
    }

    public initializeScreen(): void {
        if (!this.screen) return;
        this.screen.innerHTML = `
            <div class="expression-line">
                <div class="current-expression">0<span class="cursor"></span></div>
                <div class="preview"></div>
            </div>
        `;
    }

    public updateScreen(): void {
        const currentExpression = this.screen.querySelector('.current-expression') as HTMLElement;
        const preview = this.screen.querySelector('.preview') as HTMLElement;
        if (!currentExpression || !preview) return;

        const state = this.calculator.getState();
        let displayText: string = state.buffer;

        if (state.previousOperator) {
            displayText = `${state.runningTotal} ${state.previousOperator} ${state.buffer}`;
        }

        const [before, after] = this.getExpressionParts(displayText);
        currentExpression.innerHTML = before + '<span class="cursor"></span>' + after;

        if (state.previousOperator && state.buffer !== "0") {
            const previewValue = this.calculator.calculatePreview();
            preview.textContent = previewValue !== '' ? `= ${previewValue}` : '';
        } else {
            preview.textContent = '';
        }
    }

    private getExpressionParts(displayText: string): [string, string] {
        const state = this.calculator.getState();
        let fullExpressionPosition: number = state.cursorPosition;

        if (state.previousOperator) {
            const operatorIndex: number = displayText.indexOf(state.previousOperator);
            if (operatorIndex !== -1) {
                if (state.cursorPosition > operatorIndex) {
                    fullExpressionPosition = operatorIndex + 2 + (state.cursorPosition - operatorIndex - 2);
                } else {
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
