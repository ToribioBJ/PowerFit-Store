import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../../../context/StoreContext';
import type { Product } from '../../../interfaces';
import { ProductCard } from '../../Catalog/Catalog';
import { FaTimes, FaSave, FaEye } from 'react-icons/fa';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, product }) => {
  const { categories, addProduct, updateProduct } = useStore();

  // Form states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Proteínas');
  const [formPrice, setFormPrice] = useState(150);
  const [formBrand, setFormBrand] = useState('PowerFit');
  const [formDiscount, setFormDiscount] = useState(0);
  const [formImage, setFormImage] = useState('/src/assets/PROTEINAS/CLASSIC WHEY.png');
  const [formHoverImage, setFormHoverImage] = useState('/src/assets/PROTEINAS/CACLASSIC WHEY.png');
  const [formDescription, setFormDescription] = useState('Descripción premium del suplemento.');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formStock, setFormStock] = useState(15);
  const [formProtein, setFormProtein] = useState('25g');
  const [formCarbs, setFormCarbs] = useState('2g');
  const [formFats, setFormFats] = useState('1g');
  const [formCalories, setFormCalories] = useState('120 kcal');

  useEffect(() => {
    if (product) {
      setFormName(product.name);
      setFormCategory(product.category);
      setFormPrice(product.price);
      setFormBrand(product.brand);
      setFormDiscount(product.discount);
      setFormImage(product.image);
      setFormHoverImage(product.hoverImage);
      setFormDescription(product.description);
      setFormFeatured(product.featured);
      setFormStock(product.stock);
      setFormProtein(product.nutrition?.protein || '0g');
      setFormCarbs(product.nutrition?.carbs || '0g');
      setFormFats(product.nutrition?.fats || '0g');
      setFormCalories(product.nutrition?.calories || '0 kcal');
    } else {
      setFormName('');
      setFormCategory(categories[0]?.name || 'Proteínas');
      setFormPrice(150);
      setFormBrand('PowerFit');
      setFormDiscount(0);
      setFormImage('/src/assets/PROTEINAS/CLASSIC WHEY.png');
      setFormHoverImage('/src/assets/PROTEINAS/CACLASSIC WHEY.png');
      setFormDescription('Descripción premium del suplemento.');
      setFormFeatured(false);
      setFormStock(15);
      setFormProtein('25g');
      setFormCarbs('2g');
      setFormFats('1g');
      setFormCalories('120 kcal');
    }
  }, [product, categories, isOpen]);

  // Live Card Preview Data Object
  const previewProduct = useMemo<Product>(() => {
    return {
      id: product ? product.id : 9999,
      name: formName || 'Nombre del Suplemento',
      category: formCategory,
      price: Number(formPrice) || 0,
      brand: formBrand || 'Marca',
      discount: Number(formDiscount) || 0,
      image: formImage || 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=400',
      hoverImage: formHoverImage || formImage || 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=400',
      description: formDescription || 'Breve descripción del suplemento deportivo.',
      featured: formFeatured,
      stock: Number(formStock) || 0,
      nutrition: {
        protein: formProtein,
        carbs: formCarbs,
        fats: formFats,
        calories: formCalories
      }
    };
  }, [
    product,
    formName,
    formCategory,
    formPrice,
    formBrand,
    formDiscount,
    formImage,
    formHoverImage,
    formDescription,
    formFeatured,
    formStock,
    formProtein,
    formCarbs,
    formFats,
    formCalories
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productPayload = {
      name: formName,
      category: formCategory,
      price: Number(formPrice),
      brand: formBrand,
      discount: Number(formDiscount),
      image: formImage,
      hoverImage: formHoverImage,
      description: formDescription,
      featured: formFeatured,
      stock: Number(formStock),
      nutrition: {
        protein: formProtein,
        carbs: formCarbs,
        fats: formFats,
        calories: formCalories
      }
    };

    if (product) {
      updateProduct({ ...productPayload, id: product.id });
    } else {
      addProduct(productPayload);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn overflow-y-auto">
      {/* Main Modal Layout (Splits into 2 Column workspace) */}
      <div className="bg-secondary border border-border-brand/40 rounded-2xl w-full max-w-6xl shadow-2xl flex flex-col lg:flex-row overflow-hidden max-h-[90vh]">

        {/* Modal Left Column: Forms */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto border-b lg:border-b-0 lg:border-r border-border-brand/40">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-title font-extrabold uppercase text-gradient flex items-center gap-2">
              <span className="w-2 h-2 bg-accent rounded-full animate-ping"></span>
              {product ? `Editar Suplemento #${product.id}` : 'Nuevo Suplemento'}
            </h3>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary p-2 rounded-full hover:bg-primary/20 transition-all cursor-pointer"
            >
              <FaTimes size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-[0.68rem] uppercase text-text-secondary font-black tracking-widest">Nombre del Producto</label>
              <input
                type="text"
                required
                placeholder="e.g. Beef XP Clear Protein Isolate"
                className="bg-primary/50 border border-border-brand/50 text-text-primary placeholder:text-text-muted/40 py-2.5 px-4 rounded-xl text-sm outline-none focus:border-accent/80 focus:bg-primary/70 focus:ring-1 focus:ring-accent/40 focus:shadow-glow-accent transition-all duration-300"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            {/* Category & Brand */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.68rem] uppercase text-text-secondary font-black tracking-widest">Categoría</label>
              <select
                className="bg-primary/50 border border-border-brand/50 text-text-primary py-2.5 px-4 rounded-xl text-sm outline-none cursor-pointer focus:border-accent/80 focus:bg-primary/70 transition-all duration-300"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.name} className="bg-secondary text-text-primary">{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.68rem] uppercase text-text-secondary font-black tracking-widest">Marca</label>
              <input
                type="text"
                required
                placeholder="e.g. Applied Nutrition"
                className="bg-primary/50 border border-border-brand/50 text-text-primary placeholder:text-text-muted/40 py-2.5 px-4 rounded-xl text-sm outline-none focus:border-accent/80 focus:bg-primary/70 focus:ring-1 focus:ring-accent/40 focus:shadow-glow-accent transition-all duration-300"
                value={formBrand}
                onChange={(e) => setFormBrand(e.target.value)}
              />
            </div>

            {/* Price, Discount & Stock */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.68rem] uppercase text-text-secondary font-black tracking-widest">Precio de Lista (S/)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                placeholder="299.00"
                className="bg-primary/50 border border-border-brand/50 text-text-primary placeholder:text-text-muted/40 py-2.5 px-4 rounded-xl text-sm outline-none focus:border-accent/80 focus:bg-primary/70 focus:ring-1 focus:ring-accent/40 focus:shadow-glow-accent transition-all duration-300"
                value={formPrice || ''}
                onChange={(e) => setFormPrice(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.68rem] uppercase text-text-secondary font-black tracking-widest">Descuento (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="0"
                className="bg-primary/50 border border-border-brand/50 text-text-primary placeholder:text-text-muted/40 py-2.5 px-4 rounded-xl text-sm outline-none focus:border-accent/80 focus:bg-primary/70 focus:ring-1 focus:ring-accent/40 focus:shadow-glow-accent transition-all duration-300"
                value={formDiscount || ''}
                onChange={(e) => setFormDiscount(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.68rem] uppercase text-text-secondary font-black tracking-widest">Stock</label>
              <input
                type="number"
                required
                min="0"
                placeholder="15"
                className="bg-primary/50 border border-border-brand/50 text-text-primary placeholder:text-text-muted/40 py-2.5 px-4 rounded-xl text-sm outline-none focus:border-accent/80 focus:bg-primary/70 focus:ring-1 focus:ring-accent/40 focus:shadow-glow-accent transition-all duration-300"
                value={formStock || ''}
                onChange={(e) => setFormStock(Number(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-2.5 mt-6">
              <input
                type="checkbox"
                id="featured"
                className="w-4 h-4 accent-accent bg-primary/45 border border-border-brand rounded cursor-pointer"
                checked={formFeatured}
                onChange={(e) => setFormFeatured(e.target.checked)}
              />
              <label htmlFor="featured" className="text-xs uppercase text-text-primary font-title font-black tracking-widest cursor-pointer hover:text-accent transition-colors duration-200">
                Destacar en Portada
              </label>
            </div>

            {/* Images */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.68rem] uppercase text-text-secondary font-black tracking-widest">URL Imagen Frontal</label>
              <input
                type="text"
                required
                placeholder="/src/assets/..."
                className="bg-primary/50 border border-border-brand/50 text-text-primary placeholder:text-text-muted/40 py-2.5 px-4 rounded-xl text-sm outline-none focus:border-accent/80 focus:bg-primary/70 focus:ring-1 focus:ring-accent/40 focus:shadow-glow-accent transition-all duration-300"
                value={formImage}
                onChange={(e) => setFormImage(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.68rem] uppercase text-text-secondary font-black tracking-widest">URL Imagen Ficha (Nutricional)</label>
              <input
                type="text"
                required
                placeholder="/src/assets/..."
                className="bg-primary/50 border border-border-brand/50 text-text-primary placeholder:text-text-muted/40 py-2.5 px-4 rounded-xl text-sm outline-none focus:border-accent/80 focus:bg-primary/70 focus:ring-1 focus:ring-accent/40 focus:shadow-glow-accent transition-all duration-300"
                value={formHoverImage}
                onChange={(e) => setFormHoverImage(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-[0.68rem] uppercase text-text-secondary font-black tracking-widest">Descripción</label>
              <textarea
                rows={3}
                placeholder="Detalles y benefits clave del suplemento..."
                className="bg-primary/50 border border-border-brand/50 text-text-primary placeholder:text-text-muted/40 py-2.5 px-4 rounded-xl text-sm outline-none resize-none focus:border-accent/80 focus:bg-primary/70 focus:ring-1 focus:ring-accent/40 focus:shadow-glow-accent transition-all duration-300"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>

            {/* Nutrition Facts */}
            <div className="md:col-span-2 border-t border-border-brand/30 pt-4 mt-2">
              <h4 className="text-xs font-title font-extrabold uppercase tracking-widest text-accent mb-3.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping"></span>
                Información Nutricional (Ficha Técnica)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[0.6rem] uppercase text-text-secondary font-bold">Proteína</label>
                  <input
                    type="text"
                    placeholder="27g"
                    className="bg-primary/50 border border-border-brand/50 text-text-primary py-2 px-3 rounded-lg text-xs outline-none focus:border-accent/80 focus:bg-primary/70 transition-all"
                    value={formProtein}
                    onChange={(e) => setFormProtein(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[0.6rem] uppercase text-text-secondary font-bold">Carbos</label>
                  <input
                    type="text"
                    placeholder="0g"
                    className="bg-primary/50 border border-border-brand/50 text-text-primary py-2 px-3 rounded-lg text-xs outline-none focus:border-accent/80 focus:bg-primary/70 transition-all"
                    value={formCarbs}
                    onChange={(e) => setFormCarbs(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[0.6rem] uppercase text-text-secondary font-bold">Grasas</label>
                  <input
                    type="text"
                    placeholder="0g"
                    className="bg-primary/50 border border-border-brand/50 text-text-primary py-2 px-3 rounded-lg text-xs outline-none focus:border-accent/80 focus:bg-primary/70 transition-all"
                    value={formFats}
                    onChange={(e) => setFormFats(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[0.6rem] uppercase text-text-secondary font-bold">Calorías</label>
                  <input
                    type="text"
                    placeholder="110 kcal"
                    className="bg-primary/50 border border-border-brand/50 text-text-primary py-2 px-3 rounded-lg text-xs outline-none focus:border-accent/80 focus:bg-primary/70 transition-all"
                    value={formCalories}
                    onChange={(e) => setFormCalories(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Form Buttons */}
            <div className="md:col-span-2 border-t border-border-brand/30 pt-5 mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary py-2 px-5 text-xs font-extrabold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary py-2 px-5 text-xs font-extrabold shadow-glow cursor-pointer"
              >
                <FaSave /> Guardar Suplemento
              </button>
            </div>
          </form>
        </div>

        {/* Modal Right Column: Live Product Card Preview */}
        <div className="hidden lg:flex lg:w-[380px] bg-primary/30 p-6 md:p-8 flex-col justify-center items-center gap-4 relative overflow-y-auto border-l border-border-brand/35 shrink-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(146,58,43,0.06)_0%,transparent_75%)] pointer-events-none" />
          <div className="absolute top-4 left-4 text-[0.62rem] uppercase font-black tracking-widest text-accent bg-accent/15 border border-accent/25 rounded-full flex items-center gap-1 shadow-[0_0_10px_rgba(146,58,43,0.2)] animate-pulse">
            <FaEye /> Vista Previa en Vivo
          </div>

          {/* Renders exact style from store catalog inside a glowing stand */}
          <div className="relative w-full max-w-[280px] mt-6 group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-accent to-[#b34835] rounded-2xl blur-md opacity-15 pointer-events-none" />
            <div className="relative">
              <ProductCard
                product={previewProduct}
                getFinalPrice={(p) => p.price * (1 - p.discount / 100)}
                addToCart={() => { }}
              />
            </div>
          </div>
          <p className="text-[0.62rem] text-text-muted uppercase font-bold tracking-widest text-center mt-3 max-w-[240px] leading-relaxed">
            Esta tarjeta se renderiza con los estilos y comportamientos exactos del catálogo público
          </p>
        </div>

      </div>
    </div>
  );
};

export default ProductFormModal;
