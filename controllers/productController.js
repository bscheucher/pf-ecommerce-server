import {
  createProduct,
  getProductById,
  getAllProducts,
  reviseProduct,
  removeProduct,
} from "../services/productService.js";

export const addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image_url } = req.body;

    // Validate required fields
    if (!name || price === undefined || stock === undefined) {
      return res
        .status(400)
        .json({ error: "Name, price, and stock are required fields." });
    }

    // Create the product
    const product = await createProduct({
      name,
      description,
      price,
      stock,
      image_url,
    });

    // Respond with the created product
    res.status(201).json(product);
  } catch (error) {
    console.error("Error adding product:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the product." });
  }
};

export const getProduct = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).send("Invalid product ID.");
  }
  try {
    const product = await getProductById(id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).send("Product not found.");
    }
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).send("An error occurred while fetching the product.");
  }
};

export const listProducts = async (req, res) => {
  try {
    // Extract query parameters from the request
    const { category, priceMin, priceMax } = req.query;
    console.log("Price Max", priceMax);

    // Parse numeric filters if provided
    const filters = {
      category,
      priceMin: priceMin ? parseFloat(priceMin) : undefined,
      priceMax: priceMax ? parseFloat(priceMax) : undefined,
    };

    // Call the service function to get the products
    const products = await getAllProducts(filters);

    // Send the products as the response
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error in listProducts:", error);

    // Send an error response
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve products" });
  }
};

export const updateProduct = async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const data = req.body;

  if (!productId || isNaN(productId)) {
    return res.status(400).json({ error: "Invalid product ID." });
  }

  try {
    const updatedProduct = await reviseProduct(productId, data);
    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  // Validate if the ID is provided
  if (!id) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  try {
    // Call the service function to remove the product
    await removeProduct(id);
    res.status(200).json({ message: `Product with ID ${id} has been deleted` });
  } catch (error) {
    // Handle "not found" error separately
    if (error.message.includes("not found")) {
      return res.status(404).json({ error: error.message });
    }

    // Handle general server errors
    res.status(500).json({ error: "Internal server error" });
  }
};
