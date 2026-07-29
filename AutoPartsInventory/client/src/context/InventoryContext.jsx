import React, { createContext, useContext, useState, useEffect } from 'react';
import { inventoryApi, categoryApi, supplierApi } from '../services/api';
import { getStockStatus } from '../utils/stock';

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

const SALE_HISTORY_KEY = 'autoparts-sale-history';

const buildStats = (inventory) => {
  const totalValue = inventory.reduce((sum, part) => sum + ((Number(part.quantity) || 0) * (Number(part.costPrice) || 0)), 0);
  const lowStockCount = inventory.filter((part) => getStockStatus(part.quantity, part.minStockLevel).status === 'Low Stock').length;
  const outOfStockCount = inventory.filter((part) => getStockStatus(part.quantity, part.minStockLevel).status === 'Out of Stock').length;

  return {
    totalParts: inventory.length,
    totalValue,
    lowStockCount,
    outOfStockCount,
  };
};

const normalizePart = (part) => ({
  ...part,
  quantity: Number(part.quantity) || 0,
  minStockLevel: Number(part.minStockLevel) || 0,
  costPrice: Number(part.costPrice) || 0,
  sellingPrice: Number(part.sellingPrice) || 0,
  status: getStockStatus(part.quantity, part.minStockLevel).status,
});

export const InventoryProvider = ({ children }) => {
  const [parts, setParts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [stats, setStats] = useState({ totalParts: 0, totalValue: 0, lowStockCount: 0, outOfStockCount: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saleHistory, setSaleHistory] = useState(() => {
    try {
      const stored = localStorage.getItem(SALE_HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const getListData = (res) => {
    const payload = res.data?.data ?? res.data?.parts ?? res.data;
    return Array.isArray(payload) ? payload : [];
  };

  const getItemData = (res) => res.data?.data ?? res.data ?? {};

  const updatePartsState = (updater) => {
    setParts((prev) => {
      const next = updater(prev).map((part) => normalizePart(part));
      setStats(buildStats(next));
      return next;
    });
  };

  const fetchParts = async (params = {}) => {
    setLoading(true);
    try {
      const res = await inventoryApi.getAll(params);
      const nextParts = getListData(res).map(normalizePart);
      setParts(nextParts);
      setStats(buildStats(nextParts));
      setError(null);
    } catch (err) {
      setError(err.message);
      addToast('Failed to fetch parts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getAll();
      setCategories(getListData(res));
    } catch (err) {
      addToast('Failed to fetch categories', 'error');
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await supplierApi.getAll();
      setSuppliers(getListData(res));
    } catch (err) {
      addToast('Failed to fetch suppliers', 'error');
    }
  };

  const fetchStats = async () => {
    try {
      const res = await inventoryApi.getStats();
      setStats(getItemData(res));
    } catch (err) {
      console.error(err);
    }
  };

  const addPart = async (data) => {
    try {
      const res = await inventoryApi.create(data);
      const createdPart = normalizePart(res.data?.data ?? res.data ?? data);
      updatePartsState((prev) => [createdPart, ...prev]);
      addToast('Part added successfully', 'success');
      return true;
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to add part', 'error');
      return false;
    }
  };

  const updatePart = async (id, data) => {
    try {
      const res = await inventoryApi.update(id, data);
      const updatedPart = normalizePart(res.data?.data ?? res.data ?? data);
      updatePartsState((prev) => prev.map((part) => (part._id === id ? updatedPart : part)));
      addToast('Part updated successfully', 'success');
      return true;
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update part', 'error');
      return false;
    }
  };

  const deletePart = async (id) => {
    try {
      await inventoryApi.delete(id);
      updatePartsState((prev) => prev.filter((part) => part._id !== id));
      addToast('Part deleted successfully', 'success');
      return true;
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete part', 'error');
      return false;
    }
  };

  const restockPart = async (id, quantity) => {
    try {
      const res = await inventoryApi.restock(id, quantity);
      const updatedPart = normalizePart(res.data?.data ?? res.data ?? {});
      updatePartsState((prev) => prev.map((part) => (part._id === id ? updatedPart : part)));
      addToast('Stock updated successfully', 'success');
      return true;
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to restock part', 'error');
      return false;
    }
  };

  const restorePart = async (id, quantity) => {
    const restoreQuantity = Number(quantity) || 0;
    if (restoreQuantity <= 0) {
      addToast('Please enter a valid quantity', 'error');
      return false;
    }

    try {
      const res = await inventoryApi.restore(id, restoreQuantity);
      const updatedPart = normalizePart(res.data?.data ?? res.data ?? {});
      updatePartsState((prev) => prev.map((part) => (part._id === id ? updatedPart : part)));
      addToast('Stock restored successfully', 'success');
      return true;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to restore stock';
      addToast(message, 'error');
      return false;
    }
  };

  const sellPart = async (id, quantity) => {
    const saleQuantity = Number(quantity) || 0;
    if (saleQuantity <= 0) {
      addToast('Please enter a valid quantity', 'error');
      return false;
    }

    try {
      const currentPart = parts.find((part) => part._id === id);
      if (!currentPart || saleQuantity > (currentPart.quantity || 0)) {
        addToast('Cannot sell more than current stock', 'error');
        return false;
      }

      const updatedPart = normalizePart({ ...currentPart, quantity: (currentPart.quantity || 0) - saleQuantity });
      updatePartsState((prev) => prev.map((part) => (part._id === id ? updatedPart : part)));

      const nextHistory = [{ id: Date.now(), partId: id, partName: currentPart.name, quantity: saleQuantity, soldAt: new Date().toISOString() }, ...saleHistory].slice(0, 20);
      setSaleHistory(nextHistory);
      localStorage.setItem(SALE_HISTORY_KEY, JSON.stringify(nextHistory));
      addToast('Sale completed successfully', 'success');
      return true;
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to process sale', 'error');
      return false;
    }
  };

  const addCategory = async (data) => {
    await categoryApi.create(data); fetchCategories(); addToast('Category added', 'success');
  };
  const updateCategory = async (id, data) => {
    await categoryApi.update(id, data); fetchCategories(); addToast('Category updated', 'success');
  };
  const deleteCategory = async (id) => {
    await categoryApi.delete(id); fetchCategories(); addToast('Category deleted', 'success');
  };
  const addSupplier = async (data) => {
    await supplierApi.create(data); fetchSuppliers(); addToast('Supplier added', 'success');
  };
  const updateSupplier = async (id, data) => {
    await supplierApi.update(id, data); fetchSuppliers(); addToast('Supplier updated', 'success');
  };
  const deleteSupplier = async (id) => {
    await supplierApi.delete(id); fetchSuppliers(); addToast('Supplier deleted', 'success');
  };

  useEffect(() => {
    fetchCategories();
    fetchSuppliers();
    fetchStats();
  }, []);

  const value = {
    parts,
    categories,
    suppliers,
    stats,
    loading,
    error,
    toasts,
    saleHistory,
    fetchParts,
    fetchCategories,
    fetchSuppliers,
    fetchStats,
    addPart,
    updatePart,
    deletePart,
    restockPart,
    restorePart,
    sellPart,
    addCategory,
    updateCategory,
    deleteCategory,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addToast,
    removeToast,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};
