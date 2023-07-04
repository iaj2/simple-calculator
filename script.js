class Calculator{
    constructor(currentOperand, previousOperand){
        this.currentOperand = currentOperand; // current operand html element
        this.previousOperand = previousOperand; // previous operand html element
        this.currentOperandInnerText; // hold the current operand content as string or float
        this.previoustOperandInnerText; // hold the prev operand content as string or float
        this.operation; // hold operation as string
        this.operationComplete = false; // operation state
        this.clearAll();
    }

    #formatDisplayNumber(strNum){
        let displayNumStr; // Final display number string
        let integerDigits;
        // Split into digits and decimal number strings if there contains a '.'
        if(strNum.includes('.')){
            const splitNums = strNum.split('.');
            // Convert integer digits to float and reconvert to localeString
            integerDigits = parseFloat(splitNums[0]);
            let decimalDigits = splitNums[1];
            // Format decimal number string
            displayNumStr = `${integerDigits.toLocaleString('en')}.${decimalDigits}`;
        }
        else{
            // Convert integer digits to float and reconvert to localeString
            integerDigits = parseFloat(strNum);
            if(isNaN(integerDigits)) return ''; // Return empty string when previousOperand is NaN
            displayNumStr = `${integerDigits.toLocaleString('en', {maximumFractionDigits: 0})}`
        }
        return displayNumStr;
    }

    #updateDisplay(){
        // Format current and previous operand
        let formatted_curr_operand = this.#formatDisplayNumber(this.currentOperandInnerText);
        let formatted_prev_operand = this.#formatDisplayNumber(this.previousOperandInnerText);
        // Set the current and previous operand html inner text
        this.currentOperand.innerText = formatted_curr_operand;
        this.previousOperand.innerText = `${formatted_prev_operand}${this.operation}`
    }

    clearAll(){
        // Set current operant to 0 and the rest to nothing
        this.currentOperandInnerText = '0';
        this.previousOperandInnerText = '';
        this.operation = '';
        this.#updateDisplay();
    }

    delete(){
        // If delete last digit set to zero
        if(this.currentOperandInnerText.length === 1)
        {
            this.currentOperandInnerText = '0';
            return;
        } 
        this.currentOperandInnerText = this.currentOperandInnerText.slice(0, -1);
        this.#updateDisplay()
    }

    appendNumber(number){
        // If an operation just happened -> clear and reset
        if(this.operationComplete && this.previousOperandInnerText === ''){
            this.clearAll();
            this.operationComplete = false;
        }
        // Stop from adding more 0's if there is already one (and only) zero
        if(this.currentOperandInnerText.length === 1 && this.currentOperandInnerText === '0'){
            if(number === '0') return;
        }
        // Stop from adding more . if there already is one
        if( number === '.' && this.currentOperandInnerText.includes('.')) return;
        // Apend the number to current operand string
        this.currentOperandInnerText = `${this.currentOperandInnerText}${number}`;
        this.#updateDisplay();
    }

    chooseOperation(operator){
        // Allow change of operation if prev operand is set and no new current operand
        if(this.currentOperandInnerText === '0'){
            this.operation = operator;
            this.currentOperandInnerText = '0';
            this.#updateDisplay();
            return;
        } 
        // Compute if there is a previous operand and current oprand (w/o need to click =)
        if(this.previousOperandInnerText !== '') this.compute()
        // Set fields
        this.operation = operator;
        this.previousOperandInnerText = this.currentOperandInnerText;
        this.currentOperandInnerText = '0';
        this.#updateDisplay()
    }

    compute(){
        // If there is no previous operation, simply return
        if(this.previousOperandInnerText === '') return;
        // Convert prev and curr operands to float and perform operation
        let computation;
        let current_num = parseFloat(this.currentOperandInnerText);
        let prev_num = parseFloat(this.previousOperandInnerText);
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
        // Convert final computation to string and reset prev operand and operation fields
        this.currentOperandInnerText = computation.toString();
        this.previousOperandInnerText = '';
        this.operation = '';
        // Set operation state to true
        if(!this.operationComplete)this.operationComplete = true;
        this.#updateDisplay();
    }

    convertPercentage(){
        // convert current operand to float and convert to percentage decimal
        let current_num_percent = parseFloat(this.currentOperandInnerText)/100;
        // convert back to string
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

