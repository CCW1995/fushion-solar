// Plant Report data structure for reference
export const plantReportDataStructure = {
  plant_name: 'Plant name',
  address: 'Plant address/location',
  pv_yield: 'PV system yield in kWh',
  plant_yield: 'Plant output in kWh',
  export: 'Energy exported to grid in kWh',
  specific_energy: 'Specific energy production in kWh/kWp',
  consumption: 'Energy consumption in kWh'
};

// Filter options for reference
export const filterOptions = {
  brand: [
    { value: '', label: 'All' },
    { value: 'fusionsolar', label: 'FusionSolar' },
    { value: 'soliscloud', label: 'SolisCloud' },
    { value: 'sungrow', label: 'Sungrow' },
    { value: 'goodwe', label: 'GoodWe' },
    { value: 'growatt', label: 'Growatt' }
  ],
  dimension: [
    { value: 'By plant', label: 'By plant' },
    { value: 'By plant', label: 'By plant' },
    { value: 'By region', label: 'By region' }
  ],
  timeGranularity: [
    { value: 'Daily', label: 'Daily' },
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Yearly', label: 'Yearly' }
  ]
};

// Table column configurations
export const tableColumns = {
  plantName: { width: 200, ellipsis: true, sorter: true },
  address: { width: 250, ellipsis: true, sorter: true },
  pvYield: { width: 150, sorter: true },
  plantYield: { width: 180, sorter: true },
  export: { width: 150, sorter: true },
  specificEnergy: { width: 200, sorter: true },
  consumption: { width: 150, sorter: true }
};
