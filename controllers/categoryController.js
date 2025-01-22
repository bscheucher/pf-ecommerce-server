import {
  createCategory,
  getAllCategories,
  getCategoryById,
  reviseCategory,
  removeCategory,
  assignCategoryToProduct,
  removeCategoryFromProduct,
  getCategoriesOfProduct,
  getProductsByCategory,
} from "../services/categoryService.js";

export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Category name is required." });
    }
    const category = await createCategory(name, description);
    res.status(201).json(category);
  } catch (err) {
    if (err.code === "23505") {
      // Unique constraint violation for 'name'
      res.status(400).json({ error: "Category name must be unique." });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

export const listCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  const categoryId = parseInt(req.params.id, 10);
  const data = req.body;

  if (!categoryId || isNaN(categoryId)) {
    return res.status(400).json({ error: "Invalid category ID." });
  }

  try {
    const updatedCategory = await reviseCategory(categoryId, data);
    return res.status(200).json(updatedCategory);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  // Validate if the ID is provided
  if (!id) {
    return res.status(400).json({ error: "Category ID is required" });
  }

  try {
    // Call the service function to remove the category
    await removeCategory(id);
    res
      .status(200)
      .json({ message: `Category with ID ${id} has been deleted` });
  } catch (error) {
    // Handle "not found" error separately
    if (error.message.includes("not found")) {
      return res.status(404).json({ error: error.message });
    }

    // Handle general server errors
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addCategoryToProduct = async (req, res) => {
  const { productId, categoryId } = req.body;

  try {
    await assignCategoryToProduct(productId, categoryId);
    res
      .status(200)
      .json({ message: "Category assigned to product successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to assign category to product." });
  }
};

// Remove a category from a product
export const detachCategoryFromProduct = async (req, res) => {
  const { productId, categoryId } = req.body;

  try {
    await removeCategoryFromProduct(productId, categoryId);
    res
      .status(200)
      .json({ message: "Category removed from product successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove category from product." });
  }
};

// Get categories of a product
export const getProductCategories = async (req, res) => {
  const { productId } = req.params;

  try {
    const categories = await getCategoriesOfProduct(productId);
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve categories for the product." });
  }
};

export const getCategoryProducts = async (req, res) => {
  const { categoryId } = req.params; 

  try {
    const products = await getProductsByCategory(categoryId);

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this category" });
    }

    return res.status(200).json({ products });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching products: " + error.message });
  }
};
