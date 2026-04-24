const Product = require("../model/productmodel");
const sharp = require('sharp');

// Optimized image processing
const processImage = async (buffer) => {
  try {
    // Compress and optimize image using Sharp
    const processedBuffer = await sharp(buffer)
      .resize({ width: 800, height: 600, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80, progressive: true })
      .toBuffer();
    
    return processedBuffer.toString('base64');
  } catch (error) {
    // Fallback to original base64 if processing fails
    return buffer.toString('base64');
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, rating, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Optimized image processing with compression
    const base64Image = await processImage(req.file.buffer);

    const product = new Product({
      name,
      description,
      price,
      rating,
      category,
      image: base64Image,
    });

    await product.save();

    // Clear cache when new product is added
    

    res.status(201).json({
      message: "Product created successfully",
      product,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getProducts = async (req, res) => {
  try {
    // Extract query parameters for filtering
    const { category, minPrice, maxPrice, sortBy = 'createdAt', order = 'desc', page = 1, limit = 20 } = req.query;
    
    // Build query
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Build sort options
    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Optimized query with lean() and field selection
    const products = await Product.find(query)
      .select('name description price rating category image createdAt')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.status(200).json({
      message: "Products fetched successfully",
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total,
        hasNext: skip + products.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .select('name description price rating category image createdAt updatedAt')
      .lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const removeProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.image = null; // remove image

    await product.save();

   

    res.status(200).json({
      message: "Product image removed successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, rating, category, image } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.rating = rating || product.rating;
    product.category = category || product.category;
    
    // Handle image update if new file is uploaded
    if (req.file) {
      product.image = await processImage(req.file.buffer);
    } else if (image) {
      product.image = image;
    }

    await product.save();

    // Clear cache for this product

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }


    console.log(`Product deleted: ${product._id} by user: ${req.user?.id || 'unknown'}`);

    res.status(200).json({
      message: "Product deleted successfully",
      deletedProductId: product._id
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {

  removeProductImage,
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};