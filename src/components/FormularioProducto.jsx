import { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';

const FormularioProducto = () => {
  const { setListaProductos, listaProductos } = useBusiness();
  const [prod, setProd] = useState({
    nombre: "",
    precioCompraConIva: 0,
    // porcentajeInversion: 100, // Eliminado, la inversión se hace en cajas
    ivaProveedor: 21
  });

  const agregar = () => {
    if (!prod.nombre || prod.precioCompraConIva <= 0) return;
    
    // Añadimos a la lista global. 
    // Los cálculos de unidades y estructura se hacen solos en el Contexto.
    setListaProductos([...listaProductos, { ...prod, id: Date.now(), pvpManual: "", porcentajeInversion: 0 }]); 
    setProd({ ...prod, nombre: "", precioCompraConIva: 0 });
  };

  return (
    <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl border border-slate-800">
      <h3 className="text-xs font-black uppercase text-indigo-400 mb-6 tracking-[0.2em] flex items-center gap-2">
        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
        Simular Nuevo Producto
      </h3>
      <div className="grid md:grid-cols-4 gap-4 items-end">
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-black text-slate-500 ml-1">Nombre del artículo</label>
          <input 
            type="text" 
            value={prod.nombre} 
            onChange={e => setProd({...prod, nombre: e.target.value})} 
            className="w-full bg-slate-800/50 p-3 rounded-xl outline-none border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600" 
            placeholder="Ej: Producto A"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-black text-slate-500 ml-1">Precio Compra (IVA Inc.)</label>
          <input 
            type="number" 
            value={prod.precioCompraConIva} 
            onChange={e => setProd({...prod, precioCompraConIva: e.target.value})} 
            className="w-full bg-slate-800/50 p-3 rounded-xl outline-none border border-slate-700 focus:border-indigo-500 transition-all" 
          />
        </div>
        <button 
          onClick={agregar} 
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3 px-6 rounded-xl uppercase text-[11px] transition-all shadow-lg active:scale-95 border border-indigo-400/20"
        >
          Añadir a simulación
        </button>
      </div>
    </div>
  );
};

export default FormularioProducto;