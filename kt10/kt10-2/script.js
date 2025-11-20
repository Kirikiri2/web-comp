// Base
function factorial(n) {
    if (n === 0) return 1;
    return n * factorial(n - 1);
}
// 2-1
function factorial(n) {
    if (n < 0) {
        throw new Error("Неверное значение");
    }
    if (n === 0) return 1;
    return n * factorial(n - 1);
}
// 2-2
function sum(a, b) {
    return a + b;
}
// 2-3
function pow(x, n) {
    return x ** n;
}
