import { useState, useMemo, useEffect } from 'react';
import { BusinessContext } from './BusinessContext';

// Helper to load from localStorage
const cargarDeLocalStorage = (key, valorDefecto) => {
  const guardado = localStorage.getItem(key);
  return guardado ? JSON.parse(guardado) : valorDefecto;
};

export const BusinessProvider = ({ children }) => {
  const [inversionTotal, setInversionTotal] = useState(() => cargarDeLocalStorage('inversion', 2000));
  const [listaProductos, setListaProductos] = useState(() => cargarDeLocalStorage('productos', []));
  const [cajasCreadas, setCajasCreadas] = useState(() => cargarDeLocalStorage('cajas', []));
  const [planInversion, setPlanInversion] = useState(() => cargarDeLocalStorage('planInversion', []));
  const [unidadesTotalesProyecto, setUnidadesTotalesProyecto] = useState(0);
  
  const [fijos, setFijos] = useState(() => cargarDeLocalStorage('gastosFijos', {
    alquiler: 200,
    autonomos: 80,
    otros: 100,
    sueldo: 0,
  }));

  useEffect(() => {
    localStorage.setItem('inversion', JSON.stringify(inversionTotal));
    localStorage.setItem('productos', JSON.stringify(listaProductos));
    localStorage.setItem('cajas', JSON.stringify(cajasCreadas));
    localStorage.setItem('planInversion', JSON.stringify(planInversion));
    localStorage.setItem('gastosFijos', JSON.stringify(fijos));
  }, [inversionTotal, listaProductos, cajasCreadas, planInversion, fijos]);

  const totalGastosEstructura = useMemo(() => {
    return Object.values(fijos).reduce((acc, curr) => acc + parseFloat(curr || 0), 0);
  }, [fijos]);

  const confirmarPlanInversion = () => {
    let totalUnidades = 0;
    planInversion.forEach(itemInversion => {
      const caja = cajasCreadas.find(c => c.id === itemInversion.cajaId);
      if (caja) {
        const dineroDestinado = inversionTotal * (itemInversion.porcentaje / 100);
        const costeProveedorCaja = caja.items.reduce((acc, i) => acc + parseFloat(i.precioCompraConIva || 0), 0);
        const unidadesCajaComprables = Math.floor(dineroDestinado / (costeProveedorCaja || 1));
        totalUnidades += unidadesCajaComprables * caja.items.length;
      }
    });
    setUnidadesTotalesProyecto(totalUnidades);
  };

  const cargaEstructuraUnidad = useMemo(() => {
    if (unidadesTotalesProyecto === 0) return 0;
    return totalGastosEstructura / unidadesTotalesProyecto;
  }, [totalGastosEstructura, unidadesTotalesProyecto]);

  const value = {
    inversionTotal, setInversionTotal,
    listaProductos, setListaProductos,
    fijos, setFijos,
    totalGastosEstructura,
    cargaEstructuraUnidad,
    unidadesTotalesProyecto,
    cajasCreadas, setCajasCreadas,
    planInversion, setPlanInversion,
    confirmarPlanInversion
  };

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
};