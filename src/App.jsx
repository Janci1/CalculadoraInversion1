import { useBusiness } from './context/BusinessContext';
import PanelGastos from './components/PanelGastos';
import FormularioProducto from './components/FormularioProducto';
import TablaResultados from './components/TablaResultados';
import AnalisisRetorno from './components/AnalisisRetorno';
import PlanificadorInversion from './components/PlanificadorInversion'; // Nuevo componente
import CreadorCajas from './components/CreadorCajas';
import ResumenCajasFinales from './components/ResumenCajasFinales';

function App() {
  const { inversionTotal, setInversionTotal } = useBusiness();

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER: CONFIGURACIÓN CENTRAL */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-black text-indigo-950 tracking-tighter uppercase">
              Business Planner <span className="text-indigo-500">v2.0</span>
            </h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              Análisis de Costes, Packs y Retorno
            </p>
          </div>
          
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-indigo-100 min-w-[220px]">
            <label className="block text-[10px] font-black text-indigo-500 uppercase mb-1 tracking-widest">
              Capital Inicial
            </label>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                value={inversionTotal} 
                onChange={(e) => setInversionTotal(e.target.value)} 
                className="text-3xl font-black outline-none w-full text-slate-800 bg-transparent"
              />
              <span className="text-2xl font-bold text-slate-300">€</span>
            </div>
          </div>
        </header>

        {/* CUERPO PRINCIPAL */}
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* COLUMNA IZQUIERDA: GASTOS */}
          <aside className="space-y-6">
            <PanelGastos />
            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <p className="text-[10px] font-black text-indigo-700 uppercase mb-1 underline">Meta de Gestión</p>
              <p className="text-[11px] text-indigo-800 leading-relaxed italic">
                "El sueldo se activa cuando el Crecimiento de Capital supere el colchón de seguridad de 3 meses."
              </p>
            </div>
          </aside>
          
          {/* COLUMNA DERECHA: OPERACIONES */}
          <main className="lg:col-span-3 space-y-10">
            
            {/* 1. Entrada de Stock */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded">1</span>
                <h2 className="font-black text-xs uppercase text-slate-500 tracking-widest">Definir Productos Base</h2>
              </div>
              <FormularioProducto />
            </section>

            {/* 2. Creador de Cajas (Packs) */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded">2</span>
                <h2 className="font-black text-xs uppercase text-slate-500 tracking-widest">Configurador de Cajas / Packs</h2>
              </div>
              <CreadorCajas />
            </section>
            
            {/* 3. Planificador de Inversión (NUEVO) */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded">3</span>
                <h2 className="font-black text-xs uppercase text-slate-500 tracking-widest">Planificar Inversión en Cajas</h2>
              </div>
              <PlanificadorInversion />
            </section>

            {/* 3.5 Resumen Final (Solo aparece tras calcular) */}
            <section>
              <ResumenCajasFinales />
            </section>

            {/* 4. Proyección de Retorno */}
            <section>
              <AnalisisRetorno />
            </section>

            {/* 5. Detalle de Stock */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded">4</span>
                <h2 className="font-black text-xs uppercase text-slate-500 tracking-widest">Inventario y Márgenes Individuales</h2>
              </div>
              <TablaResultados />
            </section>

          </main>
        </div>

        <footer className="mt-20 pb-10 text-center border-t border-slate-200 pt-8 opacity-50">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            Estrategia de Capitalización • No Filtros • Foco Estructurado
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;