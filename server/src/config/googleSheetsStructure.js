// Google Sheets structure definition
export const GOOGLE_SHEETS_STRUCTURE = {
  bookings: {
    sheetName: 'Bookings',
    columns: ['ID', 'Name', 'Email', 'Phone', 'Date', 'Time', 'Services', 'Total', 'Status', 'Created At']
  },
  services: {
    sheetName: 'Services', 
    columns: ['ID', 'Slug', 'Name', 'Description', 'Category', 'Image_URL', 'Duration_Minutes', 'Is_Active']
  },
  body_types: {
    sheetName: 'Body_Types',
    columns: ['ID', 'Key', 'Name', 'Sort_Order', 'Is_Active']
  },
  service_prices: {
    sheetName: 'Service_Prices',
    columns: ['ID', 'Service_ID', 'Body_Type_ID', 'Price_Min', 'Currency', 'Duration_Minutes', 'Promo_Percent', 'Is_Active']
  },
  vehicles: {
    sheetName: 'Vehicles',
    columns: ['ID', 'Make', 'Model', 'Type', 'Body']
  },
  gallery: {
    sheetName: 'Gallery',
    columns: ['ID', 'Title', 'Description', 'Image_URL', 'Category', 'Active', 'Upload_Date', 'Title_NL', 'Title_EN', 'Title_ES', 'Title_PL', 'Title_RO', 'Description_NL', 'Description_EN', 'Description_ES', 'Description_PL', 'Description_RO']
  },
  testimonials: {
    sheetName: 'Testimonials',
    columns: ['ID', 'Name', 'Rating', 'Comment_NL', 'Comment_EN', 'Comment_ES', 'Comment_PL', 'Comment_RO', 'Active', 'Created_Date']
  },
  newsletter: {
    sheetName: 'Newsletter',
    columns: ['Email', 'Subscribed At', 'Status']
  },
  newsletter_subscribers: {
    sheetName: 'Newsletter_subscribers',
    columns: ['Email', 'Name', 'Locale', 'IP', 'Subscribed At']
  },
  admin_users: {
    sheetName: 'Admin_users',
    columns: ['ID', 'Username', 'Email', 'Password', 'Role', 'Created At', 'Last Login', 'Status']
  },
  vehicle_services: {
    sheetName: 'Vehicle_Services',
    columns: ['ID', 'Name', 'Name_EN', 'Name_NL', 'Name_ES', 'Name_PL', 'Name_RO', 'Description', 'Description_EN', 'Description_NL', 'Description_ES', 'Description_PL', 'Description_RO', 'Category', 'Category_EN', 'Category_NL', 'Category_ES', 'Category_PL', 'Category_RO', 'Duration_Minutes', 'Is_Active', 'Created_At']
  },
  vehicle_service_prices: {
    sheetName: 'Vehicle_Service_Prices',
    columns: ['ID', 'Service_ID', 'Body_Type_ID', 'Price_Min', 'Currency', 'Duration_Minutes', 'Promo_Percent', 'Is_Active']
  }
};

// Demo data for when Google Sheets is not configured
export const DEMO_DATA = {
  vehicles: [
    {
      id: 'vehicle-1',
      make: 'BMW',
      model: 'Seria 3',
      type: 'Sedan',
      body: 'Sedan'
    },
    {
      id: 'vehicle-2',
      make: 'BMW',
      model: 'Seria 5',
      type: 'Sedan',
      body: 'Sedan'
    },
    {
      id: 'vehicle-3',
      make: 'Audi',
      model: 'A4',
      type: 'Sedan',
      body: 'Sedan'
    },
    {
      id: 'vehicle-4',
      make: 'Audi',
      model: 'Q5',
      type: 'SUV',
      body: 'SUV'
    },
    {
      id: 'vehicle-5',
      make: 'Mercedes',
      model: 'C-Class',
      type: 'Sedan',
      body: 'Sedan'
    },
    {
      id: 'vehicle-6',
      make: 'Mercedes',
      model: 'GLE',
      type: 'SUV',
      body: 'SUV'
    }
  ],
  bookings: [
    {
      id: 'demo-1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      date: '2024-01-15T10:00:00Z',
      services: 'Premium Detailing',
      total: 150,
      status: 'confirmed',
      createdAt: '2024-01-10T08:00:00Z'
    },
    {
      id: 'demo-2', 
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+0987654321',
      date: '2024-01-16T14:00:00Z',
      services: 'Interior Cleaning',
      total: 80,
      status: 'pending',
      createdAt: '2024-01-11T09:00:00Z'
    }
  ],
  services: [
    {
      id: 'service-1',
      name: 'Premium Detailing',
      description: 'Complete exterior and interior detailing service',
      price: 150,
      duration: '3-4 hours',
      category: 'detailing'
    },
    {
      id: 'service-2',
      name: 'Interior Cleaning',
      description: 'Deep interior cleaning and protection',
      price: 80,
      duration: '2 hours',
      category: 'interior'
    }
  ],
  gallery: [
    {
      id: 'gallery-1',
      title: 'Premium Car Detail',
      description: 'Complete transformation of luxury vehicle',
      imageUrl: '/images/demo-car-1.jpg',
      category: 'detailing',
      uploadDate: '2024-01-01'
    }
  ],
  testimonials: [
    {
      id: 'testimonial-1',
      name: 'Alex Johnson',
      rating: 5,
      comment_nl: 'Excelent serviciu! Mașina mea arată ca nouă după detalierea premium. Personal profesionist și rezultate deosebite.',
      comment_en: 'Excellent service! My car looks brand new after premium detailing. Professional staff and outstanding results.',
      comment_es: '¡Excelente servicio! Mi auto se ve como nuevo después del detallado premium. Personal profesional y resultados destacados.',
      comment_pl: 'Doskonała obsługa! Moje auto wygląda jak nowe po premium detailingu. Profesjonalny personel i wyjątkowe rezultaty.',
      comment_ro: 'Serviciu excelent! Mașina mea arată ca nouă după detailing premium. Personal profesionist și rezultate remarcabile.',
      active: true,
      created_date: '2024-01-05'
    }
  ],
  newsletter: [
    {
      email: 'subscriber@example.com',
      subscribedAt: '2024-01-01T00:00:00Z',
      status: 'active'
    }
  ]
};