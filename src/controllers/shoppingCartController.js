// controllers/shoppingCartController.js
const ShoppingCart = require("../models/ShoppingCart");
const Destination = require("../models/destinations");
const Hotel = require("../models/hotel"); // FALTA POR DEFINIR

// add item to carrito
const addItemToCart = async (req, res) => {
  try {
    const { destinationId, hotelId, quantity } = req.body;
    const destination = await Destination.findById(destinationId);
    const hotel = hotelId ? await Hotel.findById(hotelId) : null; // Solo busca hotel si hotelId está definido
    //const hotel = await Hotel.findById(hotelId);

    if (!destination || !hotel) {
      return res.status(404).json({ msg: "Destinatin or hotel not found" });
    }

    const price = destination.price + hotel.price; // Ajusta precios

    let cart = await ShoppingCart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await ShoppingCart.create({
        user: req.user.id,
        items: [{ destination, hotel, quantity, price }],
        totalPrice: price * quantity,
      });
    } else {
      const existingItem = cart.items.find(
        (item) =>
          // item.destination.equals(destinationId) && item.hotel.equals(hotelId)
          item.destination.equals(destinationId) &&
          (hotelId ? item.hotel.equals(hotelId) : !item.hotel)
      );

      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.price =
          (existingItem.price / existingItem.quantity) * existingItem.quantity; // Ajuste para el nuevo precio
      } else {
        cart.items.push({
          destination: destinationId,
          hotel: hotelId,
          quantity,
          price,
        });
      }

      cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.price,
        0
      );
      await cart.save();
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// carrito user
const getCart = async (req, res) => {
  try {
    const cart = await ShoppingCart.findOne({ user: req.user.id }).populate(
      "items.destination items.hotel"
    );
    if (!cart) {
      return res.status(404).json({ msg: "shopping cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const removeItemFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const cart = await ShoppingCart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ msg: "shopping cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ msg: "Ítem no encontrado en el carrito" });
    }

    cart.items.splice(itemIndex, 1);
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  addItemToCart,
  getCart,
  removeItemFromCart,
};
