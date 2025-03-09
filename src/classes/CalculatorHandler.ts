import { Calculator } from './CalculatorState';
import { UIManager } from './UIManager';
import type { Operator, SymbolType } from '../types/Calculator';

export class CalculatorHandler {
    private calculator: Calculator;
    private uiManager: UIManager;

    constructor(calculator: Calculator, uiManager: UIManager) {
        this.calculator = calculator;
        this.uiManager = uiManager;
    }

    public handleButtonClick(value: string): void {
        if (isNaN(Number(value)) && value !== ",") {
            this.handleSymbol(value as SymbolType);
        } else {
            this.handleNumber(value);
        }
        this.uiManager.updateScreen();
    }

    private handleNumber(value: string): void {
        const state = this.calculator.getState();

        if (value === "," && state.buffer.includes(",")) {
            return;
        }

        if (state.previousOperator) {
            const operatorIndex = (
                state.runningTotal +
                " " +
                state.previousOperator +
                " " +
                state.buffer
            ).indexOf(state.previousOperator);
            if (state.cursorPosition > operatorIndex + 2) {
                const insertPosition = state.cursorPosition - (operatorIndex + 2);
                if (state.buffer === "0" && value !== ",") {
                    this.calculator.updateBuffer(value);
                } else {
                    this.calculator.updateBuffer(
                        state.buffer.slice(0, insertPosition) +
                        value +
                        state.buffer.slice(insertPosition)
                    );
                }
                this.calculator.updateCursor(state.cursorPosition + 1);
            } else {
                if (state.runningTotal === 0 && value !== ",") {
                    this.calculator.updateRunningTotal(parseFloat(value));
                } else {
                    const rtString = state.runningTotal.toString();
                    this.calculator.updateRunningTotal(
                        parseFloat(
                            rtString.slice(0, state.cursorPosition) +
                            value +
                            rtString.slice(state.cursorPosition)
                        )
                    );
                }
                this.calculator.updateCursor(state.cursorPosition + 1);
            }
        } else {
            if (state.buffer === "0" && value !== ",") {
                this.calculator.updateBuffer(value);
                this.calculator.updateCursor(1);
            } else {
                this.calculator.updateBuffer(
                    state.buffer.slice(0, state.cursorPosition) +
                    value +
                    state.buffer.slice(state.cursorPosition)
                );
                this.calculator.updateCursor(state.cursorPosition + 1);
            }
        }
    }

    private handleSymbol(symbol: SymbolType): void {
        const state = this.calculator.getState();

        switch (symbol) {
            case "AC":
        this.calculator.updateBuffer("0");
        this.calculator.updateRunningTotal(0);
        this.calculator.updateOperator(null);
        this.calculator.updateCursor(1);
        break;

      case "=":
        if (state.previousOperator === null) return;
        this.flushOperation(parseFloat(state.buffer));
        this.calculator.updateOperator(null);
        this.calculator.updateBuffer(state.runningTotal.toString());
        this.calculator.updateRunningTotal(0);
        this.calculator.updateExpression("");
        this.calculator.updateCursor(1);
        break;

      case "÷":
      case "×":
      case "+":
      case "−":
        if (state.previousOperator) {
          const fullExpression = `${state.runningTotal} ${state.previousOperator} ${state.buffer}`;
          const operatorIndex = fullExpression.indexOf(state.previousOperator);

          if (state.cursorPosition === operatorIndex + 1) {
            this.calculator.updateOperator(symbol);
            return;
          }
        }
        this.handleMath(symbol);
        break;

      case "√":
        this.calculator.updateBuffer(Math.sqrt(parseFloat(state.buffer)).toString());
        break;

      case "x²":
        this.calculator.updateBuffer(
          Math.pow(parseFloat(state.buffer), 2).toString(),
        );
        break;

      case "DEL":
        if (state.previousOperator) {
          const fullExpression = `${state.runningTotal} ${state.previousOperator} ${state.buffer}`;
          const operatorIndex = fullExpression.indexOf(state.previousOperator);

          if (state.cursorPosition === operatorIndex + 1) {
            this.calculator.updateOperator(null);
            this.calculator.updateBuffer("0");
            this.calculator.updateCursor(state.runningTotal.toString().length);
          } else if (state.cursorPosition > operatorIndex + 2) {
            const bufferPos = state.cursorPosition - (operatorIndex + 2);
            const newBuffer =
              state.buffer.slice(0, bufferPos - 1) +
              state.buffer.slice(bufferPos);
            this.calculator.updateBuffer(newBuffer.length === 0 ? "0" : newBuffer);
            this.calculator.updateCursor(state.cursorPosition - 1);
          } else {
            const rtString = state.runningTotal.toString();
            const newTotal = parseFloat(
              rtString.slice(0, state.cursorPosition - 1) +
                rtString.slice(state.cursorPosition),
            );
            this.calculator.updateRunningTotal(isNaN(newTotal) ? 0 : newTotal);
            this.calculator.updateCursor(state.cursorPosition - 1);
          }
        } else {
          if (state.buffer.length === 1) {
            this.calculator.updateBuffer("0");
            this.calculator.updateCursor(1);
          } else {
            this.calculator.updateBuffer(
              state.buffer.slice(0, state.cursorPosition - 1) +
                state.buffer.slice(state.cursorPosition),
            );
            this.calculator.updateCursor(state.cursorPosition - 1);
          }
        }
        break;

      case "←":
        if (state.previousOperator) {
          const operatorIndex = (
            state.runningTotal +
            " " +
            state.previousOperator +
            " " +
            state.buffer
          ).indexOf(state.previousOperator);
          if (state.cursorPosition > operatorIndex + 2) {
            this.calculator.updateCursor(state.cursorPosition - 1);
          } else if (state.cursorPosition > 0) {
            this.calculator.updateCursor(state.cursorPosition - 1);
          }
        } else if (state.cursorPosition > 0) {
          this.calculator.updateCursor(state.cursorPosition - 1);
        }
        break;

      case "→":
        const fullExpression = state.previousOperator
          ? state.runningTotal +
            " " +
            state.previousOperator +
            " " +
            state.buffer
          : state.buffer;
        if (state.cursorPosition < fullExpression.length) {
          this.calculator.updateCursor(state.cursorPosition + 1);
        }
        break;
        }
    }

    private handleMath(symbol: Operator): void {
        const state = this.calculator.getState();
        if (state.buffer === "0") return;

        if (state.previousOperator) {
            const fullExpression = `${state.runningTotal} ${state.previousOperator} ${state.buffer}`;
            const operatorIndex = fullExpression.indexOf(state.previousOperator);

            if (state.cursorPosition === operatorIndex + 1) {
                this.calculator.updateOperator(symbol);
                return;
            }
        }

        const floatBuffer = parseFloat(state.buffer.replace(",", "."));

        if (state.runningTotal === 0) {
            this.calculator.updateRunningTotal(floatBuffer);
        } else {
            this.flushOperation(floatBuffer);
        }

        this.calculator.updateOperator(symbol);
        this.calculator.updateBuffer("0");
        this.calculator.updateCursor(
            (state.runningTotal.toString() + " " + symbol + " ").length + 1
        );
    }

    private flushOperation(floatBuffer: number): void {
        const state = this.calculator.getState();
        let result = state.runningTotal;

        switch (state.previousOperator) {
            case "+":
                result += floatBuffer;
                break;
            case "−":
                result -= floatBuffer;
                break;
            case "×":
                result *= floatBuffer;
                break;
            case "÷":
                result /= floatBuffer;
                break;
        }

        this.calculator.updateRunningTotal(result);
    }
}