import { create } from 'zustand';

const useMapStore = create((set) => ({
  selectedCoords: null,
  setSelectedCoords: (coords) => {
    set({ selectedCoords: coords });
    localStorage.setItem('selectedCoords', JSON.stringify(coords)); // Guardar en localStorage
  },
  loadStoredCoords: () => {
    const storedCoords = localStorage.getItem('selectedCoords');
    if (storedCoords) {
      set({ selectedCoords: JSON.parse(storedCoords) });
    }
  }
}));

export default useMapStore;
