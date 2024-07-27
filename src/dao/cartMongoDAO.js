const Cart = require('./models/cartModels.js');

class CartMongoDAO {
    constructor() {
        
    }

    async create(){
      return await Cart.create({products:[]})
  }

  async findCart(filtro = {}, populateOptions = null) {
    let query = Cart.findOne(filtro);
    if (populateOptions) {
        query = query.populate(populateOptions);
    }
    return await query.lean();
}

    async getCart() {
        try {
          return await Cart.find();
        } catch (error) {
          throw new Error("Error al obtener los carritos: " + error.message);
        }
      }
    
      async createCart(initialProducts = []) {
        try {
          console.log("Creando un nuevo carrito con productos:", initialProducts);
          const newCart = await Cart.create({ products: initialProducts });
          console.log("Nuevo carrito creado:", newCart);
          return newCart;
        } catch (error) {
          console.error("Error al crear el carrito:", error);
          throw new Error("Error interno del servidor al crear el carrito");
        }
      }
      
    
      async addProductCart(cartId, productId) {
        try {
            console.log(`Buscando carrito con ID: ${cartId}`);
            let carrito = await Cart.findById(cartId);
    
            if (!carrito) {
                throw new Error('Carrito no encontrado');
            }
    
            console.log('Carrito encontrado:', carrito);
            const productIndex = carrito.products.findIndex(p => p.productId.toString() === productId);
    
            if (productIndex > -1) {
                console.log(`Producto ya en el carrito. Incrementando cantidad del producto ${productId}`);
                carrito.products[productIndex].quantity += 1;
            } else {
                console.log(`Añadiendo nuevo producto ${productId} al carrito`);
                carrito.products.push({ productId, quantity: 1 });
            }
    
            console.log('Guardando carrito actualizado');
            await carrito.save();
            console.log('Carrito guardado:', carrito);
            return carrito;
        } catch (error) {
            console.error('Error en addProductCart:', error.message);
            throw new Error(error.message);
        }
    }
    
    
      async removeProductsCart(cartId, productId) {
        try {
          const cart = await Cart.findById(cartId);
    
          if (!cart) {
            throw new Error(`Carrito no encontrado para el ID ${cartId}`);
          }
    
          cart.products = cart.products.filter(
            (product) => !product.productId.equals(productId)
          );
          await cart.save();
    
          return cart;
        } catch (error) {
          throw new Error(
            "Error al eliminar el producto del carrito: " + error.message
          );
        }
      }
    
      async removeAllProducts(cartId) {
        try {
          const cart = await Cart.findById(cartId);
    
          if (!cart) {
            throw new Error(`Carrito no encontrado para el ID ${cartId}`);
          }
    
          cart.products = [];
    
          await cart.save();
    
          return cart;
        } catch (error) {
          throw new Error(
            "Error al eliminar todos los productos del carrito: " + error.message
          );
        }
      }
    
      async updateStockProduct(cartId, productId, updateStock) {
        try {
            const cart = await Cart.findById(cartId);
    
            if (!cart) {
                throw new Error(`Carrito no encontrado para el ID ${cartId}`);
            }
    
            const productToUpdate = cart.products.find((product) =>
                product.productId.equals(productId)
            );
    
            if (!productToUpdate) {
                throw new Error(`Producto no encontrado en el carrito`);
            }
    
            productToUpdate.stock = updateStock;
    
            await cart.save();
    
            return cart;
        } catch (error) {
            throw new Error(
                "Error al actualizar la cantidad de stock del producto en el carrito: " +
                error.message
            );
        }
    }
    
    }

module.exports = CartMongoDAO;
