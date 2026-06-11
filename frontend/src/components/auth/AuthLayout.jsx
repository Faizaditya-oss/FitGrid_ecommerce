import catalog2 from '../../assets/images/products/ChinoShorts/ChinoGrey.jpg';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex bg-slate-50">
      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-16 xl:p-24 bg-white shadow-xl lg:shadow-none z-10 relative lg:rounded-r-[40px]">
        {children}
      </div>

      {/* Banner Section - Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-100 overflow-hidden">
        {/* Abstract Pattern/Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-slate-900/20 to-transparent z-10"></div>
        <img 
          src={catalog2} 
          alt="Fashion Banner" 
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />
        
        {/* Banner Content */}
        <div className="absolute bottom-0 left-0 right-0 p-16 z-20 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent text-white">
          <h2 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">
            Elevate Your <br />
            Everyday Style.
          </h2>
          <p className="text-slate-200 text-lg max-w-md font-medium leading-relaxed">
            Discover the latest trends in fashion and explore our new arrivals. Join our community for exclusive offers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
