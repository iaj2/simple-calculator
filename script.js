class Calculator{
    constructor(currentOperand, previousOperand){
        this.currentOperand = currentOperand;
        this.previousOperand = previousOperand;
        this.currentOperandInnerText;
        this.previoustOperandInnerText;
        this.operation;
        this.operationComplete = false;
        this.maxLenDec = 13;
        this.maxLenDig = 14;
        this.clearAll();
    }

    #formatDisplayNumber(strNum){
        let displayNumStr;
        let integerDigits;
        if(strNum.includes('.')){
            const splitNums = strNum.split('.');
            integerDigits = parseFloat(splitNums[0]);
            let decimalDigits = splitNums[1];
            displayNumStr = `${integerDigits.toLocaleString('en')}.${decimalDigits}`;
        }
        else{
            integerDigits = parseFloat(strNum);
            if(isNaN(integerDigits)) return '';
            displayNumStr = `${integerDigits.toLocaleString('en', {maximumFractionDigits: 0})}`
        }
        return displayNumStr;
    }

    #updateDisplay(){
        let formatted_curr_operand = this.#formatDisplayNumber(this.currentOperandInnerText);
        let formatted_prev_operand = this.#formatDisplayNumber(this.previousOperandInnerText);
        this.currentOperand.innerText = formatted_curr_operand;
        this.previousOperand.innerText = `${formatted_prev_operand}${this.operation}`
    }

    clearAll(){
        this.currentOperandInnerText = '0';
        this.previousOperandInnerText = '';
        this.operation = '';
        this.#updateDisplay();
    }

    delete(){
        this.currentOperandInnerText = this.currentOperandInnerText.slice(0, -1);
        this.#updateDisplay()
    }

    appendNumber(number){
        // If an operation just happened -> clear and reset
        if(this.operationComplete && this.previousOperandInnerText === ''){
            this.clearAll();
            this.operationComplete = false;
        }
        if(this.currentOperandInnerText.length === 1 && this.currentOperandInnerText === '0'){
            if(number !== '.' && number != '0') this.currentOperandInnerText = '';
            if(number === '0') return;
        }
        if( number === '.' && this.currentOperandInnerText.includes('.')) return;
        this.currentOperandInnerText = `${this.currentOperandInnerText}${number}`;
        this.#updateDisplay();
    }

    chooseOperation(operator){
        if(this.currentOperandInnerText === '') return;
        if(this.previousOperandInnerText !== '') this.compute()
        this.operation = operator;
        this.previousOperandInnerText = this.currentOperandInnerText;
        this.currentOperandInnerText = '0';
        this.#updateDisplay()
    }

    compute(){
        let computation;
        let current_num = parseFloat(this.currentOperandInnerText);
        let prev_num = parseFloat(this.previousOperandInnerText);
        if(!isNaN(prev_num) && isNaN(current_num)) current_num = 0;
        else if(isNaN(prev_num) && isNaN(current_num)) return;
        
        switch(this.operation){
            case '+':
                computation = prev_num + current_num;
                break;
            case '÷':
                computation = prev_num/current_num;
                break;
            case '-':
                computation = prev_num - current_num;
                break;
            case 'x':
                computation = prev_num*current_num;
                break;
            default:
                break;
        }
        this.currentOperandInnerText = computation.toString();
        this.previousOperandInnerText = '';
        this.operation = '';
        if(!this.operationComplete)this.operationComplete = true;
        this.#updateDisplay();
    }

    convertPercentage(){
        if(this.currentOperandInnerText == '')return;
        let current_num_percent = parseFloat(this.currentOperandInnerText)/100;
        this.currentOperandInnerText = current_num_percent.toString()
        this.#updateDisplay();

    }
}

// Init new calculator
const currentOperand = document.querySelector('[data-current-operand]');
const previousOperand = document.querySelector('[data-previous-operand]');

const calculator = new Calculator(currentOperand,previousOperand);

// Clear all
const clearAllButton = document.querySelector('[data-clear-all]');
clearAllButton.addEventListener('click', () => calculator.clearAll());

// Delete one
const deleteButton = document.querySelector('[data-delete]');
deleteButton.addEventListener('click', () => calculator.delete());

// Append numbers
const numButtons = document.querySelectorAll('[data-number]');
numButtons.forEach((button)=>{
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
    });
});

// Choose operation
const operatorButtons = document.querySelectorAll('[data-operator]');
operatorButtons.forEach((button)=>{
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText)
    });
})

// Compute operation
const equalsButton = document.querySelector('[data-equals]');
equalsButton.addEventListener('click', ()=> calculator.compute());

// Convert to percentage
const percentageButton = document.querySelector('[data-percentage]');
percentageButton.addEventListener('click', ()=> calculator.convertPercentage());

