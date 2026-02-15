const previousOperandElement = document.querySelector('#previous-operand');
const currentOperandElement = document.querySelector('#current-operand');
const historyListElement = document.querySelector('#history-list');

const numberButtons = document.querySelectorAll('[data-key]:not(.btn-op):not(.btn-equals):not(.btn-alt)');
const operationButtons = document.querySelectorAll('.btn-op:not([data-key="%"])');
const percentButton = document.querySelector('[data-key="%"]');
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
        this.tokens = [];
        this.shouldResetScreen = false;
    }

    delete() {
        if (this.currentOperand === 'Error' || this.shouldResetScreen) {
            this.clear();
            return;
        }
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === 'Error') return;
        
        if (this.currentOperand === '' && this.tokens.length > 0) {
            this.tokens[this.tokens.length - 1] = operation;
            return;
        }

        if (this.currentOperand !== '') {
            this.tokens.push(this.currentOperand);
            this.tokens.push(operation);
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
    }

    applyPercentage() {
        if (this.currentOperand === 'Error' || this.currentOperand === '' || this.currentOperand === '0') return;
        
        const current = parseFloat(this.currentOperand);
        let base = 1;

        if (this.tokens.length >= 2) {
            const lastOp = this.tokens[this.tokens.length - 1];
            const lastNum = parseFloat(this.tokens[this.tokens.length - 2]);
            if ((lastOp === '+' || lastOp === '-') && !isNaN(lastNum)) {
                base = lastNum;
            }
        }
        
        if (!isNaN(current)) {
            if (base !== 1) {
                this.currentOperand = (base * (current / 100)).toString();
            } else {
                this.currentOperand = (current / 100).toString();
            }
        }
    }

    compute() {
        if (this.currentOperand === 'Error') return;
        if (this.currentOperand !== '') {
            this.tokens.push(this.currentOperand);
        }

        if (this.tokens.length === 0) return;
        if (['+', '-', '*', '/'].includes(this.tokens[this.tokens.length - 1])) {
            this.tokens.pop();
        }

        const expression = this.tokens.join(' ');
        const result = this.evaluatePEMDAS([...this.tokens]);

        if (result === 'Error') {
            this.currentOperand = 'Error';
            this.tokens = [];
        } else {
            const precisionResult = parseFloat(result.toPrecision(12));
            this.currentOperand = precisionResult.toString();
            this.addToHistory(expression, this.currentOperand);
            this.tokens = [];
        }
        
        this.shouldResetScreen = true;
    }

    evaluatePEMDAS(tokens) {
        let i = 1;
        while (i < tokens.length) {
            const op = tokens[i];
            if (op === '*' || op === '/') {
                const prev = parseFloat(tokens[i - 1]);
                const next = parseFloat(tokens[i + 1]);
                if (op === '/' && next === 0) return 'Error';
                
                const res = op === '*' ? prev * next : prev / next;
                tokens.splice(i - 1, 3, res.toString());
            } else {
                i += 2;
            }
        }

        let result = parseFloat(tokens[0]);
        for (let j = 1; j < tokens.length; j += 2) {
            const op = tokens[j];
            const next = parseFloat(tokens[j + 1]);
            if (op === '+') result += next;
            if (op === '-') result -= next;
        }

        return result;
    }

    addToHistory(expression, result) {
        const displayExpr = expression.replace(/\*/g, '×').replace(/\//g, '÷');
        const historyItem = document.createElement('li');
        historyItem.innerText = `${displayExpr} = ${result}`;
        this.historyListElement.prepend(historyItem);
    }

    updateDisplay() {
        if (this.currentOperand === 'Error') {
            this.currentOperandElement.innerText = 'Cannot divide by zero';
            this.currentOperandElement.style.fontSize = '1.5rem';
            this.currentOperandElement.style.color = 'var(--alt-color)';
        } else {
            this.currentOperandElement.innerText = this.currentOperand;
            this.currentOperandElement.style.fontSize = '2.8rem';
            this.currentOperandElement.style.color = 'var(--accent-color)';
        }

        const displayTokens = this.tokens.map(token => {
            if (token === '*') return '×';
            if (token === '/') return '÷';
            return token;
        });
        this.previousOperandElement.innerText = displayTokens.join(' ');
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

percentButton.addEventListener('click', () => {
    calculator.applyPercentage();
    calculator.updateDisplay();
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