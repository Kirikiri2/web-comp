// Base
describe("factorial", function () {

    it("factorial(0) должно быть 1", function () {
        assert.equal(factorial(0), 1);
    });

    it("factorial(5) должно быть 120", function () {
        assert.equal(factorial(5), 120);
    });

    it("factorial(3) должно быть 6", function () {
        assert.equal(factorial(3), 6);
    });

});
// 2-1
describe("factorial - негативные значения", function () {
    it("factorial(-1) должно выдавать ошибку", function () {
        assert.throws(() => factorial(-1), Error, "Неверное значение");
    });
});
// 2-2
describe("sum", function () {
    it("sum(2, 3) должно быть 5", function () {
        assert.equal(sum(2, 3), 5);
    });

    it("sum(-1, 1) должно быть 0", function () {
        assert.equal(sum(-1, 1), 0);
    });
});
// 2-3
describe("pow", function () {

    it("pow(2, 3) = 8", function () {
        assert.equal(pow(2, 3), 8);
    });

    it("pow(5, 1) = 5", function () {
        assert.equal(pow(5, 1), 5);
    });

    it("pow(10, 0) = 1", function () {
        assert.equal(pow(10, 0), 1);
    });

    it("pow(0, 5) = 0", function () {
        assert.equal(pow(0, 5), 0);
    });

});

