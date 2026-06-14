import catalog1 from '../assets/images/products/catalog1.jpg';
import catalog2 from '../assets/images/products/catalog2.jpg';
import catalog3 from '../assets/images/products/catalog3.jpg';
import catalog4 from '../assets/images/products/catalog4.jpg';

// Men
import chinoShorts from '../assets/images/products/chinoShorts.jpg';
import oxfordShirt from '../assets/images/products/oxfordShirt.jpg';
import slimChinos from '../assets/images/products/slimChinos.jpg';
import bomberJacket from '../assets/images/products/bomberJacket.jpg';
import cargoPants from '../assets/images/products/cargoPants.jpg';

// Women
import floralDress from '../assets/images/products/floralDress.jpg';
import silkBlouse from '../assets/images/products/silkBlouse.jpg';
import midiSkirt from '../assets/images/products/midiSkirt.jpg';
import wrapDress from '../assets/images/products/wrapDress.jpg';
import linenPants from '../assets/images/products/linenPants.jpg';
import knitCardigan from '../assets/images/products/knitCardigan.jpg';
import pleatedSkirt from '../assets/images/products/pleatedSkirt.jpg';

// Kids
import graphicTee from '../assets/images/products/graphicTee.jpg';
import tutuDress from '../assets/images/products/tutuDress.jpg';
import kidsOverall from '../assets/images/products/kidsOverall.jpg';
import cozyHoodie from '../assets/images/products/cozyHoodie.jpg';
import stripedShorts from '../assets/images/products/stripedShorts.jpg';
import denimJacket from '../assets/images/products/denimJacket.jpg';
import floralJumpsuit from '../assets/images/products/floralJumpsuit.jpg';
import joggerSet from '../assets/images/products/joggerSet.jpg';

