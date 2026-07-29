require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // ignore fallback
}
const Category = require('../models/Category');
const Supplier = require('../models/Supplier');
const Inventory = require('../models/Inventory');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/autoparts_inventory');
    console.log('MongoDB Connected for Seeding...');

    await Category.deleteMany();
    await Supplier.deleteMany();
    await Inventory.deleteMany();

    const categories = await Category.insertMany([
      { name: 'Brakes', description: 'Brake pads, rotors, and related parts' },
      { name: 'Engine Parts', description: 'Engine components and replacements' },
      { name: 'Electrical', description: 'Alternators, starters, and electronics' },
      { name: 'Suspension', description: 'Shocks, struts, and springs' },
      { name: 'Filters', description: 'Oil, air, and cabin filters' }
    ]);

    const suppliers = await Supplier.insertMany([
      { name: 'Delhi Auto Spares', contactPerson: 'Amit Sharma', phone: '09871-123456', email: 'contact@delhiauto.in', address: 'Gurudwara Road, Delhi' },
      { name: 'Mumbai Motor Parts', contactPerson: 'Rohit Mehta', phone: '09822-765432', email: 'sales@mumbaimotors.in', address: 'Marine Drive, Mumbai' },
      { name: 'Bangalore Components', contactPerson: 'Priya Rao', phone: '09800-112233', email: 'info@bangalorecomponents.in', address: 'Koramangala, Bangalore' },
      { name: 'Chennai Gears', contactPerson: 'Suresh Kumar', phone: '09844-998877', email: 'supply@chennaigears.in', address: 'Anna Nagar, Chennai' }
    ]);

    const parts = [
      {
        partNumber: 'BRK-001', name: 'Ceramic Brake Pads', description: 'High performance ceramic brake pads',
        category: categories[0]._id, supplier: suppliers[0]._id, costPrice: 3500, sellingPrice: 5000, quantity: 15, minStockLevel: 5,
        location: { warehouse: 'Warehouse A', shelf: 'A1', bin: '1' }, compatibleVehicles: ['Honda Civic', 'Toyota Corolla']
      },
      {
        partNumber: 'BRK-002', name: 'Brake Rotor', description: 'Vented brake rotor',
        category: categories[0]._id, supplier: suppliers[1]._id, costPrice: 8000, sellingPrice: 12000, quantity: 0, minStockLevel: 4,
        location: { warehouse: 'Warehouse B', shelf: 'C2', bin: '4' }
      },
      {
        partNumber: 'ENG-001', name: 'Spark Plug Set', description: 'Iridium spark plugs set of 4',
        category: categories[1]._id, supplier: suppliers[2]._id, costPrice: 2000, sellingPrice: 3500, quantity: 50, minStockLevel: 10,
        location: { warehouse: 'Warehouse A', shelf: 'B1', bin: '2' }
      },
      {
        partNumber: 'ENG-002', name: 'Timing Belt', description: 'Durable timing belt',
        category: categories[1]._id, supplier: suppliers[3]._id, costPrice: 4500, sellingPrice: 6500, quantity: 2, minStockLevel: 5,
        location: { warehouse: 'Warehouse A', shelf: 'B3', bin: '1' }
      },
      {
        partNumber: 'ELE-001', name: 'Alternator 12V', description: 'Standard 12V Alternator',
        category: categories[2]._id, supplier: suppliers[0]._id, costPrice: 15000, sellingPrice: 22000, quantity: 8, minStockLevel: 3,
        location: { warehouse: 'Warehouse B', shelf: 'A4', bin: '2' }
      },
      {
        partNumber: 'ELE-002', name: 'Starter Motor', description: 'High torque starter motor',
        category: categories[2]._id, supplier: suppliers[1]._id, costPrice: 12000, sellingPrice: 18000, quantity: 1, minStockLevel: 2,
        location: { warehouse: 'Warehouse B', shelf: 'A4', bin: '3' }
      },
      {
        partNumber: 'SUS-001', name: 'Front Strut Assembly', description: 'Complete front strut assembly',
        category: categories[3]._id, supplier: suppliers[2]._id, costPrice: 25000, sellingPrice: 32000, quantity: 12, minStockLevel: 4,
        location: { warehouse: 'Warehouse A', shelf: 'D1', bin: '1' }
      },
      {
        partNumber: 'SUS-002', name: 'Coil Spring', description: 'Heavy duty coil spring',
        category: categories[3]._id, supplier: suppliers[3]._id, costPrice: 6000, sellingPrice: 8500, quantity: 0, minStockLevel: 6,
        location: { warehouse: 'Warehouse A', shelf: 'D1', bin: '2' }
      },
      {
        partNumber: 'FIL-001', name: 'Oil Filter', description: 'Premium oil filter',
        category: categories[4]._id, supplier: suppliers[0]._id, costPrice: 800, sellingPrice: 1200, quantity: 100, minStockLevel: 20,
        location: { warehouse: 'Warehouse B', shelf: 'E1', bin: '1' }
      },
      {
        partNumber: 'FIL-002', name: 'Air Filter', description: 'High flow air filter',
        category: categories[4]._id, supplier: suppliers[1]._id, costPrice: 1500, sellingPrice: 2200, quantity: 30, minStockLevel: 10,
        location: { warehouse: 'Warehouse B', shelf: 'E2', bin: '1' }
      },
      {
        partNumber: 'FIL-003', name: 'Cabin Air Filter', description: 'Carbon activated cabin filter',
        category: categories[4]._id, supplier: suppliers[2]._id, costPrice: 1200, sellingPrice: 1800, quantity: 4, minStockLevel: 10,
        location: { warehouse: 'Warehouse B', shelf: 'E3', bin: '1' }
      },
      {
        partNumber: 'BRK-003', name: 'Brake Caliper', description: 'Front left brake caliper',
        category: categories[0]._id, supplier: suppliers[3]._id, costPrice: 12000, sellingPrice: 16000, quantity: 6, minStockLevel: 3,
        location: { warehouse: 'Warehouse A', shelf: 'A2', bin: '1' }
      },
      {
        partNumber: 'ENG-003', name: 'Water Pump', description: 'Engine water pump',
        category: categories[1]._id, supplier: suppliers[0]._id, costPrice: 5500, sellingPrice: 8000, quantity: 3, minStockLevel: 5,
        location: { warehouse: 'Warehouse A', shelf: 'B2', bin: '1' }
      },
      {
        partNumber: 'ELE-003', name: 'Battery 12V 65Ah', description: 'Maintenance free car battery',
        category: categories[2]._id, supplier: suppliers[1]._id, costPrice: 22000, sellingPrice: 26000, quantity: 25, minStockLevel: 10,
        location: { warehouse: 'Warehouse B', shelf: 'A1', bin: '1' }
      },
      {
        partNumber: 'SUS-003', name: 'Tie Rod End', description: 'Outer tie rod end',
        category: categories[3]._id, supplier: suppliers[2]._id, costPrice: 1800, sellingPrice: 2800, quantity: 40, minStockLevel: 15,
        location: { warehouse: 'Warehouse A', shelf: 'D2', bin: '2' }
      },
      {
        partNumber: 'FIL-004', name: 'Fuel Filter', description: 'In-line fuel filter',
        category: categories[4]._id, supplier: suppliers[3]._id, costPrice: 2000, sellingPrice: 3000, quantity: 0, minStockLevel: 8,
        location: { warehouse: 'Warehouse B', shelf: 'E1', bin: '2' }
      },
      {
        partNumber: 'BRK-004', name: 'Brake Fluid DOT 4', description: '500ml Brake Fluid',
        category: categories[0]._id, supplier: suppliers[0]._id, costPrice: 900, sellingPrice: 1400, quantity: 60, minStockLevel: 20,
        location: { warehouse: 'Warehouse A', shelf: 'A3', bin: '1' }
      },
      {
        partNumber: 'ENG-004', name: 'Head Gasket', description: 'Cylinder head gasket',
        category: categories[1]._id, supplier: suppliers[1]._id, costPrice: 3000, sellingPrice: 4500, quantity: 5, minStockLevel: 5,
        location: { warehouse: 'Warehouse A', shelf: 'B4', bin: '1' }
      },
      {
        partNumber: 'ELE-004', name: 'Headlight Bulb', description: 'H4 LED Headlight bulb',
        category: categories[2]._id, supplier: suppliers[2]._id, costPrice: 2500, sellingPrice: 4000, quantity: 15, minStockLevel: 10,
        location: { warehouse: 'Warehouse B', shelf: 'A2', bin: '1' }
      },
      {
        partNumber: 'SUS-004', name: 'Ball Joint', description: 'Lower ball joint',
        category: categories[3]._id, supplier: suppliers[3]._id, costPrice: 2200, sellingPrice: 3500, quantity: 4, minStockLevel: 10,
        location: { warehouse: 'Warehouse A', shelf: 'D3', bin: '1' }
      }
    ];

    await Inventory.insertMany(parts);

    console.log('Seeding complete!');
    console.log(`Created 5 Categories, 4 Suppliers, and 20 Parts.`);
    process.exit();
  } catch (error) {
    console.error('Error with seed data: ', error);
    process.exit(1);
  }
};

seedData();
