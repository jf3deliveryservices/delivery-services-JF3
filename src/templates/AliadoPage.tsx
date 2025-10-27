import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Menu from "../components/organisms/Menu";
import { useCart } from "../hooks/useCart";
import { getAliados } from "../constant/Api";
import type { Product, Category } from "../constant/data";
import InputFilter from "../components/atoms/InputFilter";
import FilterCategories from "../components/molecules/FilterCategories";

const AliadoPage = () => {
  const { id } = useParams();
  const aliadoId = Number(id);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [aliadoName, setAliadoName] = useState<string>("");
  const [activeCategories, setActiveCategories] = useState<Category[]>([]);
  const { addToCart } = useCart();

  // ✅ Obtener productos del aliado
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAliados();
        const aliado = data.aliados.find((a: any) => a.id === aliadoId);

        if (aliado) {
          setAliadoName(aliado.name || "");
          setProducts(aliado.products || []);
          setFilteredProducts(aliado.products || []);
        } else {
          setAliadoName("");
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (error) {
        console.error("Error al cargar productos del aliado:", error);
      }
    };

    if (aliadoId) fetchProducts();
  }, [aliadoId]);

  // ✅ Filtro por texto (memoizado)
  const handleSearch = useCallback(
    (searchTerm: string) => {
      let filtered = products.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (activeCategories.length > 0) {
        filtered = filtered.filter((product) =>
          activeCategories.some((cat) => cat.id === product.categoryId)
        );
      }

      setFilteredProducts(filtered);
    },
    [products, activeCategories]
  );

  // ✅ Filtro por categorías (memoizado)
  const handleCategoryFilter = useCallback(
    (filteredCategories: Category[]) => {
      setActiveCategories(filteredCategories);

      let filtered = products;

      if (filteredCategories.length > 0) {
        filtered = products.filter((product) =>
          filteredCategories.some((cat) => cat.id === product.categoryId)
        );
      }

      setFilteredProducts(filtered);
    },
    [products]
  );

  return (
    <section className="flex flex-col items-center pt-16 w-full">
      <h2 className="text-4xl md:text-3xl lg:text-4xl font-bold mb-6 text-secundary text-center">
        {aliadoName || "Productos del aliado"}
      </h2>

      {/* 🔍 Filtros */}
      <div className="flex flex-row md:flex-row items-center justify-center gap-4 mb-6 z-50">
        <InputFilter onSearch={handleSearch} placeholder="Buscar producto" />
        <FilterCategories onFilter={handleCategoryFilter} aliadoId={aliadoId} />
      </div>

      {/* 🧱 Lista de productos */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-auto gap-6 p-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Menu key={product.id} products={[product]} addToCart={addToCart} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-400">
            No hay productos disponibles con los filtros seleccionados.
          </p>
        )}
      </div>
    </section>
  );
};

export default AliadoPage;
