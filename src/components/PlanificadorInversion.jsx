import { useMemo } from 'react';
import { useBusiness } from '../context/BusinessContext';

const PlanificadorInversion = () => {
  const { inversionTotal, cajasCreadas, setCajasCreadas, planInversion, setPlanInversion, confirmarPlanInversion } = useBusiness();

  const handlePorcentajeChange = (cajaId, porcentaje) => {
    const nuevoPorcentaje = parseFloat(porcentaje);
    if (isNaN(nuevoPorcentaje) || nuevoPorcentaje < 0) return;

    const existe = planInversion.find(item => item.cajaId === cajaId);
    if (existe) {
      setPlanInversion(planInversion.map(item =>
        item.cajaId === cajaId ? { ...item, porcentaje: nuevoPorcentaje } : item
      ));
    } else {
      setPlanInversion([...planInversion, { cajaId, porcentaje: nuevoPorcentaje }]);
    }
  };

  const eliminarCaja = (cajaId) => {
    setCajasCreadas(cajasCreadas.filter(c => c.id !== cajaId));
    setPlanInversion(planInversion.filter(item => item.cajaId !== cajaId));
  };

  const resumenInversion = useMemo(() => {
    let totalPorcentajeAsignado = 0;
    const cajasInvertidasDetalle = [];

    planInversion.forEach(itemInversion => {
      totalPorcentajeAsignado += itemInversion.porcentaje;
      const caja = cajasCreadas.find(c => c.id === itemInversion.cajaId);

      if (caja) {
        const dineroDestinado = inversionTotal * (itemInversion.porcentaje / 100);
        const costeProveedorCaja = caja.items.reduce((acc, i) => acc + parseFloat(i.precioCompraConIva || 0), 0);
        
        const unidadesCajaComprables = Math.floor(dineroDestinado / (costeProveedorCaja || 1));

        // Calcular el total de productos individuales necesarios
        const productosNecesarios = caja.items.map(item => ({
          nombre: item.nombre,
          unidades: unidadesCajaComprables, // Cada item dentro de la caja se compra esta cantidad de veces
          costeRealUnidad: item.costeRealUnidad,
        }));

        cajasInvertidasDetalle.push({
          ...caja,
          porcentajeInversion: itemInversion.porcentaje,
          dineroDestinado,
          unidadesCajaComprables,
          productosNecesarios,
        });
      }
    });

    return {
      totalPorcentajeAsignado,
      cajasInvertidasDetalle,
    };
  }, [planInversion, cajasCreadas, inversionTotal]);

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50">
      <h3 className="font-black text-[11px] uppercase text-slate-400 tracking-[0.15em] mb-6">Asignar Inversión a Cajas</h3>
      
      <div className="space-y-4">
        {cajasCreadas.length === 0 && (
          <p className="text-slate-500 text-sm italic text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl">
            No hay cajas creadas. Crea algunas en la sección anterior.
          </p>
        )}

        {cajasCreadas.map(caja => {
          const inversionActual = planInversion.find(item => item.cajaId === caja.id);
          const porcentaje = inversionActual ? inversionActual.porcentaje : 0;
          const detalleCajaInvertida = resumenInversion.cajasInvertidasDetalle.find(d => d.id === caja.id);

          return (
            <div key={caja.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div className="flex-1">
                <p className="font-black text-sm uppercase text-slate-700">{caja.nombre}</p>
                <p className="text-[10px] text-slate-400 font-bold">PVP Sugerido Pack: {caja.pvpFinalCaja.toFixed(2)}€</p>
                {detalleCajaInvertida && (
                  <p className="text-[10px] text-indigo-500 font-bold mt-1">
                    Comprarás {detalleCajaInvertida.unidadesCajaComprables} cajas ({detalleCajaInvertida.productosNecesarios.reduce((acc, p) => acc + p.unidades, 0)} productos individuales)
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={porcentaje}
                  onChange={(e) => handlePorcentajeChange(caja.id, e.target.value)}
                  className="w-20 bg-white border border-slate-300 rounded-xl p-2 text-center font-black text-indigo-600 outline-none focus:border-indigo-500"
                  placeholder="%"
                />
                <button onClick={() => eliminarCaja(caja.id)} className="text-slate-400 hover:text-rose-500 font-bold text-xl transition-colors px-2" title="Eliminar pack">×</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200 text-right">
        <p className={`text-sm font-bold ${resumenInversion.totalPorcentajeAsignado > 100 ? 'text-rose-500' : 'text-slate-700'}`}>
          Total % Asignado: {resumenInversion.totalPorcentajeAsignado.toFixed(1)}%
        </p>
        <button 
          onClick={confirmarPlanInversion}
          className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3 px-8 rounded-2xl uppercase text-xs transition-all shadow-lg active:scale-95"
        >
          Aceptar Plan y Calcular Impacto
        </button>
      </div>
    </div>
  );
};

export default PlanificadorInversion;