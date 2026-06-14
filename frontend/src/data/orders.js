export const ordersData = [
  { 
    id: 'ORD-001', 
    customer: 'John Doe', 
    date: '2026-06-11', 
    paymentStatus: 'Paid', 
    orderStatus: 'Processing', 
    total: 1250000, 
    items: [
      { name: 'Basic T-Shirt', qty: 2, price: 435000, image: 'https://placehold.co/150x200?text=T-Shirt' }
    ],
    address: 'Jl. Merdeka No. 123, Jakarta Selatan, 12345'
  },
  { 
    id: 'ORD-002', 
    customer: 'Jane Smith', 
    date: '2026-06-10', 
    paymentStatus: 'Pending', 
    orderStatus: 'Pending', 
    total: 825000, 
    items: [
      { name: 'Floral Dress', qty: 1, price: 825000, image: 'https://placehold.co/150x200?text=Dress' }
    ],
    address: 'Jl. Sudirman No. 45, Bandung, 40111'
  },
  { 
    id: 'ORD-003', 
    customer: 'Michael K', 
    date: '2026-06-09', 
    paymentStatus: 'Paid', 
    orderStatus: 'Shipped', 
    total: 2685000, 
    items: [
      { name: 'Women\'s Trousers', qty: 1, price: 1800000, image: 'https://placehold.co/150x200?text=Trousers' }, 
      { name: 'Denim Jeans', qty: 1, price: 885000, image: 'https://placehold.co/150x200?text=Jeans' }
    ],
    address: 'Jl. Pemuda No. 8, Surabaya, 60271'
  },
  { 
    id: 'ORD-004', 
    customer: 'Sarah L', 
    date: '2026-06-08', 
    paymentStatus: 'Paid', 
    orderStatus: 'Completed', 
    total: 435000, 
    items: [
      { name: 'Basic T-Shirt', qty: 1, price: 435000, image: 'https://placehold.co/150x200?text=T-Shirt' }
    ],
    address: 'Jl. Pahlawan No. 22, Semarang, 50241'
  },
];