export const productsData = [
  // ── Men ──
  { id: 'm1', name: 'Basic T-Shirt', category: 'Men', price: 435000, originalPrice: null, discount: null, isNew: true, rating: 4, reviews: 128, sizes: ['S','M','L','XL'], image: catalog1, stock: 15, status: 'Active' },
  { id: 'm2', name: 'Denim Jeans', category: 'Men', price: 885000, originalPrice: 1125000, discount: 21, isNew: false, rating: 5, reviews: 84, sizes: ['M','L','XL'], image: catalog3, stock: 8, status: 'Active' },
  { id: 'm3', name: 'Red Flannel Shirt', category: 'Men', price: 1335000, originalPrice: null, discount: null, isNew: false, rating: 4, reviews: 57, sizes: ['S','M','L'], image: catalog2, stock: 12, status: 'Active' },
  { id: 'm4', name: 'Chino Shorts', category: 'Men', price: 600000, originalPrice: 750000, discount: 20, isNew: false, rating: 4, reviews: 42, sizes: ['S','M','L'], image: chinoShorts, stock: 5, status: 'Active' },
  { id: 'm5', name: 'Oxford Shirt', category: 'Men', price: 1125000, originalPrice: null, discount: null, isNew: true, rating: 5, reviews: 31, sizes: ['XS','S','M'], image: oxfordShirt, stock: 20, status: 'Active' },
  { id: 'm6', name: 'Slim Chinos', category: 'Men', price: 975000, originalPrice: null, discount: null, isNew: false, rating: 4, reviews: 66, sizes: ['S','M','L','XL'], image: slimChinos, stock: 7, status: 'Active' },
  { id: 'm7', name: 'Bomber Jacket', category: 'Men', price: 2025000, originalPrice: 2400000, discount: 16, isNew: true, rating: 5, reviews: 22, sizes: ['S','M','L','XL'], image: bomberJacket, stock: 3, status: 'Active' },
  { id: 'm8', name: 'Cargo Pants', category: 'Men', price: 825000, originalPrice: null, discount: null, isNew: false, rating: 3, reviews: 19, sizes: ['L','XL','XXL'], image: cargoPants, stock: 10, status: 'Active' },
  // ── Women ──
  { id: 'w1', name: 'Floral Dress', category: 'Women', price: 825000, originalPrice: null, discount: null, isNew: true, rating: 5, reviews: 210, sizes: ['XS','S','M','L'], image: floralDress, stock: 6, status: 'Active' },
  { id: 'w2', name: "Women's Trousers", category: 'Women', price: 1800000, originalPrice: 2250000, discount: 20, isNew: false, rating: 5, reviews: 143, sizes: ['XS','S','M'], image: catalog4, stock: 14, status: 'Active' },
  { id: 'w3', name: 'Silk Blouse', category: 'Women', price: 675000, originalPrice: null, discount: null, isNew: false, rating: 4, reviews: 89, sizes: ['S','M','L','XL'], image: silkBlouse, stock: 9, status: 'Active' },
  { id: 'w4', name: 'Midi Skirt', category: 'Women', price: 750000, originalPrice: null, discount: null, isNew: false, rating: 4, reviews: 76, sizes: ['XS','S','M','L'], image: midiSkirt, stock: 11, status: 'Active' },
  { id: 'w5', name: 'Wrap Dress', category: 'Women', price: 1200000, originalPrice: 1425000, discount: 16, isNew: true, rating: 5, reviews: 54, sizes: ['S','M'], image: wrapDress, stock: 4, status: 'Active' },
  { id: 'w6', name: 'Linen Pants', category: 'Women', price: 1050000, originalPrice: null, discount: null, isNew: false, rating: 4, reviews: 38, sizes: ['XS','S','M','L','XL'], image: linenPants, stock: 18, status: 'Active' },
  { id: 'w7', name: 'Knit Cardigan', category: 'Women', price: 900000, originalPrice: 1200000, discount: 25, isNew: false, rating: 5, reviews: 115, sizes: ['S','M','L'], image: knitCardigan, stock: 5, status: 'Active' },
  { id: 'w8', name: 'Pleated Skirt', category: 'Women', price: 675000, originalPrice: null, discount: null, isNew: true, rating: 4, reviews: 29, sizes: ['XS','S','M'], image: pleatedSkirt, stock: 12, status: 'Active' },
  // ── Kids ──
  { id: 'k1', name: 'Boys Graphic Tee', category: 'Kids', price: 225000, originalPrice: null, discount: null, isNew: false, rating: 4, reviews: 61, sizes: ['XS','S','M'], image: graphicTee, stock: 25, status: 'Active' },
  { id: 'k2', name: 'Girls Tutu Dress', category: 'Kids', price: 375000, originalPrice: 480000, discount: 22, isNew: true, rating: 5, reviews: 47, sizes: ['XS','S'], image: tutuDress, stock: 8, status: 'Active' },
  { id: 'k3', name: 'Kids Overalls', category: 'Kids', price: 450000, originalPrice: null, discount: null, isNew: false, rating: 4, reviews: 38, sizes: ['XS','S','M','L'], image: kidsOverall, stock: 10, status: 'Active' },
  { id: 'k4', name: 'Cozy Hoodie', category: 'Kids', price: 525000, originalPrice: null, discount: null, isNew: false, rating: 5, reviews: 92, sizes: ['S','M','L'], image: cozyHoodie, stock: 6, status: 'Active' },
  { id: 'k5', name: 'Striped Shorts', category: 'Kids', price: 270000, originalPrice: 360000, discount: 25, isNew: false, rating: 3, reviews: 17, sizes: ['XS','S','M'], image: stripedShorts, stock: 15, status: 'Active' },
  { id: 'k6', name: 'Denim Jacket', category: 'Kids', price: 600000, originalPrice: null, discount: null, isNew: true, rating: 4, reviews: 23, sizes: ['S','M','L'], image: denimJacket, stock: 4, status: 'Active' },
  { id: 'k7', name: 'Floral Jumpsuit', category: 'Kids', price: 420000, originalPrice: null, discount: null, isNew: false, rating: 5, reviews: 55, sizes: ['XS','S'], image: floralJumpsuit, stock: 9, status: 'Active' },
  { id: 'k8', name: 'Jogger Set', category: 'Kids', price: 480000, originalPrice: 600000, discount: 20, isNew: true, rating: 4, reviews: 41, sizes: ['S','M','L'], image: joggerSet, stock: 7, status: 'Active' },
];
