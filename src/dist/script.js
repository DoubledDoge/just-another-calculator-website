import { Calculator } from './classes/CalculatorState.js';
import { UIManager } from './classes/UIManager.js';
const screen = document.querySelector(".screen");
const calculator = new Calculator();
const uiManager = new UIManager(screen, calculator);
function init() {
    uiManager.initializeScreen();
    const calcButtons = document.querySelector('.calc-buttons');
    if (!calcButtons)
        return;
    calcButtons.addEventListener('click', function (event) {
        const target = event.target;
        if (!target.matches('button'))
            return;
        if (target.hasAttribute('data-number')) {
            buttonClick(target.textContent || '');
        }
        else if (target.hasAttribute('data-action')) {
            const action = target.getAttribute('data-action');
            switch (action) {
                case 'clear':
                    buttonClick('AC');
                    break;
                case 'delete':
                    buttonClick('DEL');
                    break;
                case 'multiply':
                    buttonClick('×');
                    break;
                case 'divide':
                    buttonClick('÷');
                    break;
                case 'add':
                    buttonClick('+');
                    break;
                case 'subtract':
                    buttonClick('−');
                    break;
                case 'decimal':
                    buttonClick(',');
                    break;
                case 'equals':
                    buttonClick('=');
                    break;
                case 'sqrt':
                    buttonClick('√');
                    break;
                case 'square':
                    buttonClick('x²');
                    break;
                case 'left':
                    buttonClick('←');
                    break;
                case 'right':
                    buttonClick('→');
                    break;
            }
        }
    });
}
function buttonClick(value) {
    const state = calculator.getState();
    if (isNaN(Number(value)) && value !== ',') {
        handleSymbol(value);
    }
    else {
        handleNumber(value);
    }
    uiManager.updateScreen();
}
function handleNumber(value) {
    const state = calculator.getState();
    if (value === ',' && state.buffer.includes(',')) {
        return;
    }
    if (state.previousOperator) {
        const operatorIndex = (state.runningTotal + " " + state.previousOperator + " " + state.buffer).indexOf(state.previousOperator);
        if (state.cursorPosition > operatorIndex + 2) {
            const insertPosition = state.cursorPosition - (operatorIndex + 2);
            if (state.buffer === "0" && value !== ',') {
                calculator.updateBuffer(value);
            }
            else {
                calculator.updateBuffer(state.buffer.slice(0, insertPosition) + value + state.buffer.slice(insertPosition));
            }
            calculator.updateCursor(state.cursorPosition + 1);
        }
        else {
            if (state.runningTotal === 0 && value !== ',') {
                calculator.updateRunningTotal(parseFloat(value));
            }
            else {
                const rtString = state.runningTotal.toString();
                calculator.updateRunningTotal(parseFloat(rtString.slice(0, state.cursorPosition) + value + rtString.slice(state.cursorPosition)));
            }
            calculator.updateCursor(state.cursorPosition + 1);
        }
    }
    else {
        if (state.buffer === "0" && value !== ',') {
            calculator.updateBuffer(value);
            calculator.updateCursor(1);
        }
        else {
            calculator.updateBuffer(state.buffer.slice(0, state.cursorPosition) + value + state.buffer.slice(state.cursorPosition));
            calculator.updateCursor(state.cursorPosition + 1);
        }
    }
}
function handleSymbol(symbol) {
    const state = calculator.getState();
    switch (symbol) {
        case 'AC':
            calculator.updateBuffer("0");
            calculator.updateRunningTotal(0);
            calculator.updateOperator(null);
            calculator.updateCursor(1);
            break;
        case '=':
            if (state.previousOperator === null)
                return;
            flushOperation(parseFloat(state.buffer));
            calculator.updateOperator(null);
            calculator.updateBuffer(state.runningTotal.toString());
            calculator.updateRunningTotal(0);
            calculator.updateExpression("");
            calculator.updateCursor(1);
            break;
        case '÷':
        case '×':
        case '+':
        case '−':
            if (state.previousOperator) {
                const fullExpression = `${state.runningTotal} ${state.previousOperator} ${state.buffer}`;
                const operatorIndex = fullExpression.indexOf(state.previousOperator);
                if (state.cursorPosition === operatorIndex + 1) {
                    calculator.updateOperator(symbol);
                    return;
                }
            }
            handleMath(symbol);
            break;
        case '√':
            calculator.updateBuffer(Math.sqrt(parseFloat(state.buffer)).toString());
            break;
        case 'x²':
            calculator.updateBuffer(Math.pow(parseFloat(state.buffer), 2).toString());
            break;
        case 'DEL':
            if (state.previousOperator) {
                const fullExpression = `${state.runningTotal} ${state.previousOperator} ${state.buffer}`;
                const operatorIndex = fullExpression.indexOf(state.previousOperator);
                if (state.cursorPosition === operatorIndex + 1) {
                    calculator.updateOperator(null);
                    calculator.updateBuffer("0");
                    calculator.updateCursor(state.runningTotal.toString().length);
                }
                else if (state.cursorPosition > operatorIndex + 2) {
                    const bufferPos = state.cursorPosition - (operatorIndex + 2);
                    const newBuffer = state.buffer.slice(0, bufferPos - 1) + state.buffer.slice(bufferPos);
                    calculator.updateBuffer(newBuffer.length === 0 ? "0" : newBuffer);
                    calculator.updateCursor(state.cursorPosition - 1);
                }
                else {
                    const rtString = state.runningTotal.toString();
                    const newTotal = parseFloat(rtString.slice(0, state.cursorPosition - 1) + rtString.slice(state.cursorPosition));
                    calculator.updateRunningTotal(isNaN(newTotal) ? 0 : newTotal);
                    calculator.updateCursor(state.cursorPosition - 1);
                }
            }
            else {
                if (state.buffer.length === 1) {
                    calculator.updateBuffer("0");
                    calculator.updateCursor(1);
                }
                else {
                    calculator.updateBuffer(state.buffer.slice(0, state.cursorPosition - 1) + state.buffer.slice(state.cursorPosition));
                    calculator.updateCursor(state.cursorPosition - 1);
                }
            }
            break;
        case '←':
            if (state.previousOperator) {
                const operatorIndex = (state.runningTotal + " " + state.previousOperator + " " + state.buffer).indexOf(state.previousOperator);
                if (state.cursorPosition > operatorIndex + 2) {
                    calculator.updateCursor(state.cursorPosition - 1);
                }
                else if (state.cursorPosition > 0) {
                    calculator.updateCursor(state.cursorPosition - 1);
                }
            }
            else if (state.cursorPosition > 0) {
                calculator.updateCursor(state.cursorPosition - 1);
            }
            break;
        case '→':
            const fullExpression = state.previousOperator ?
                (state.runningTotal + " " + state.previousOperator + " " + state.buffer) : state.buffer;
            if (state.cursorPosition < fullExpression.length) {
                calculator.updateCursor(state.cursorPosition + 1);
            }
            break;
    }
}
function handleMath(symbol) {
    const state = calculator.getState();
    if (state.buffer === "0")
        return;
    if (state.previousOperator) {
        const fullExpression = `${state.runningTotal} ${state.previousOperator} ${state.buffer}`;
        const operatorIndex = fullExpression.indexOf(state.previousOperator);
        if (state.cursorPosition === operatorIndex + 1) {
            calculator.updateOperator(symbol);
            return;
        }
    }
    const floatBuffer = parseFloat(state.buffer.replace(',', '.'));
    if (state.runningTotal === 0) {
        calculator.updateRunningTotal(floatBuffer);
    }
    else {
        flushOperation(floatBuffer);
    }
    calculator.updateOperator(symbol);
    calculator.updateBuffer("0");
    calculator.updateCursor((state.runningTotal.toString() + " " + symbol + " ").length + 1);
}
function flushOperation(floatBuffer) {
    const state = calculator.getState();
    let result = state.runningTotal;
    switch (state.previousOperator) {
        case '+':
            result += floatBuffer;
            break;
        case '−':
            result -= floatBuffer;
            break;
        case '×':
            result *= floatBuffer;
            break;
        case '÷':
            result /= floatBuffer;
            break;
    }
    calculator.updateRunningTotal(result);
}
init();
