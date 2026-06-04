import { useMemo, useState } from 'react';
import { useBusiness } from '../context/BusinessContext';

const ResumenCajasFinales = () => {
  const { planInversion, cajasCreadas, inversionTotal, cargaEstructuraUnidad } = useBusiness();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);

  const cajasFinales = useMemo(() => {
    if (cargaEstructuraUnidad === 0) return [];

    return planInversion.map(plan => {
      const caja = cajasCreadas.find(c => c.id === plan.cajaId);
      if (!caja) return null;

      const dineroDestinado = inversionTotal * (plan.porcentaje / 100);
      const costeProveedorCaja = caja.items.reduce((acc, i) => acc + parseFloat(i.precioCompraConIva || 0), 0);
      const qCajas = Math.floor(dineroDestinado / (costeProveedorCaja || 1));
      
      // Impacto total de la empresa en ESTA caja (impacto por unidad * numero de items)
      const impactoEmpresaCaja = cargaEstructuraUnidad * caja.items.length;
      const costeRealCajaFinal = costeProveedorCaja + impactoEmpresaCaja;
      
      const beneficioCaja = caja.pvpFinalCaja - costeRealCajaFinal;
      const margenNetoFinal = (beneficioCaja / costeRealCajaFinal) * 100;

      return {
        nombre: caja.nombre,
        cantidad: qCajas,
        costeBase: costeProveedorCaja,
        impacto: impactoEmpresaCaja,
        costeTotal: costeRealCajaFinal,
        pvp: caja.pvpFinalCaja,
        margen: margenNetoFinal,
        // Añadimos los items originales de la caja para mostrarlos en el pop-up
        items: caja.items.map(item => ({
          nombre: item.nombre,
          costeRealUnidad: item.costeRealUnidad,
          margenDeseado: item.margenDeseado
        }))
      };
    }).filter(Boolean);
  }, [planInversion, cajasCreadas, inversionTotal, cargaEstructuraUnidad]);

  const handleBoxClick = (box) => {
    setSelectedBox(box);
    setShowPopup(true);
  };

  if (cargaEstructuraUnidad === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-2">
        <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded">FINAL</span>
        <h2 className="font-black text-xs uppercase text-slate-500 tracking-widest">Desglose Final de Packs (Post-Impacto)</h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cajasFinales.map((caja, idx) => (
          <div 
            key={idx} 
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleBoxClick(caja)}
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-black text-slate-800 uppercase text-sm">{caja.nombre}</h4>
              <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-1 rounded-lg">{caja.cantidad} UNIDADES</span>
            </div>
            <div className="space-y-2 border-t border-slate-50 pt-4">
              <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400">
                <span>Coste Total (c/Impacto)</span>
                <span className="text-slate-700">{caja.costeTotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400">
                <span>PVP Final</span>
                <span className="text-indigo-600">{caja.pvp.toFixed(2)}€</span>
              </div>
              <div className={`text-center pt-2 font-black ${caja.margen >= 10 ? 'text-emerald-500' : 'text-rose-500'}`}>
                MARGEN NETO: {caja.margen.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {showPopup && selectedBox && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full relative">
            <button 
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-2xl font-bold"
            >
              ×
            </button>
            <h3 className="text-xl font-black text-indigo-950 mb-4">{selectedBox.nombre}</h3>
            <p className="text-sm text-slate-600 mb-6">Detalle de los {selectedBox.cantidad} packs:</p>

            <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
              {selectedBox.items.map((item, itemIdx) => (
                <div key={itemIdx} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <p className="font-bold text-sm text-slate-800">{item.nombre}</p>
                    <p className="text-[10px] text-slate-500">Margen deseado: {item.margenDeseado.toFixed(1)}%</p>
                  </div>
                  <p className="font-black text-indigo-600">{item.costeRealUnidad.toFixed(2)}€</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                <span>Coste Total por Pack (c/Impacto):</span>
                <span>{selectedBox.costeTotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-indigo-600">
                <span>PVP Final por Pack:</span>
                <span>{selectedBox.pvp.toFixed(2)}€</span>
              </div>
              <p className={`text-center mt-4 text-lg font-black ${selectedBox.margen >= 10 ? 'text-emerald-500' : 'text-rose-500'}`}>
                MARGEN NETO: {selectedBox.margen.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumenCajasFinales;