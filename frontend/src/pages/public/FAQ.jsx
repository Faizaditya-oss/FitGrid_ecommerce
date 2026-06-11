import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    category: "Orders & Shipping",
    items: [
      { q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. International shipping can take 7-14 business days depending on the destination." },
      { q: "How can I track my order?", a: "Once your order ships, you will receive a confirmation email with a tracking number. You can also track your order on our 'Track Order' page." },
      { q: "Do you ship internationally?", a: "Yes, we ship to over 50 countries worldwide. Shipping costs will apply and will be added at checkout." }
    ]
  },
  {
    category: "Returns & Exchanges",
    items: [
      { q: "What is your return policy?", a: "We offer a 30-day return policy for unused items in their original packaging with tags attached. Please visit our Shipping & Returns page for more details." },
      { q: "How do I process an exchange?", a: "To exchange an item, please return the original item for a full refund and place a new order for the desired item." }
    ]
  },
  {
    category: "Products & Sizing",
    items: [
      { q: "How do I know my size?", a: "Please refer to our Size Guide for detailed measurements across different categories." },
      { q: "Are the colors on the website accurate?", a: "We make every effort to display as accurately as possible the colors of our products that appear on the website. However, actual colors may vary depending on your monitor." }
    ]
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(`${0}-${0}`);

  const toggleFaq = (catIndex, itemIndex) => {
    const id = `${catIndex}-${itemIndex}`;
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Frequently Asked Questions</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Find answers to common questions about our products, shipping, returns, and more.
          </p>
        </div>

        <div className="space-y-12">
          {faqs.map((category, catIndex) => (
            <div key={catIndex} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => {
                  const id = `${catIndex}-${itemIndex}`;
                  const isOpen = openIndex === id;
                  return (
                    <div 
                      key={itemIndex} 
                      className={`border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'ring-2 ring-blue-500 border-transparent shadow-md' : 'hover:border-slate-300'}`}
                    >
                      <button 
                        className="w-full flex justify-between items-center p-5 bg-white focus:outline-none text-left"
                        onClick={() => toggleFaq(catIndex, itemIndex)}
                      >
                        <span className="font-semibold text-slate-900 text-lg">{item.q}</span>
                        <span className={`text-blue-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                          <ChevronDown className="w-5 h-5" />
                        </span>
                      </button>
                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <p className="p-5 pt-0 text-slate-600 leading-relaxed bg-white">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center bg-blue-600 rounded-2xl p-8 md:p-12 text-white shadow-xl">
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto">
            If you couldn't find the answer to your question, our support team is always ready to help you.
          </p>
          <a href="/contact" className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-slate-50 transition-colors shadow-sm hover:shadow">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
