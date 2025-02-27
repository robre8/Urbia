import { Button } from "@/components/ui/button";

export function AddressCard({ address, loadingAddress, addressError }) {
  if (loadingAddress) {
    return <div className="p-4 text-sm text-gray-500">Convirtiendo coordenadas a dirección...</div>;
  }

  if (addressError) {
    return <div className="p-4 text-sm text-red-500">Error obteniendo dirección: {addressError}</div>;
  }

  if (!address) {
    return <div className="p-4 text-sm text-gray-500">No se encontró dirección</div>;
  }

  return (
    <Button
      variant="white"
      size="pill"
     
      className="cursor-text focus:outline-none focus:ring-0 pointer-events-auto"
    >
      {address}
    </Button>
  );
}
