// hooks/useDebounce.js
import { useState, useEffect } from "react";

// Este hook retrasa la actualización de un valor
export function useDebounce(value, delay) {
  // Estado interno para el valor con retardo
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Establecer un temporizador (timer)
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancelar el temporizador si el valor cambia (es decir, el usuario sigue escribiendo)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Solo se re-ejecuta si 'value' o 'delay' cambian

  return debouncedValue;
}
