import { useBusiness } from '../context/BusinessContext';

const TablaResultados = () => { // Este componente ahora mostrará los productos base y sus costes
  const { listaProductos, setListaProductos, cargaEstructuraUnidad } = useBusiness();

  const actualizarCampo = (id, campo, valor) => {
    const nuevaLista = listaProductos.map(p => 
      p.id === id ? { ...p, [campo]: valor } : p
    );
    setListaProductos(nuevaLista);
  };

  const eliminarProducto = (id) => {
    setListaProductos(listaProductos.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
     {listaProductos.map((p) => {
        // --- LÓGICA DE IVA Y GANANCIA ---
        const tipoIva = parseFloat(p.tipoIva) || 21; 
        const factorIva = 1 + (tipoIva / 100);

        const precioCompraConIva = parseFloat(p.precioCompraConIva || 0); // Precio de proveedor
        const costeRealTotal = precioCompraConIva + cargaEstructuraUnidad;
        
        const pvpFinal = parseFloat(p.pvpManual) || (costeRealTotal * 1.30); // PVP sugerido o manual

        // Cálculos Netos
        const pvpSinIva = pvpFinal / factorIva;
        const precioCompraSinIva = precioCompraConIva / factorIva;

        // Impuestos
        const cuotaIvaCobrado = pvpFinal - pvpSinIva;
        const cuotaIvaPagado = precioCompraConIva - precioCompraSinIva;
        const balanceIvaUnidad = cuotaIvaCobrado - cuotaIvaPagado;

        // --- TU FÓRMULA APLICADA ---
        // Ganancia = PVP - Balance IVA - (Compra sin IVA + Impacto)
        const gananciaUnidad = pvpFinal - balanceIvaUnidad - (precioCompraSinIva + cargaEstructuraUnidad); // Ganancia si se vende a PVP Final
        const margenReal = ((pvpFinal - costeRealTotal) / costeRealTotal) * 100;

        return (
          <div key={p.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
            
            {/* CABECERA: IDENTIFICACIÓN Y COSTES */}
            <div className="flex flex-wrap items-center gap-4 p-4 bg-slate-50 border-b border-slate-100 justify-between">
              <div className="flex-1 min-w-[180px]">
                <h3 className="font-black text-slate-800 uppercase text-sm">{p.nombre}</h3>
                <div className="flex gap-2 mt-1">
                  <select 
                    value={tipoIva} 
                    onChange={(e) => actualizarCampo(p.id, 'tipoIva', e.target.value)}
                    className="text-[10px] bg-white border border-slate-300 rounded px-1 font-bold text-slate-500 outline-none"
                  >
                    <option value="21">IVA 21% (Accesorios)</option>
                    <option value="10">IVA 10% (Alimentación)</option>
                    <option value="0">IVA 0% (Exento)</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-6 items-center flex-1 justify-end">
                <DataField label="Compra (c/iva)" value={`${precioCompraConIva.toFixed(2)}€`} />
                {cargaEstructuraUnidad > 0 ? (
                  <>
                    <DataField label="Impacto Est." value={`+${cargaEstructuraUnidad.toFixed(2)}€`} color="text-indigo-400" />
                    <div className="bg-indigo-600 px-4 py-2 rounded-lg shadow-sm text-center min-w-[100px]">
                      <label className="block text-[9px] font-black text-indigo-200 uppercase mb-1">Coste Real</label>
                      <p className="font-mono text-sm leading-none text-white font-black">{costeRealTotal.toFixed(2)}€</p>
                    </div>
                  </>
                ) : (
                  <div className="bg-slate-100 px-4 py-2 rounded-lg text-center min-w-[100px]">
                    <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Impacto</label>
                    <p className="text-[10px] text-slate-500 font-bold italic">Aún por definir</p>
                  </div>
                )}
                <button 
                  onClick={() => eliminarProducto(p.id)} 
                  className="text-slate-400 hover:text-rose-500 font-bold text-2xl transition-colors pl-2"
                  title="Eliminar producto"
                >
                  ×
                </button>
              </div>
            </div>

            {/* CUERPO: VENTA, MARGEN Y GANANCIA */}
            <div className="flex flex-wrap items-center gap-4 p-4 bg-white justify-between">
              <div className="flex-1 min-w-[200px] flex items-center gap-6">
                <div className="flex-1 max-w-[140px]">
                  <label className="block text-[9px] font-black text-indigo-500 uppercase mb-1">PVP Venta (€)</label>
                  <input 
                    type="number" 
                    value={p.pvpManual} 
                    onChange={(e) => actualizarCampo(p.id, 'pvpManual', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded font-black text-slate-800 outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 min-w-[120px] text-center">
                   <label className="block text-[9px] font-black text-emerald-600 uppercase mb-1 tracking-widest">Tu Ganancia</label>
                   <p className="font-mono font-black text-xl text-emerald-700">{gananciaUnidad.toFixed(2)}€</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-8 items-center text-center">
                <div className="min-w-[90px]">
                  <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 tracking-tighter">Margen %</label>
                  <p className={`font-mono text-lg font-black ${margenReal >= 10 ? "text-emerald-600" : "text-rose-500"}`}>
                    {margenReal.toFixed(1)}%
                  </p>
                </div>
                <DataField label="Base (s/IVA)" value={`${pvpSinIva.toFixed(2)}€`} />
                <DataField label="Balance IVA" value={`${balanceIvaUnidad.toFixed(2)}€`} color="text-slate-400 font-bold" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const DataField = ({ label, value, color = "text-slate-700" }) => (
  <div className="text-center min-w-[90px]">
    <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 tracking-tighter">{label}</label>
    <p className={`font-mono text-sm leading-none ${color}`}>{value}</p>
  </div>
);

export default TablaResultados;