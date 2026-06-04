import { useState, useMemo, useRef } from 'react';
import { useBusiness } from '../context/BusinessContext';

const CreadorCajas = () => {
  const { listaProductos, cargaEstructuraUnidad, cajasCreadas, setCajasCreadas } = useBusiness();
  const [nuevaCaja, setNuevaCaja] = useState({ nombre: '', items: [] });
  const nextIdRef = useRef(0);
  
  const agregarProductoACaja = (producto) => {
    // 1. Calculamos el coste real (igual que en la tabla)
    const precioCompraConIva = parseFloat(producto.precioCompraConIva || 0);
    const costeRealTotal = precioCompraConIva + cargaEstructuraUnidad;
    
    // 2. Obtenemos el PVP que tiene actualmente en el inventario
    // Si no tiene PVP manual, usamos el sugerido (Coste + 30%)
    const pvpActual = parseFloat(producto.pvpManual) || (costeRealTotal * 1.30);
    
    // 3. Calculamos el margen real actual para que sea el valor inicial en la caja.
    const margenInicial = ((pvpActual - costeRealTotal) / costeRealTotal) * 100;
    const uniqueId = nextIdRef.current++; // ID único estable para el linter

    setNuevaCaja({
      ...nuevaCaja,
      items: [...nuevaCaja.items, { 
        ...producto, 
        idUnico: uniqueId, // Asignamos el ID único generado
        costeRealUnidad: costeRealTotal,
        margenDeseado: parseFloat(margenInicial.toFixed(1)), // Ahora hereda el 28.5% (según tu ejemplo)
      }]
    });
  };

  const actualizarMargenItem = (idUnico, nuevoMargen) => {
    const itemsActualizados = nuevaCaja.items.map(item => 
      item.idUnico === idUnico ? { ...item, margenDeseado: parseFloat(nuevoMargen) || 0 } : item
    );
    setNuevaCaja({ ...nuevaCaja, items: itemsActualizados });
  };

  const eliminarDeCaja = (idUnico) => {
    setNuevaCaja({ ...nuevaCaja, items: nuevaCaja.items.filter(item => item.idUnico !== idUnico) });
  };

  const resumenCaja = useMemo(() => {
    // Sumamos el PVP (con IVA) que resulta de aplicar cada margen individual
    const totalPvpConIva = nuevaCaja.items.reduce((acc, item) => {
      const pvpItem = item.costeRealUnidad * (1 + (item.margenDeseado / 100));
      return acc + pvpItem;
    }, 0);

    const totalCosteReal = nuevaCaja.items.reduce((acc, item) => acc + item.costeRealUnidad, 0);
    
    // El beneficio neto es la diferencia de lo que entra vs lo que sale (limpiando el IVA del beneficio)
    const beneficioBruto = totalPvpConIva - totalCosteReal;
    const margenGlobalNeto = totalCosteReal > 0 ? (beneficioBruto / totalCosteReal) * 100 : 0;

    return { 
      totalCosteReal, 
      pvpFinalConIva: totalPvpConIva, 
      margenGlobalNeto 
    };
  }, [nuevaCaja.items]);

  const guardarCaja = () => {
    if (!nuevaCaja.nombre) {
      alert("debes ponerle un nombre a la caja");
      return;
    }
    if (nuevaCaja.items.length === 0) return;
    setCajasCreadas([...cajasCreadas, { 
      ...nuevaCaja, 
      id: Date.now(), 
      costeRealCaja: resumenCaja.totalCosteReal, // Coste real total de la caja
      pvpFinalCaja: resumenCaja.pvpFinalConIva, // PVP final total de la caja
      analytics: resumenCaja }]);
    setNuevaCaja({ nombre: '', items: [] });
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50">
      {/* SELECTOR DE STOCK */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="font-black text-[11px] uppercase text-slate-400 tracking-[0.15em] mb-6">Stock Disponible</h3>
        <div className="grid gap-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {listaProductos.map(p => (
            <button 
              key={p.id}
              onClick={() => agregarProductoACaja(p)}
              className="flex justify-between items-center p-5 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-md group transition-all text-left"
            >
              <div className="text-left">
                <p className="font-black text-xs uppercase text-slate-700">{p.nombre}</p>
                <p className="text-[10px] text-slate-400 font-bold">Coste Real: {(parseFloat(p.precioCompraConIva) + cargaEstructuraUnidad).toFixed(2)}€</p>
              </div>
              <span className="text-indigo-500 font-black">+</span>
            </button>
          ))}
        </div>
      </div>

      {/* CONFIGURADOR DE LA CAJA */}
      <div className="lg:col-span-3 bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl flex flex-col border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -z-10"></div>
        
        <input 
          placeholder="NOMBRE DEL PACK"
          className="w-full bg-transparent border-b-2 border-slate-800 font-black text-3xl outline-none focus:border-indigo-500 pb-4 text-white placeholder:text-slate-700 uppercase mb-8 transition-colors"
          value={nuevaCaja.nombre}
          onChange={e => setNuevaCaja({...nuevaCaja, nombre: e.target.value})}
        />

        <div className="flex-1 space-y-4 overflow-y-auto mb-6 pr-2">
          {nuevaCaja.items.map(item => (
            <div key={item.idUnico} className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 flex items-center justify-between transition-colors">
              <div className="flex-1">
                <p className="text-[11px] font-black uppercase text-indigo-400 mb-1">{item.nombre}</p>
                <p className="text-[10px] text-slate-500 font-bold">BASE: {item.costeRealUnidad.toFixed(2)}€</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <label className="block text-[8px] font-black text-slate-500 uppercase mb-1">Margen %</label>
                  <input 
                    type="number"
                    value={item.margenDeseado}
                    onChange={(e) => actualizarMargenItem(item.idUnico, e.target.value)}
                    className="w-20 bg-slate-800 border border-slate-700 rounded-xl p-2 text-center font-black text-emerald-400 outline-none focus:border-emerald-500"
                  />
                </div>
                <button onClick={() => eliminarDeCaja(item.idUnico)} className="text-slate-600 hover:text-rose-500 font-bold text-2xl transition-colors px-2">×</button>
              </div>
            </div>
          ))}
          {nuevaCaja.items.length === 0 && (
            <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-[2rem]">
              <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Arrastra o selecciona productos</p>
            </div>
          )}
        </div>

        <div className="pt-8 border-t border-slate-800">
          <div className="grid grid-cols-2 gap-4 mb-6 text-center">
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Margen Neto</label>
              <p className={`text-xl font-black ${resumenCaja.margenGlobalNeto >= 10 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {resumenCaja.margenGlobalNeto.toFixed(1)}%
              </p>
            </div>
            <div className="bg-slate-800 p-3 rounded-xl">
              <label className="block text-[9px] font-black text-emerald-400 uppercase mb-1">PVP FINAL PACK</label>
              <p className="text-2xl font-black text-white">{resumenCaja.pvpFinalConIva.toFixed(2)}€</p>
            </div>
          </div>
          <button 
            onClick={guardarCaja} 
            disabled={nuevaCaja.items.length === 0}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-900 p-4 rounded-2xl font-black uppercase text-sm transition-all"
          >
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreadorCajas;