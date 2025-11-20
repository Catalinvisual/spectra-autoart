// Vehicle service for managing vehicle data
class VehicleService {
  constructor() {
    this.vehicles = [];
  }

  async getVehicles() {
    return this.vehicles;
  }

  async addVehicle(vehicleData) {
    const vehicle = {
      id: Date.now().toString(),
      ...vehicleData,
      createdAt: new Date().toISOString()
    };
    this.vehicles.push(vehicle);
    return vehicle;
  }

  async updateVehicle(id, vehicleData) {
    const index = this.vehicles.findIndex(v => v.id === id);
    if (index !== -1) {
      this.vehicles[index] = { ...this.vehicles[index], ...vehicleData };
      return this.vehicles[index];
    }
    return null;
  }

  async deleteVehicle(id) {
    const index = this.vehicles.findIndex(v => v.id === id);
    if (index !== -1) {
      const deleted = this.vehicles[index];
      this.vehicles.splice(index, 1);
      return deleted;
    }
    return null;
  }
}

export default new VehicleService();