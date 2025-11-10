import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAliados, type Aliado } from "../constant/Api";
import AliadoCard from "../components/atoms/AliadoCard";
import InputFilter from "../components/atoms/InputFilter"; // 👈 importa el input

const Dashboard = () => {
  const [aliados, setAliados] = useState<Aliado[]>([]);
  const [filteredAliados, setFilteredAliados] = useState<Aliado[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAliados() {
      const data = await getAliados();
      console.log("Aliados con productos:", data);
      const aliadosData = data.aliados || [];
      setAliados(aliadosData);
      setFilteredAliados(aliadosData); // inicializa la lista filtrada
    }
    fetchAliados();
  }, []);

  const handleAliadoClick = (id: number) => {
    navigate(`/aliados/${id}`);
  };

  // 👇 función que recibe el término del InputFilter
  const handleSearch = (searchTerm: string) => {
    const filtered = aliados.filter((aliado) =>
      aliado.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAliados(filtered);
  };

  return (
    <div className="bg-black min-h-screen p-4 mt-20">
      {/* 🔍 Input de búsqueda */}
      <div className="flex justify-center mb-6">
        <InputFilter onSearch={handleSearch} placeholder="Encuentra tu tienda favorita" />
      </div>

      {/* 🧱 Grid de aliados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredAliados.length > 0 ? (
          filteredAliados.map((aliado) => (
            <AliadoCard
              key={aliado.id}
              id={aliado.id}
              name={aliado.name}
              image={aliado.image}
              onClick={handleAliadoClick}
            />
          ))
        ) : (
          <p className="text-gray-300 text-center col-span-full">
            No se encontraron aliados con ese nombre.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
