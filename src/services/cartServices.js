const CartMongoDAO = require ("../dao/cartMongoDAO")

class CartService {
    constructor(dao) {
        this.cartDAO=dao
    }

    async createCartClean() {
        return await this.cartDAO.create()
    }
}

const cartServices =  new CartService(new CartMongoDAO())

module.exports = cartServices
