describe("addToCart", function () {

    beforeEach(function() {
        cart = {}; 
    });

    it("добавление нового товара", function () {
        addToCart(1, 2);
        assert.equal(cart[1], 2);
    });

    it("увеличение количества уже добавленного товара", function () {
        addToCart(1, 2);
        addToCart(1, 3);
        assert.equal(cart[1], 5);
    });

    it("добавление товара с отрицательным количеством должно вызывать ошибку", function () {
        assert.throws(() => addToCart(1, -1), Error, "Количество должно быть положительным");
    });
});
