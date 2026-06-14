import { useState, useMemo, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductGallery from '../../components/product/ProductGallery';
import ProductInfo from '../../components/product/ProductInfo';
import ProductVariant from '../../components/product/ProductVariant';
import QuantitySelector from '../../components/product/QuantitySelector';
import AddToCartButton from '../../components/product/AddToCartButton';
import RelatedProducts from '../../components/product/RelatedProducts';
import { CartContext } from '../../context/CartContext';

import { useProducts } from '../../hooks/useProducts';
import BasicTshirtWhite from '../../assets/images/products/BasicShirt/BasicTshirtWhite.jpg';
import BasicTshirtNavy from '../../assets/images/products/BasicShirt/BasicTshirtNavy.jpg';
import BasicTshirtGreen from '../../assets/images/products/BasicShirt/BasicTshirtGreen.jpg';
import DenimJeansGelap from '../../assets/images/products/DenimJeans/DenimJeansGelap.jpg';
import DenimJeansTerang from '../../assets/images/products/DenimJeans/DenimJeansTerang.jpg';
import OxfordGrey from '../../assets/images/products/OxfordShirt/OxfordGrey.jpg';
import OxfordWhite from '../../assets/images/products/OxfordShirt/OxfordWhite.jpg';
import OxfordYellow from '../../assets/images/products/OxfordShirt/OxfordYellow.jpg';
import ChinoBlue from '../../assets/images/products/ChinoShorts/ChinoBlue.jpg';
import ChinoGrey from '../../assets/images/products/ChinoShorts/ChinoGrey.jpg';
import SlimChinosBlack from '../../assets/images/products/SlimChinos/SlimChinosBlack.jpg';
import SlimChinosNavy from '../../assets/images/products/SlimChinos/SlimChinosNavy.jpg';
import CargoBlack from '../../assets/images/products/CargoPants/CargoBlack.jpg';
import CargoGreen from '../../assets/images/products/CargoPants/CargoGreen.jpg';
import CargoGrey from '../../assets/images/products/CargoPants/CargoGrey.jpg';
import WrapDressBlue from '../../assets/images/products/WrapDress/WrapDressBlue.jpg';
import WrapDressRed from '../../assets/images/products/WrapDress/WrapDressRed.jpg';
import WomenTrousersArmy from '../../assets/images/products/WomenTrousers/WomenTrousersArmy.jpg';
import WomenTrousersBlack from '../../assets/images/products/WomenTrousers/WomenTrousersBlack.jpg';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useContext(CartContext);
  
  const allProducts = useProducts();

  const productData = allProducts.find(p => p.id === id) || allProducts[0];

  const product = useMemo(() => {
    if (!productData) return null;
    let images = [productData.image, productData.image, productData.image, productData.image];
    let colors = ["Standard", "Alternative"];

    if (productData.name === "Basic T-Shirt") {
      images = [productData.image, BasicTshirtWhite, BasicTshirtNavy, BasicTshirtGreen];
      colors = ["Black", "White", "Navy", "Green"];
    } else if (productData.name === "Denim Jeans") {
      images = [productData.image, DenimJeansGelap, DenimJeansTerang];
      colors = ["Classic Blue", "Dark Denim", "Light Denim"];
    } else if (productData.name === "Oxford Shirt") {
      images = [productData.image, OxfordGrey, OxfordWhite, OxfordYellow];
      colors = ["Classic", "Grey", "White", "Yellow"];
    } else if (productData.name === "Bomber Jacket") {
      images = [productData.image];
      colors = ["Black"];
    } else if (productData.name === "Red Flannel Shirt") {
      images = [productData.image];
      colors = ["Red"];
    } else if (productData.name === "Chino Shorts") {
      images = [productData.image, ChinoBlue, ChinoGrey];
      colors = ["Beige", "Navy", "Grey"];
    } else if (productData.name === "Slim Chinos") {
      images = [productData.image, SlimChinosBlack, SlimChinosNavy];
      colors = ["Khaki", "Black", "Navy"];
    } else if (productData.name === "Cargo Pants") {
      images = [productData.image, CargoBlack, CargoGreen, CargoGrey];
      colors = ["Beige", "Black", "Green", "Grey"];
    } else if (productData.name === "Floral Dress") {
      images = [productData.image];
      colors = ["Standard"];
    } else if (productData.name === "Wrap Dress") {
      images = [productData.image, WrapDressBlue, WrapDressRed];
      colors = ["Beige", "Blue", "Red"];
    } else if (productData.name === "Pleated Skirt") {
      images = [productData.image];
      colors = ["Black"];
    } else if (productData.name === "Girls Tutu Dress") {
      images = [productData.image];
      colors = ["Standard"];
    } else if (productData.name === "Denim Jacket") {
      images = [productData.image];
      colors = ["Standard"];
    } else if (productData.name === "Jogger Set") {
      images = [productData.image];
      colors = ["Blue", "Beige"];
    } else if (productData.name === "Women's Trousers") {
      images = [productData.image, WomenTrousersArmy, WomenTrousersBlack];
      colors = ["Beige", "Army", "Black"];
    } else if (productData.name === "Silk Blouse") {
      images = [productData.image];
      colors = ["Standard"];
    } else if (
      ["Midi Skirt", "Midi Shirt", "Linen Pants", "Knit Cardigan", "Boys Graphic Tee", "Kids Overalls", "Cozy Hoodie", "Striped Shorts", "Floral Jumpsuit"].includes(productData.name)
    ) {
      images = [productData.image];
      colors = ["Standard"];
    }

    const stocks = {
      m1: 15, m2: 8, m3: 12, m4: 5, m5: 20, m6: 7, m7: 3, m8: 10,
      w1: 6, w2: 14, w3: 9, w4: 11, w5: 4, w6: 18, w7: 5, w8: 12,
      k1: 25, k2: 8, k3: 10, k4: 6, k5: 15, k6: 4, k7: 9, k8: 7
    };
    const baseStock = stocks[productData.id] || 10;

    return {
      ...productData,
      description: `Experience ultimate comfort with our ${productData.name}. Made from premium materials, it features a perfect fit and elegant design for your everyday wear.`,
      stock: baseStock,
      images,
      colors,
      details: {
        bahan: "Premium Quality Material",
        spesifikasi: "Standard fit, comfortable design",
        infoTambahan: "Machine wash cold, tumble dry low."
      }
    };
  }, [productData]);

  const relatedProducts = allProducts
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  if (relatedProducts.length < 4) {
    const more = allProducts.filter(p => p.id !== product?.id && !relatedProducts.find(r => r.id === p.id)).slice(0, 4 - relatedProducts.length);
    relatedProducts.push(...more);
  }
  
  // State for product selections
  const [selectedSize, setSelectedSize] = useState(product?.sizes ? product.sizes[0] : "All Size");
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product?.images[0]);

  // Calculate available stock based on what's already in the cart
  const itemsInCart = (cart || []).filter(item => item.productId === product?.id).reduce((acc, item) => acc + item.quantity, 0);
  const availableStock = Math.max(0, (product?.stock || 0) - itemsInCart);

  useEffect(() => {
    if (quantity > availableStock && availableStock > 0) {
      setQuantity(availableStock);
    } else if (availableStock === 0) {
      setQuantity(1); // visually reset, though disabled
    }
  }, [availableStock, quantity]);

  const colorImageMap = useMemo(() => {
    if (product.name === "Basic T-Shirt") {
      return {
        "Black": product.images[0],
        "White": BasicTshirtWhite,
        "Navy": BasicTshirtNavy,
        "Green": BasicTshirtGreen
      };
    }
    if (product.name === "Denim Jeans") {
      return {
        "Classic Blue": product.images[0],
        "Dark Denim": DenimJeansGelap,
        "Light Denim": DenimJeansTerang
      };
    }
    if (product.name === "Oxford Shirt") {
      return {
        "Classic": product.images[0],
        "Grey": OxfordGrey,
        "White": OxfordWhite,
        "Yellow": OxfordYellow
      };
    }
    if (product.name === "Chino Shorts") {
      return {
        "Beige": product.images[0],
        "Navy": ChinoBlue,
        "Grey": ChinoGrey
      };
    }
    if (product.name === "Slim Chinos") {
      return {
        "Khaki": product.images[0],
        "Black": SlimChinosBlack,
        "Navy": SlimChinosNavy
      };
    }
    if (product.name === "Cargo Pants") {
      return {
        "Classic": product.images[0],
        "Black": CargoBlack,
        "Green": CargoGreen,
        "Grey": CargoGrey
      };
    }
    if (product.name === "Wrap Dress") {
      return {
        "Beige": product.images[0],
        "Blue": WrapDressBlue,
        "Red": WrapDressRed
      };
    }
    if (product.name === "Pleated Skirt") {
      return {
        "Black": product.images[0]
      };
    }
    if (product.name === "Jogger Set") {
      return {
        "Blue": product.images[0],
        "Beige": product.images[0]
      };
    }
    if (product.name === "Women's Trousers") {
      return {
        "Beige": product.images[0],
        "Army": WomenTrousersArmy,
        "Black": WomenTrousersBlack
      };
    }
    return {
      "Standard": product?.images[0]
    };
  }, [product?.name, product?.images]);

  const handleColorChange = (color) => {
    setSelectedColor(color);
    if (colorImageMap[color]) {
      setActiveImage(colorImageMap[color]);
    }
  };

  const handleImageChange = (img) => {
    setActiveImage(img);
    const color = Object.keys(colorImageMap).find(k => colorImageMap[k] === img);
    if (color && product.colors.includes(color)) {
      setSelectedColor(color);
    }
  };

  // Reset states when ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      setSelectedSize(product.sizes ? product.sizes[0] : "All Size");
      setSelectedColor(product.colors[0]);
      setActiveImage(product.images[0]);
      setQuantity(1);
    }
  }, [id, product]);

  const handleAddToCart = () => {
    let numericPrice = product.priceNum;
    if (!numericPrice && typeof product.price === 'string') {
      numericPrice = parseInt(product.price.replace(/[^\d]/g, ''), 10) || 0;
    } else if (!numericPrice) {
      numericPrice = product.price || 0;
    }

    const cartItem = {
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      productId: product.id,
      name: product.name,
      category: product.category,
      price: numericPrice,
      size: selectedSize,
      color: selectedColor,
      image: activeImage,
      quantity: quantity
    };
    addToCart(cartItem);
    alert('Added to cart!');
  };

  const handleBuyNow = () => {
    let numericPrice = product.priceNum;
    if (!numericPrice && typeof product.price === 'string') {
      numericPrice = parseInt(product.price.replace(/[^\d]/g, ''), 10) || 0;
    } else if (!numericPrice) {
      numericPrice = product.price || 0;
    }

    const cartItem = {
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      productId: product.id,
      name: product.name,
      category: product.category,
      price: numericPrice,
      size: selectedSize,
      color: selectedColor,
      image: activeImage,
      quantity: quantity
    };
    addToCart(cartItem);
    navigate('/cart');
  };

  if (!product) return <div className="p-8 text-center">Loading product...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Left Column: Gallery */}
        <div className="w-full lg:w-1/2">
          <ProductGallery images={product.images} externalActiveImage={activeImage} onImageChange={handleImageChange} />
        </div>

        {/* Right Column: Details */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <ProductInfo product={product} />
          
          <hr className="border-slate-200 mb-8" />
          
          <ProductVariant 
            sizes={product.sizes || ["All Size"]}
            colors={product.colors}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedColor={selectedColor}
            setSelectedColor={handleColorChange}
          />

          <QuantitySelector 
            quantity={quantity}
            setQuantity={setQuantity}
            stock={availableStock}
          />

          <AddToCartButton 
            onAdd={handleAddToCart}
            onBuy={handleBuyNow}
            disabled={availableStock <= 0}
          />

          {/* Description Section */}
          <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-wider">Product Details</h3>
            <div className="space-y-4 text-sm sm:text-base">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <span className="font-semibold text-slate-900">Bahan</span>
                <span className="sm:col-span-2 text-slate-600">{product.details.bahan}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <span className="font-semibold text-slate-900">Spesifikasi</span>
                <span className="sm:col-span-2 text-slate-600">{product.details.spesifikasi}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <span className="font-semibold text-slate-900">Info Tambahan</span>
                <span className="sm:col-span-2 text-slate-600">{product.details.infoTambahan}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RelatedProducts products={relatedProducts} onViewDetail={(p) => navigate(`/products/${p.id}`)} />
    </div>
  );
};

export default ProductDetail;
