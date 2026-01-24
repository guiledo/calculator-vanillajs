const previousOperandElement = document.querySelector('#previous-operand');
const currentOperandElement = document.querySelector('#current-operand');
const historyListElement = document.querySelector('#history-list');

const numberButtons = document.querySelectorAll('[data-key]:not(.btn-op):not(.btn-equals):not(.btn-alt)');
const operationButtons = document.querySelectorAll('.btn-op');
const equalsButton = document.querySelector('.btn-equals');
const deleteButton = document.querySelector('[data-key="Backspace"]');
const allClearButton = document.querySelector('[data-key="Escape"]');

class Calculator {
    constructor(previousOperandElement, currentOperandElement, historyListElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.historyListElement = historyListElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.currentOperand;
        this.previousOperandElement.innerText = this.previousOperand;
    }
}

const calculator = new Calculator(
    previousOperandElement, 
    currentOperandElement, 
    historyListElement
);
