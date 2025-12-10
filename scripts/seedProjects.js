import mongoose from "mongoose";
import dotenv from "dotenv";
import Project from "../models/Project.js";

// Load env vars
dotenv.config();

const projects = [
  {
    name: "Golden Legacy Villas",
    location: "Whitefield, Bangalore",
    type: "Luxury Villas",
    description:
      "Experience luxury living at its finest with our Golden Legacy Villas. These stunning properties feature modern architecture, premium finishes, and spacious layouts designed for sophisticated families. Each villa comes with a private garden, swimming pool, and state-of-the-art security systems. Located in the heart of Whitefield, enjoy excellent connectivity to IT parks, schools, and shopping centers.",
    price: "₹2.5 Cr - ₹4.2 Cr",
    image: "/assets/project-villas.jpg",
    gallery: ["/assets/project-villas.jpg", "/assets/hero-villa.jpg"],
    amenities: [
      "Swimming Pool",
      "Clubhouse",
      "Gym",
      "Children's Play Area",
      "Landscaped Gardens",
      "24/7 Security",
      "Power Backup",
      "Covered Parking",
      "Indoor Games Room",
      "Yoga Deck",
    ],
    specifications: {
      bedrooms: "4-5 BHK",
      bathrooms: "5-6",
      area: "3500-5000 sq.ft",
      parking: "2-3 Cars",
    },
    status: "Ongoing",
    featured: true,
    isActive: true,
  },
  {
    name: "Skyline Premium Apartments",
    location: "HSR Layout, Bangalore",
    type: "Premium Apartments",
    description:
      "Skyline Premium Apartments redefine urban living with contemporary design and world-class amenities. These meticulously planned residences offer panoramic city views, smart home features, and eco-friendly construction. Perfect for professionals and small families looking for convenience and luxury in the heart of HSR Layout. Walk to cafes, restaurants, and enjoy seamless connectivity to major tech hubs.",
    price: "₹85 Lakhs - ₹1.8 Cr",
    image: "/assets/project-apartment.jpg",
    gallery: ["/assets/project-apartment.jpg"],
    amenities: [
      "Rooftop Swimming Pool",
      "Fully Equipped Gym",
      "Community Hall",
      "Kids Play Area",
      "Jogging Track",
      "Meditation Center",
      "Multi-Purpose Court",
      "High-Speed Elevators",
      "Intercom Facility",
      "Rainwater Harvesting",
    ],
    specifications: {
      bedrooms: "2-3 BHK",
      bathrooms: "2-3",
      area: "1200-2000 sq.ft",
      parking: "1-2 Cars",
    },
    status: "Ready to Move",
    featured: true,
    isActive: true,
  },
  {
    name: "Green Valley Farmhouses",
    location: "Devanahalli, Bangalore",
    type: "Luxury Farmhouse",
    description:
      "Escape to tranquility with Green Valley Farmhouses - your private retreat away from the city's hustle. These expansive properties offer acres of lush greenery, organic farming spaces, and luxurious living quarters. Perfect for weekend getaways or full-time residence, each farmhouse features modern amenities while maintaining a connection with nature. Ideal for families seeking a peaceful, sustainable lifestyle with fresh air and open spaces.",
    price: "₹1.2 Cr - ₹2.8 Cr",
    image: "/assets/project-farmhouse.jpg",
    gallery: ["/assets/project-farmhouse.jpg"],
    amenities: [
      "Private Garden",
      "Organic Farm Space",
      "Borewell",
      "Solar Power",
      "Rain Water Harvesting",
      "Compound Wall",
      "Gated Community",
      "Tree Plantation",
      "Natural Pond",
      "Open Pavilion",
    ],
    specifications: {
      bedrooms: "3-4 BHK",
      bathrooms: "4-5",
      area: "2 - 5 Acres",
      parking: "Multiple Vehicles",
    },
    status: "Ongoing",
    featured: true,
    isActive: true,
  },
  {
    name: "Royal Heights Penthouses",
    location: "Indiranagar, Bangalore",
    type: "Penthouse",
    description:
      "Royal Heights Penthouses represent the pinnacle of luxury living in Bangalore. These exclusive residences span entire floors with breathtaking 360-degree views of the city. Features include private terrace gardens, jacuzzi, home theater, and customized interiors. Located in the vibrant Indiranagar neighborhood, residents enjoy walking distance to fine dining, shopping, and entertainment while living in absolute luxury and privacy.",
    price: "₹5.5 Cr - ₹8.2 Cr",
    image: "/assets/project-apartment.jpg",
    gallery: ["/assets/project-apartment.jpg"],
    amenities: [
      "Private Terrace Garden",
      "Jacuzzi",
      "Home Theater",
      "Private Elevator",
      "Smart Home System",
      "Wine Cellar",
      "Infinity Pool",
      "Personal Gym",
      "BBQ Area",
      "Panoramic Views",
    ],
    specifications: {
      bedrooms: "5-6 BHK",
      bathrooms: "6-7",
      area: "6000-8500 sq.ft",
      parking: "4-5 Cars",
    },
    status: "Upcoming",
    featured: false,
    isActive: true,
  },
  {
    name: "Harmony Row Houses",
    location: "Sarjapur Road, Bangalore",
    type: "Row House",
    description:
      "Harmony Row Houses offer the perfect blend of independent living and community feel. These beautifully designed homes provide the privacy of villas with the convenience of apartment living. Each unit features a private entrance, small garden, and terrace space. The gated community ensures security while fostering a friendly neighborhood atmosphere. Ideal for growing families looking for space, comfort, and a sense of belonging.",
    price: "₹1.4 Cr - ₹2.1 Cr",
    image: "/assets/project-villas.jpg",
    gallery: ["/assets/project-villas.jpg", "/assets/hero-villa.jpg"],
    amenities: [
      "Gated Security",
      "Community Club",
      "Swimming Pool",
      "Children's Park",
      "Cycling Track",
      "Garden Seating",
      "Maintenance Staff",
      "Visitor Parking",
      "CCTV Surveillance",
      "Common Lawn",
    ],
    specifications: {
      bedrooms: "3-4 BHK",
      bathrooms: "3-4",
      area: "2200-3000 sq.ft",
      parking: "2 Cars",
    },
    status: "Ongoing",
    featured: false,
    isActive: true,
  },
  {
    name: "Emerald Garden Villas",
    location: "Hennur Road, Bangalore",
    type: "Luxury Villas",
    description:
      "Emerald Garden Villas bring you closer to nature without compromising on luxury. These eco-friendly villas feature rainwater harvesting, solar panels, and organic gardens. The architectural design maximizes natural light and ventilation while providing spacious living areas. Perfect for environmentally conscious families who want to reduce their carbon footprint while enjoying a premium lifestyle. The community includes nature trails and a central park.",
    price: "₹2.8 Cr - ₹4.5 Cr",
    image: "/assets/hero-villa.jpg",
    gallery: ["/assets/hero-villa.jpg", "/assets/project-villas.jpg"],
    amenities: [
      "Solar Power System",
      "Rainwater Harvesting",
      "Organic Garden Space",
      "Central Park",
      "Nature Trails",
      "Eco-Friendly Materials",
      "Energy Efficient Lighting",
      "Waste Management",
      "Electric Vehicle Charging",
      "Green Building Certified",
    ],
    specifications: {
      bedrooms: "4-5 BHK",
      bathrooms: "5-6",
      area: "3800-5200 sq.ft",
      parking: "3 Cars",
    },
    status: "Upcoming",
    featured: false,
    isActive: true,
  },
];

const seedProjects = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected for seeding...");

    // Delete existing projects (optional - comment out if you want to keep existing)
    // await Project.deleteMany({});
    // console.log("Existing projects deleted");

    // Insert new projects
    const createdProjects = await Project.insertMany(projects);
    console.log(`${createdProjects.length} projects created successfully!`);

    // Log created projects
    createdProjects.forEach((project) => {
      console.log(`- ${project.name} (${project.type})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding projects:", error);
    process.exit(1);
  }
};

seedProjects();
