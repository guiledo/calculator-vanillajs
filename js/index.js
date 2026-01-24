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

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        const expression = `${this.previousOperand} ${this.operation} ${this.currentOperand}`;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }
        this.currentOperand = computation;
        this.addToHistory(expression, computation);
        this.operation = undefined;
        this.previousOperand = '';
    }

    addToHistory(expression, result) {
        const historyItem = document.createElement('li');
        historyItem.innerText = `${expression} = ${result}`;
        this.historyListElement.prepend(historyItem);
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.currentOperand;
        if (this.operation != null) {
            this.previousOperandElement.innerText = `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

const calculator = new Calculator(
    previousOperandElement, 
    currentOperandElement, 
    historyListElement
);

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.dataset.key);
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.dataset.key);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

allClearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

document.addEventListener('keydown', (e) => {
    let key = e.key;
    const allowedKeys = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 
        '+', '-', '*', '/', 'Enter', '=', 'Backspace', 'Escape', '%'
    ];

    if (!allowedKeys.includes(key)) return;

    if (key === '=') key = 'Enter';

    const button = document.querySelector(`button[data-key="${key}"]`);
    
    if (button) {
        e.preventDefault();
        button.click();
        button.classList.add('active-key');
        setTimeout(() => button.classList.remove('active-key'), 100);
    }
});
