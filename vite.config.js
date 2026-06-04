import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/CalculadoraInversion1/', // Asegúrate de que esto coincida con el nombre de tu repositorio
})
