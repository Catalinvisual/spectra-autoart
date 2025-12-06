// Configurare tipuri caroserie
export const BODY_TYPES = [
  { id: 1, key: 'suv', name: 'SUV', sort_order: 1, is_active: true },
  { id: 2, key: 'berlina', name: 'Berlina', sort_order: 2, is_active: true },
  { id: 3, key: 'break', name: 'Break', sort_order: 3, is_active: true },
  { id: 4, key: 'hatchback', name: 'Hatchback', sort_order: 4, is_active: true },
  { id: 5, key: 'coupe', name: 'Coupe', sort_order: 5, is_active: true },
  { id: 6, key: 'cabrio', name: 'Cabrio', sort_order: 6, is_active: true },
  { id: 7, key: 'van', name: 'Van', sort_order: 7, is_active: true },
  { id: 8, key: 'wagon', name: 'Wagon', sort_order: 8, is_active: true }
];

// Helper functions pentru body types
export const getBodyTypeByKey = (key) => {
  return BODY_TYPES.find(bt => bt.key === key && bt.is_active);
};

export const getActiveBodyTypes = () => {
  return BODY_TYPES.filter(bt => bt.is_active).sort((a, b) => a.sort_order - b.sort_order);
};

export const getBodyTypeName = (key) => {
  const bodyType = getBodyTypeByKey(key);
  return bodyType ? bodyType.name : key;
};