import {
  createAddress,
  getAddressesByUser,
  getAddressById,
  reviseAddress,
  removeAddress,
} from "../services/addressService.js";

export const addAddress = async (req, res) => {
  const {
    fullName,
    streetAddress,
    city,
    state,
    postalCode,
    country,
    phoneNumber,
  } = req.body;
  console.log("AddAdress req.body", req.body);
  const userId = req.user?.id;

  if (!userId) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not logged in" });
  }

  try {
    const address = await createAddress({
      userId,
      fullName,
      streetAddress,
      city,
      state,
      postalCode,
      country,
      phoneNumber,
    });

    res.status(201).json({
      message: "Address created successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create address",
      error: error.message,
    });
  }
};

export const getUserAddresses = async (req, res) => {
  const userId = req.params.userId;

  try {
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const addresses = await getAddressesByUser(userId);

    if (!addresses || addresses.length === 0) {
      return res
        .status(200)
        .json({ message: "No addresses found for this user", addresses: [] });
    }

    res.status(200).json({ addresses });
  } catch (error) {
    console.error("Error in getUserAddresses:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving addresses" });
  }
};

export const getAddress = async (req, res) => {
  try {
    const addressId = parseInt(req.params.id, 10);

    if (isNaN(addressId)) {
      return res.status(400).json({ error: "Invalid address ID" });
    }

    const address = await getAddressById(addressId);
    res.status(200).json(address);
  } catch (error) {
    console.error(`Error in getAddress: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const addressId = parseInt(req.params.id, 10);
    if (isNaN(addressId)) {
      return res.status(400).json({ error: "Invalid address ID." });
    }

    const updatedAddress = await reviseAddress(addressId, req.body);
    res.status(200).json({
      message: "Address updated successfully.",
      address: updatedAddress,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  const { addressId } = req.params;

  try {
    const deletedAddress = await removeAddress(addressId);
    res.status(200).json({
      message: "Address deleted successfully",
      address: deletedAddress,
    });
  } catch (error) {
    if (error.message === "Address not found") {
      res.status(404).json({ error: "Address not found" });
    } else {
      res
        .status(500)
        .json({ error: "An error occurred while deleting the address" });
    }
  }
};
