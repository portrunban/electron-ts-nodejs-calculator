import { Titlebar, Color } from 'custom-electron-titlebar'

interface Icalculation {
    a: number
    toMultiply(b: number): string
    toDevide(b: number): string
    toSumm(b: number): string
    toSubtract(b: number): string
}

class calculation implements Icalculation {
    a: number = 0

    constructor(a: number) {
        this.a = a;
    }

    toMultiply(b: number): string {
        return String(this.a * b).substr(0, 17);
    }

    toDevide(b: number): string {
        if (b === 0) {
            return 'impossible'
        }
        return String(this.a / b).substr(0, 17);
    }

    toSumm(b: number): string {
        return String(this.a + b).substr(0, 17);
    }

    toSubtract(b: number): string {
        return String(this.a - b).substr(0, 17);
    }

    toSqrt(b: number): string {
        return String(Math.sqrt(b)).substr(0, 17);
    }

    toPow(b: number): string {
        return String(Math.pow(b, 2)).substr(0, 17);
    }

    toDevideX(b: number): string {
        if (b === 0) {
            return 'impossible'
        }
        return String(1 / b).substr(0, 17);
    }

    toReverseSign(b: number): string {
        return String(-b).substr(0, 17);
    }

    toReturnPercent(b: number): string {
        return String((this.a / 100) * b).substr(0, 17);
    }
}

let calculate: calculation | null

new Titlebar({
    backgroundColor: Color.fromHex('#1f1f1f'),
    menu: null,
    titleHorizontalAlignment: 'left',
});

const mainDiv: HTMLElement | null = document.querySelector('.container-after-titlebar');
if (mainDiv) {
    mainDiv.addEventListener('mouseover', e => {
        const elem = <HTMLElement>e.target;
        switch (elem.classList[0]) {
            case 'equal':
                elem.style.outline = '1px solid #fff'
                break;
            case 'number':
            case 'action':
                elem.style.backgroundColor = 'rgb(54,54,54)'
                elem.style.outline = '1px solid #fff'
                break;
            default:
                break;
        }
    })

    mainDiv.addEventListener('mouseout', e => {
        const elem = <HTMLElement>e.target;
        switch (elem.classList[0]) {
            case 'number':
                elem.style.backgroundColor = 'black'
                elem.style.outline = ''
                break;
            case 'equal':
                elem.style.backgroundColor = 'rgb(81, 100, 35)'
                elem.style.outline = ''
                break;
            case 'action':
                elem.style.backgroundColor = 'rgba(0, 0, 0, 0.2)'
                elem.style.outline = ''
                break;
            default:
                break;
        }
    })

    mainDiv.addEventListener('click', e => {
        const prevNumber = <HTMLElement>document.querySelector('div.input > div.prevNumber')
        const currNumber = <HTMLElement>document.querySelector('.input > .currNumber > p')
        const elem = <HTMLElement>e.target;

        if (/=/.test(prevNumber.innerText) && (elem.className === 'action' || elem.className === 'number')) {
            currNumber.innerText = '0'
            prevNumber.innerText = ' '
        }

        let currentNumber: string = currNumber.innerText.replace(/\s/g, '')

        let operation = elem.innerText

        if (elem.innerText === '=') {
            const signFind = prevNumber.innerText.match(/÷|✕|—|\+|·/)
            operation = signFind ? signFind[0] : operation
        }

        switch (true) {
            case /^\.$/.test(operation):
                if (!/\./.test(currentNumber)) {
                    currentNumber = currNumber.innerText = currentNumber + operation
                }
                break;

            case /^\d$/.test(operation):
                if (currentNumber === '0') {
                    currentNumber = currNumber.innerText = operation
                } else {
                    currentNumber = currNumber.innerText = currentNumber + operation
                }

                // stylizing numbers in a label
                if (!/\./.test(currentNumber)) {
                    const formattingString: string = currentNumber.split('').slice(0, 12).reverse().join('').replace(/(\d\d\d)/g, '$1 ').split('').reverse().join('');
                    currNumber.innerText = formattingString;
                }
                break;

            case /^±$/.test(operation):
                calculate = new calculation(0);
                currNumber.innerText = calculate.toReverseSign(+currentNumber);
                calculate = null
                break;

            case /^÷$/.test(operation):
                if (!calculate) {
                    calculate = new calculation(+currentNumber);
                    prevNumber.innerText = `${currentNumber} ÷ `;
                    currNumber.innerText = '0'
                    break;
                }
                prevNumber.innerText += ` ${currentNumber} =`;
                currNumber.innerText = calculate.toDevide(+currentNumber);
                calculate = null
                break;
            case /^✕$|·/.test(operation):
                if (!calculate) {
                    calculate = new calculation(+currentNumber);
                    prevNumber.innerText = `${currentNumber} · `;
                    currNumber.innerText = '0'
                    break;
                }
                prevNumber.innerText += ` ${currentNumber} =`;
                currNumber.innerText = calculate.toMultiply(+currentNumber);
                calculate = null
                break;
            case /^—$/.test(operation):
                if (!calculate) {
                    calculate = new calculation(+currentNumber);
                    prevNumber.innerText = `${currentNumber} — `;
                    currNumber.innerText = '0'
                    break;
                }
                prevNumber.innerText += ` ${+currentNumber} =`;
                currNumber.innerText = calculate.toSubtract(+currentNumber);
                calculate = null
                break;
            case /^\+$/.test(operation):
                if (!calculate) {
                    calculate = new calculation(+currentNumber);
                    prevNumber.innerText = `${currentNumber} + `;
                    currNumber.innerText = '0'
                    break;
                }
                prevNumber.innerText += ` ${currentNumber} =`;
                currNumber.innerText = calculate.toSumm(+currentNumber);
                calculate = null
                break;

            case /^√$/.test(operation):
                calculate = new calculation(0);
                prevNumber.innerText += `√ ${currentNumber} =`;
                currNumber.innerText = calculate.toSqrt(+currentNumber);
                calculate = null
                break;

            case /^x²$/.test(operation):
                calculate = new calculation(0);
                prevNumber.innerText += `x² ${currentNumber} =`;
                currNumber.innerText = calculate.toPow(+currentNumber);
                calculate = null
                break;

            case /^1\/x$/.test(operation):
                calculate = new calculation(0);
                prevNumber.innerText += `1/(${currentNumber}) =`;
                currNumber.innerText = calculate.toDevideX(+currentNumber);
                calculate = null
                break;

            case /^CE$/.test(operation):
                currNumber.innerText = '0';
                break;

            case /^C$/.test(operation):
                currNumber.innerText = '0';
                prevNumber.innerText = ' ';
                break;

            case /^%$/.test(operation):
                if (calculate) {
                    currNumber.innerText = calculate.toReturnPercent(+currentNumber);
                }
                break;

            case /^⌫$/.test(operation):
                currNumber.innerText = currNumber.innerText.slice(0, -1)
                break;
            default:
                break;
        }
    })
}