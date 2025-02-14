import MapView from "./features/MapView";

const reports = [
  { title: "Incidente 1", description: "Árbol caído", lat: -34.6037, lng: -58.3816 },
  { title: "Incidente 2", description: "Accidente de tráfico", lat: -34.6083, lng: -58.3722 },
];

function App() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mapa de Incidentes</h1>
      <MapView reports={reports} />
    </div>
  );
}

export default App;
