import { useBusiness } from '../context/BusinessContext';

const PanelGastos = () => {
  const { 
    fijos, 
    setFijos, 
    totalGastosEstructura, 
    cargaEstructuraUnidad,
    unidadesTotalesProyecto 
  } = useBusiness();

  const handleFijos = (e) => {
    setFijos({ ...fijos, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4">
      {/* SECCIÓN DE INPUTS DE GASTOS */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="font-black text-xs uppercase mb-4 text-slate-400 tracking-widest">
          Gastos de Estructura
        </h2>
        
        <div className="space-y-3">
          {Object.keys(fijos).map((key) => (
            <div key={key} className="flex justify-between items-center text-sm">
              <span className="capitalize text-slate-600 font-medium">{key}</span>
              <input
                type="number"
                name={key}
                value={fijos[key]}
                onChange={handleFijos}
                className="w-20 text-right border-b border-slate-100 outline-none focus:border-indigo-500 transition-colors font-mono text-slate-700"
              />
            </div>
          ))}
        </div>

        {/* SUBTOTAL DE GASTOS */}
        <div className="pt-4 mt-4 border-t border-dashed border-slate-100 flex justify-between font-bold text-slate-900">
          <span className="text-[10px] uppercase tracking-wider text-slate-400">Total Mensual</span>
          <span className="font-mono">{totalGastosEstructura.toFixed(2)}€</span>
        </div>
      </div>

      {/* TARJETA DE IMPACTO EN STOCK (UNA SOLA LÍNEA) */}
      <div className="bg-indigo-900 text-white p-4 rounded-xl shadow-lg shadow-indigo-100 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-indigo-300 tracking-widest">
            Impacto en Stock
          </span>
          <span className="text-[9px] text-indigo-400 font-bold italic">
            ({unidadesTotalesProyecto} uds totales)
          </span>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-black text-emerald-400">
            +{cargaEstructuraUnidad.toFixed(2)}€ 
            <small className="text-[10px] text-white opacity-50 ml-1 font-normal">/ ud</small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PanelGastos;