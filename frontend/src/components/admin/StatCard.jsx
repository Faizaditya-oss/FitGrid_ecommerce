const StatCard = ({ title, value, icon, trend, isPositive }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900">{value}</h3>
        </div>
        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-700">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-2 text-sm mt-auto">
          <span className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : '-'}{trend}
          </span>
          <span className="text-slate-400">from last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
