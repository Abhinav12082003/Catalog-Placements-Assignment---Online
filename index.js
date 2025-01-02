const fs = require('fs');

function decodeValue(base, value) {
    return BigInt(parseInt(value, base));
}

function lagrangeInterpolation(points) {
    const n = points.length;
    let constantTerm = BigInt(0);

    for (let i = 0; i < n; i++) {
        let term = points[i].y;
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                term *= BigInt(points[j].x);
                term /= BigInt(points[j].x - points[i].x);
            }
        }
        constantTerm += term;
    }

    return constantTerm;
}

function findConstantTerm(inputFilePath) {
    const input = JSON.parse(fs.readFileSync(inputFilePath, 'utf8'));

    const { n, k } = input.keys;
    const points = [];

    for (const key in input) {
        if (key !== 'keys') {
            const x = parseInt(key, 10);
            const { base, value } = input[key];
            const y = decodeValue(parseInt(base, 10), value);
            points.push({ x, y });
        }
    }

    if (points.length < k) {
        throw new Error('Not enough points to solve the polynomial.');
    }

    const selectedPoints = points.slice(0, k);

    return lagrangeInterpolation(selectedPoints);
}

function main() {
    const testCase1 = 'sample.json';
    const testCase2 = 'sample2.json';

    try {
        const constantTerm1 = findConstantTerm(testCase1);
        const constantTerm2 = findConstantTerm(testCase2);

        console.log(`Secret for Test Case 1: ${constantTerm1.toString()}`);
        console.log(`Secret for Test Case 2: ${constantTerm2.toString()}`);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
