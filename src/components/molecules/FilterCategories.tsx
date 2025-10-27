import { useState, useEffect, useRef, useCallback } from "react";
import { type Category } from "../../constant/data";
import ButtonFilter from "../atoms/ButtonFilter";
import FilterMenu from "./FilterMenu";
import { getAllCategories } from "../../constant/Api";

interface FilterCategoriesProps {
  onFilter: (filteredCategories: Category[]) => void;
  aliadoId: number;
}

const FilterCategories = ({ onFilter, aliadoId }: FilterCategoriesProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  // ✅ Cargar categorías del aliado una sola vez
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const allCategories = await getAllCategories();
        const aliadoCategories = allCategories.filter(
          (cat) => cat.aliadoId === aliadoId
        );
        // Ensure each category has a products array to satisfy Category type
        setCategories(
          aliadoCategories.map((cat) => ({
            ...cat,
            products: (cat as any).products ?? [],
          }))
        );
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };

    if (aliadoId) fetchCategories();
  }, [aliadoId]);

  // ✅ Manejo de selección
  const handleCategoryChange = useCallback((category: string): void => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((cat) => cat !== category)
        : [...prevSelected, category]
    );
  }, []);

  // ✅ Llamar a onFilter solo cuando cambie selectedCategories
  useEffect(() => {
    const filteredCategories = categories.filter(
      (category) =>
        selectedCategories.length === 0 ||
        selectedCategories.includes(category.name)
    );
    onFilter(filteredCategories);
  }, [selectedCategories, categories]); // <-- sin incluir onFilter aquí

  // ✅ Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef}>
      <ButtonFilter onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />
      {isOpen && (
        <div>
          <FilterMenu
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      )}
    </div>
  );
};

export default FilterCategories;
