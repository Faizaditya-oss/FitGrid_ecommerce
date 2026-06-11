import RegisterForm from '../../components/auth/RegisterForm';
import ChinoBlue from '../../assets/images/products/ChinoShorts/ChinoBlue.jpg';

const Register = () => {
  return (
    <div className="min-h-screen flex w-full bg-[#f4f5f7]">
      {/* Left Image Section */}
      <div className="hidden lg:block lg:w-[55%] relative">
        <img 
          src={ChinoBlue} 
          alt="Fashion Background" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute top-10 left-12 text-2xl font-bold text-slate-900 tracking-tight">
          FitGrid.
        </div>
      </div>
      
      {/* Right Form Section */}
      <div className="w-full lg:w-[45%] flex justify-center items-center p-6 sm:p-12">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
