// AddressCard.jsx

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
    <div className="max-w-xs bg-white shadow rounded-3xl p-4">
{/*       <p className="text-gray-700 font-medium">Tu ubicación aproximada:</p> */}
      <p className="text-gray-900 text-sm">{address}</p>
    </div>
  );
}
