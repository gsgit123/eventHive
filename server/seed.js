const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const User = require('./models/User');
const Vendor = require('./models/Vendor');
const Product = require('./models/Product');
const EventPackage = require('./models/EventPackage');

const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'];

const firstNames = ['Amit', 'Rahul', 'Priya', 'Sneha', 'Vikram', 'Anjali', 'Rohan', 'Neha', 'Karan', 'Pooja', 'Sunil', 'Kavita'];
const lastNames = ['Sharma', 'Verma', 'Patel', 'Singh', 'Kapoor', 'Gupta', 'Joshi', 'Reddy', 'Chawla', 'Mehta', 'Nair'];

const vendorPrefixes = ['Royal', 'Elegant', 'Shubh', 'Classic', 'Premium', 'Aura', 'Dream', 'Golden', 'Divine', 'Star'];
const vendorSuffixes = ['Events', 'Decorators', 'Studios', 'Creations', 'Planners', 'Makers', 'Designs', 'Rentals', 'Props'];

const productCategories = ['Balloons', 'Lights', 'Flowers', 'Props', 'Furniture', 'Backdrops'];

const imageMap = {
  Balloons: [
    'https://images.unsplash.com/photo-1530103862676-de8892bf30bf?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542451313056-b7c8e626645f?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522008342704-6b265b543c46?auto=format&fit=crop&q=80'
  ],
  Lights: [
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505381861783-a4e98f480302?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1549460293-8fef49962a93?auto=format&fit=crop&q=80'
  ],
  Flowers: [
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&q=80'
  ],
  Props: [
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1628189675276-880624d9c4fb?auto=format&fit=crop&q=80'
  ],
  Furniture: [
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519710889408-a67e1c7e0452?auto=format&fit=crop&q=80'
  ],
  Backdrops: [
    'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'
  ]
};

const eventTypes = ['Wedding', 'Birthday', 'Corporate', 'Anniversary', 'Festive'];
const eventImages = {
  Wedding: [
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80' // Indian wedding
  ],
  Birthday: [
    'https://images.unsplash.com/photo-1530103862676-de8892bf30bf?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80'
  ],
  Corporate: [
    'https://images.unsplash.com/photo-1505381861783-a4e98f480302?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&q=80'
  ],
  Anniversary: [
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'
  ],
  Festive: [
    'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505381861783-a4e98f480302?auto=format&fit=crop&q=80'
  ]
};

const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

