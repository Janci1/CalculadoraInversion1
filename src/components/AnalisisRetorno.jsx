import { useBusiness } from '../context/BusinessContext';

const AnalisisRetorno = () => {
  const { 
    planInversion,
    cajasCreadas,
    inversionTotal, 
    totalGastosEstructura, 
    cargaEstructuraUnidad,
    unidadesTotalesProyecto
  } = useBusiness();

  // --- CÁLCULOS DE CICLO COMPLETO ---
  const proyeccion = planInversion.reduce((acc, plan) => {
    // Si no hay impacto calculado aún, no proyectamos retornos
    if (unidadesTotalesProyecto === 0) return acc;

    const caja = cajasCreadas.find(c => c.id === plan.cajaId);
    if (!caja) return acc;

    const dineroDestinado = inversionTotal * (plan.porcentaje / 100);
    const costeProveedorCaja = caja.items.reduce((sum, i) => sum + parseFloat(i.precioCompraConIva || 0), 0);
    const qCajas = Math.floor(dineroDestinado / (costeProveedorCaja || 1));
    
    const ventasBrutasCaja = caja.pvpFinalCaja * qCajas;
    // Simplificación de IVA para el total de la caja
    const ivaReservaCaja = (caja.pvpFinalCaja - (caja.pvpFinalCaja / 1.21)) * qCajas;

    // Beneficio Limpio del lote = Diferencia entre PVP Final y Coste Real (Proveedor + Impacto)
    const beneficioLimpioLote = (caja.pvpFinalCaja - (costeProveedorCaja + (caja.items.length * cargaEstructuraUnidad))) * qCajas;

    return {
      bruto: acc.bruto + ventasBrutasCaja,
      iva: acc.iva + ivaReservaCaja,
      limpio: acc.limpio + beneficioLimpioLote,
      unidades: acc.unidades + (qCajas * caja.items.length)
    };
  }, { bruto: 0, iva: 0, limpio: 0, unidades: 0 });

  const capitalTrasCiclo = proyeccion.bruto - proyeccion.iva - totalGastosEstructura;
  const crecimientoCapital = capitalTrasCiclo - inversionTotal;

  return (
    <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl border border-slate-800">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter text-emerald-400">Punto Idílico</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase">Simulación de venta 100% stock</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          <span className="text-emerald-400 text-[10px] font-black italic">CICLO COMPLETADO</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* CAJA A: CAJA FINAL */}
        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
          <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">Caja Final (Post-Impuestos)</label>
          <p className="text-2xl font-black">{capitalTrasCiclo.toFixed(2)}€</p>
          <p className="text-[10px] text-slate-400 mt-1 italic">Dinero real disponible en cuenta</p>
        </div>

        {/* CAJA B: RENDIMIENTO */}
        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
          <label className="block text-[9px] font-black text-slate-500 uppercase mb-1">Crecimiento de Capital</label>
          <p className={`text-2xl font-black ${crecimientoCapital >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
            {crecimientoCapital >= 0 ? '+' : ''}{crecimientoCapital.toFixed(2)}€
          </p>
          <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">Tras pagar gastos fijos</p>
        </div>

        {/* CAJA C: MÉTRICA DE ÉXITO */}
        <div className="bg-emerald-600 p-4 rounded-2xl shadow-inner flex flex-col justify-center">
          <label className="block text-[9px] font-black text-emerald-200 uppercase mb-1">Ratio de Reinversión</label>
          <p className="text-3xl font-black text-white">
            {inversionTotal > 0 ? ((capitalTrasCiclo / inversionTotal) * 100).toFixed(0) : 0}%
          </p>
          <p className="text-[9px] text-emerald-100 font-medium">Capacidad de compra ciclo 2</p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4">
        <MiniStat label="Venta Bruta" value={`${proyeccion.bruto.toFixed(2)}€`} />
        <MiniStat label="IVA a Reservar" value={`${proyeccion.iva.toFixed(2)}€`} color="text-rose-400" />
        <MiniStat label="Gastos Fijos" value={`${totalGastosEstructura.toFixed(2)}€`} color="text-orange-400" />
        <MiniStat label="Unidades Vendidas" value={proyeccion.unidades} />
      </div>

      {crecimientoCapital <= 0 && (
        <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
          <p className="text-xs text-rose-400 font-bold uppercase tracking-widest">
            ⚠️ Alerta: El margen no cubre los gastos fijos. Estás perdiendo capital.
          </p>
        </div>
      )}
    </div>
  );
};

const MiniStat = ({ label, value, color = "text-slate-300" }) => (
  <div>
    <span className="block text-[8px] font-black text-slate-500 uppercase">{label}</span>
    <span className={`text-xs font-mono font-bold ${color}`}>{value}</span>
  </div>
);

export default AnalisisRetorno;