// Mock data for PlantView components
export const plantName = "Sample Plant";

export const weatherData = {
  temperature: '24~32',
  status: 'Moderate rain',
  days: [
    { day: 'Wed', date: '2025-05-07' },
    { day: 'Thur', date: '' },
    { day: 'Fri', date: '' }
  ]
};

export const samplePlantData = {
  info: [
    {
      station_name: "Time Dot Com",
      station_address: "MalaysiaShah AlamJalan Majistret U1/2614, Jalan Majistret U1/26",
      capacity: 6.5,
      grid_connection_date: "2025-01-25T00:00:00.000Z",
      day_power: 0.36,
      month_power: 159.39,
      total_power: 364.62
    }
  ],
  alarmCount: [
    {
      total_alarm: "0",
      critical: "0",
      major: "0",
      minor: "0",
      warning: "0"
    }
  ],
  envBenefit: [
    {
      coal_saved: 151.742,
      co2_avoided: 180.18400000000003,
      trees_planted: 246.1670000000001
    }
  ]
}; 