console.log('Connecting to DB...', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventhive')
  .then(async () => {
    console.log('Wiping ALL dummy data (vendors/products/events)...');
    
    // Safety check - we clean up any user containing '@seed'
    const seedUsers = await User.find({ email: { $regex: '@seed' } });
    const seedUserIds = seedUsers.map(u => u._id);
    
    const seedVendors = await Vendor.find({ userId: { $in: seedUserIds } });
    const seedVendorIds = seedVendors.map(v => v._id);

    await Product.deleteMany({ vendorId: { $in: seedVendorIds } });
    await EventPackage.deleteMany({ vendorId: { $in: seedVendorIds } });
    await Vendor.deleteMany({ userId: { $in: seedUserIds } });
    await User.deleteMany({ _id: { $in: seedUserIds } });
    
    console.log('Creating 100 Vendors...');
    const hashedPass = await bcrypt.hash('password', 10);
    const vendorDocs = [];

    for (let i = 1; i <= 100; i++) {
      const ownerName = `${randomPick(firstNames)} ${randomPick(lastNames)}`;
      const businessName = `${randomPick(vendorPrefixes)} ${randomPick(Object.keys(imageMap).concat(['Festivals', 'Moments']))} ${randomPick(vendorSuffixes)}`;
      const city = randomPick(CITIES);

      const user = await User.create({
        name: ownerName,
        email: `vendor${i}@seed.in`,
        password: hashedPass,
        role: 'vendor',
        city,
      });

      // 60% products only, 20% events only, 20% both
      const rand = Math.random();
      const cats = rand > 0.4 ? ['products'] : rand > 0.2 ? ['events'] : ['products', 'events'];

      const vendor = await Vendor.create({
        userId: user._id,
        businessName,
        city,
        categories: cats,
        isApproved: true,
        rating: (Math.random() * (5 - 3.8) + 3.8).toFixed(1), // 3.8 to 5.0
        totalReviews: randomInt(10, 500),
      });

      vendorDocs.push(vendor);
    }

    console.log('Creating 500+ Products & 200+ Event Packages...');
    let prodCount = 0;
    let pkgCount = 0;

    for (const vendor of vendorDocs) {
      if (vendor.categories.includes('products')) {
        const numProds = randomInt(5, 12); // Add between 5 to 12 products per product vendor
        for (let j = 0; j < numProds; j++) {
          const cat = randomPick(productCategories);
          const isSale = Math.random() > 0.6; // 40% sale, 60% rent
          
          let name = '';
          if (cat === 'Balloons') name = randomPick(['Pastel Balloon Arch', 'Metallic Helium Balloons Set', 'Birthday Balloon Bouquet', 'Heart Shaped Balloon Decor']);
          else if (cat === 'Lights') name = randomPick(['Warm Fairy Lights 10m', 'LED Neon Sign "Happy Birthday"', 'Vintage Chandelier', 'Disco Ball Setup']);
          else if (cat === 'Flowers') name = randomPick(['Marigold Floral Strings', 'Artificial Rose Backdrop', 'Orchid Table Centerpiece', 'Jasmine Garlands']);
          else if (cat === 'Props') name = randomPick(['Wooden Welcome Board', 'Vintage Photo Booth Props', 'Cake Stand Set', 'Easel Stand']);
          else if (cat === 'Furniture') name = randomPick(['Chiavari Chairs Set of 50', 'Velvet Couple Sofa', 'Round Banquet Table', 'Cocktail High Tables']);
          else if (cat === 'Backdrops') name = randomPick(['Sequins Wall Backdrop', 'Greenery Boxwood Hedge', 'Mandap Structure', 'White Drapes Backdrop']);

          const basePrice = randomInt(500, 4000);
          
          await Product.create({
            vendorId: vendor._id,
            name: `${vendor.businessName} - ${name}`,
            description: `Premium ${cat.toLowerCase()} perfect for making your Indian weddings, birthdays, or parties stand out. High quality and verified vendor.`,
            category: cat,
            listingType: isSale ? 'sale' : 'rent',
            salePrice: isSale ? basePrice * 2 : 0,
            rentPricePerDay: !isSale ? basePrice : 0,
            securityDeposit: !isSale ? basePrice * randomInt(1, 3) : 0,
            quantity: randomInt(10, 100),
            images: [randomPick(imageMap[cat] || imageMap['Props'])],
            city: vendor.city,
            isActive: true,
            rating: (Math.random() * (5 - 4) + 4).toFixed(1)
          });
          prodCount++;
        }
      }

      if (vendor.categories.includes('events')) {
        const numPkgs = randomInt(2, 5); // 2 to 5 packages per event vendor
        for (let j = 0; j < numPkgs; j++) {
          const type = randomPick(eventTypes);
          let name = '';
          let inclusions = [];
          let price = 0;

          if (type === 'Wedding') {
             name = randomPick(['Grand Mandap Setup', 'Royal Reception Decor', 'Haldi & Mehndi Setup', 'Complete Wedding Package']);
             inclusions = ['Mandap Decoration', 'Floral Entrance', 'Lighting Setup', 'Couple Sofa', 'Red Carpet'];
             price = randomInt(40000, 200000);
          } else if (type === 'Birthday') {
             name = randomPick(['Premium Theme Birthday', 'Kids Carnival Setup', '1st Birthday Grand Decor']);
             inclusions = ['Balloon Arch', 'Themed Backdrop', 'Cake Table Props', 'Welcome Board'];
             price = randomInt(8000, 25000);
          } else if (type === 'Corporate') {
             name = randomPick(['Annual Day Setup', 'Conference Hall Decor', 'Product Launch Decor']);
             inclusions = ['Stage Setup', 'LED Wall', 'Professional Lighting', 'Podium Decor'];
             price = randomInt(30000, 150000);
          } else {
             name = `Exclusive ${type} Decor Package`;
             inclusions = ['Custom Backdrop', 'Ambient Lighting', 'Centerpieces'];
             price = randomInt(15000, 50000);
          }

          await EventPackage.create({
            vendorId: vendor._id,
            name: name,
            description: `A top-tier ${type.toLowerCase()} event decoration package by ${vendor.businessName} in ${vendor.city}. We handle everything exactly as shown.`,
            eventType: type,
            price: price,
            inclusions: inclusions,
            images: [randomPick(eventImages[type] || eventImages['Wedding'])],
            city: vendor.city,
            isActive: true,
            rating: (Math.random() * (5 - 4) + 4).toFixed(1)
          });
          pkgCount++;
        }
      }
    }

    console.log(`Database Seeding Completed!`);
    console.log(`- 100 Vendors created`);
    console.log(`- ${prodCount} Products created`);
    console.log(`- ${pkgCount} Event Packages created`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
