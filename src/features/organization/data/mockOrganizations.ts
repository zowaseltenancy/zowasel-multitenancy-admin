import { Organization } from '@/types/organization';

export const mockOrganizations: Organization[] = [
  {
    id: 'biz_1001',
    businessId: 'biz_1001',
    name: 'Greenfields Agro & Commodity Merchants',
    type: 'merchant',
    countryCode: 'NG',
    countryName: 'Nigeria',
    subRegion: 'west_africa',
    continent: 'africa',

    onboardedByAgent: {
      id: 'usr_agent_1',
      name: 'Oreoluwa Okoro',
    },

    assignedStaff: {
      primary: { id: 'usr_staff_19', name: 'Adebayo Ogunleye' },
      secondary: { id: 'usr_staff_11', name: 'Damilare Ojo' },
    },

    governanceStructure: {
      type: 'corporate',
      directors: ['Chiamaka Eze', 'Kabiru Alabi'],
      shareholders: ['Chiamaka Eze (60%)', 'Greenfields Capital (40%)'],
    },

    keyOfficers: [
      { id: 'off_1', name: 'Chiamaka Eze', position: 'Managing Director', gender: 'female', phone: '+2348012345001', email: 'chiamaka@greenfieldsagro.com' },
      { id: 'off_2', name: 'Kabiru Alabi', position: 'Chief Operating Officer', gender: 'male', phone: '+2348034441122', email: 'kabiru@greenfieldsagro.com' },
      { id: 'off_3', name: 'Folake Ademola', position: 'Head Accountant', gender: 'female', phone: '+2348057778899', email: 'finance@greenfieldsagro.com' },
    ],

    commodityFocus: ['Cassava', 'Grains & Maize', 'Sorghum'],

    owner: {
      name: 'Chiamaka Eze',
      email: 'chiamaka@greenfieldsagro.com',
      phone: '+2348012345001',
    },

    teamMembers: [
      {
        id: 'usr_tm_1',
        name: 'Tunde Okafor',
        email: 'tunde@greenfieldsagro.com',
        role: 'admin',
        isActive: true,
        joinedAt: '2026-02-10',
      },
      {
        id: 'usr_tm_2',
        name: 'Ada Nwosu',
        email: 'ada@greenfieldsagro.com',
        role: 'viewer',
        isActive: true,
        joinedAt: '2026-03-01',
      },
    ],

    kybStatus: 'approved',
    kybSubmittedAt: '2026-03-15T10:30:00Z',
    kybApprovedAt: '2026-03-20T14:45:00Z',
    kybRejectionReason: null,
    kybDocuments: [
      {
        type: 'business_registration',
        url: '/kyb-sample-document-1.jpg',
        status: 'verified',
        uploadedAt: '2026-03-15T10:00:00Z',
      },
      {
        type: 'tax_clearance',
        url: '/kyb-sample-document-2.jpg',
        status: 'verified',
        uploadedAt: '2026-03-15T10:05:00Z',
      },
    ],

    subscriptions: [
      {
        app: 'croppilot',
        plan: 'Growth',
        planId: 'plan_croppilot_growth',
        activeModules: ['farmer_database', 'carbon_sustainability', 'soil_carbon', 'agroforestry'],
        billingState: 'paid',
        renewsAt: '2026-08-01',
      },
    ],

    createdAt: '2026-02-01T09:00:00Z',
  },

  {
    id: 'biz_1002',
    businessId: 'biz_1002',
    name: 'Sahel Grains Offtakers Ltd',
    type: 'buyer',
    countryCode: 'GH',
    countryName: 'Ghana',
    subRegion: 'west_africa',
    continent: 'africa',

    onboardedByAgent: {
      id: 'usr_agent_3',
      name: 'Chidi Nwosu',
    },

    assignedStaff: {
      primary: { id: 'usr_staff_20', name: 'Efua Boateng' },
      secondary: { id: 'usr_staff_10', name: 'Nkechi Umeadi' },
    },

    governanceStructure: {
      type: 'corporate',
      directors: ['Ibrahim Musa', 'Kofi Mensah'],
      shareholders: ['Sahel Holdings Ghana (100%)'],
    },

    keyOfficers: [
      { id: 'off_16', name: 'Ibrahim Musa', position: 'Director of Procurement', gender: 'male', phone: '+233201234502', email: 'ibrahim@sahelgrains.com' },
      { id: 'off_17', name: 'Kofi Mensah', position: 'Grain Quality Inspector', gender: 'male', phone: '+233244888111', email: 'kofi@sahelgrains.com' },
    ],

    commodityFocus: ['White Maize', 'Rice', 'Soybeans'],

    owner: {
      name: 'Ibrahim Musa',
      email: 'ibrahim@sahelgrains.com',
      phone: '+233201234502',
    },

    teamMembers: [
      {
        id: 'usr_tm_3',
        name: 'Fatima Bello',
        email: 'fatima@sahelgrains.com',
        role: 'member',
        isActive: true,
        joinedAt: '2026-05-12',
      },
    ],

    kybStatus: 'pending',
    pendingReason: 'Awaiting 12-Month Bank Statements & Warehouse Storage Size Verification',
    kybSubmittedAt: '2026-07-18T08:00:00Z',
    kybApprovedAt: null,
    kybRejectionReason: null,
    kybDocuments: [
      {
        type: 'business_registration',
        url: '/kyb-sample-document-1.jpg',
        status: 'pending',
        uploadedAt: '2026-07-18T08:00:00Z',
      },
    ],

    subscriptions: [
      {
        app: 'croppilot',
        plan: 'Free',
        planId: 'plan_croppilot_free',
        activeModules: ['farmer_database'],
        billingState: 'free',
        renewsAt: null,
      },
    ],

    createdAt: '2026-07-10T09:00:00Z',
  },

  {
    id: 'biz_agro_01',
    businessId: 'biz_agro_01',
    name: 'Gwarzo Farm Inputs & Seeds Hub',
    type: 'agrodealer',
    countryCode: 'NG',
    countryName: 'Nigeria',
    subRegion: 'west_africa',
    continent: 'africa',

    onboardedByAgent: {
      id: 'usr_agent_2',
      name: 'Ibrahim Sani',
    },

    governanceStructure: {
      type: 'individual',
      directors: ['Mustapha Gwarzo'],
    },

    keyOfficers: [
      { id: 'off_6', name: 'Mustapha Gwarzo', position: 'Managing Director', gender: 'male', phone: '+2348035559988', email: 'mustapha@gwarzoseeds.com' },
      { id: 'off_7', name: 'Amina Danjuma', position: 'Warehouse Manager', gender: 'female', phone: '+2348062221100', email: 'amina@gwarzoseeds.com' },
      { id: 'off_8', name: 'Suleiman Isa', position: 'Input Credit Officer', gender: 'male', phone: '+2348083334411', email: 'credit@gwarzoseeds.com' },
    ],

    inputFocus: ['Fertilizers (NPK & Urea)', 'Agrochemicals (Herbicides)', 'Certified Hybrid Seeds'],

    owner: {
      name: 'Mustapha Gwarzo',
      email: 'mustapha@gwarzoseeds.com',
      phone: '+2348035559988',
    },

    teamMembers: [],

    kybStatus: 'approved',
    kybSubmittedAt: '2026-01-20T10:00:00Z',
    kybApprovedAt: '2026-01-25T14:00:00Z',
    kybRejectionReason: null,
    kybDocuments: [
      {
        type: 'business_registration',
        url: '/kyb-sample-document-1.jpg',
        status: 'verified',
        uploadedAt: '2026-01-20T10:00:00Z',
      },
    ],

    subscriptions: [
      {
        app: 'marketplace',
        plan: 'Free',
        planId: 'plan_marketplace_free',
        activeModules: [],
        billingState: 'free',
        renewsAt: null,
      },
    ],

    createdAt: '2026-01-15T09:00:00Z',
  },

  {
    id: 'biz_1004',
    businessId: 'biz_1004',
    name: 'Northline Farmers Cooperative Union',
    type: 'cooperative',
    countryCode: 'TZ',
    countryName: 'Tanzania',
    subRegion: 'east_africa',
    continent: 'africa',

    governanceStructure: {
      type: 'cooperative',
      chairman: 'Grace Mtemi',
      secretary: 'Joseph Mwangi',
      boardOfTrustees: ['Josephine Danladi', 'Samuel Obi', 'Grace Mtemi'],
    },

    keyOfficers: [
      { id: 'off_9', name: 'Grace Mtemi', position: 'Chairman / Leader', gender: 'female', phone: '+255701234504', email: 'grace@northlineproduce.co.tz' },
      { id: 'off_10', name: 'Joseph Mwangi', position: 'General Secretary', gender: 'male', phone: '+255702111333', email: 'secretary@northlineproduce.co.tz' },
      { id: 'off_11', name: 'Agnes Kilonzo', position: 'Credit Officer', gender: 'female', phone: '+255704222444', email: 'credit@northlineproduce.co.tz' },
      { id: 'off_12', name: 'David Ochieng', position: 'Training & Advisory Officer', gender: 'male', phone: '+255706555777', email: 'training@northlineproduce.co.tz' },
      { id: 'off_13', name: 'Sarah Hassan', position: 'Coordinating Officer', gender: 'female', phone: '+255708888999', email: 'coordination@northlineproduce.co.tz' },
    ],

    commodityFocus: ['Cashew Nuts', 'Maize', 'Sunflower Seeds'],

    owner: {
      name: 'Grace Mtemi',
      email: 'grace@northlineproduce.co.tz',
      phone: '+255701234504',
    },

    teamMembers: [
      {
        id: 'usr_tm_4',
        name: 'Samuel Obi',
        email: 'samuel@northlineproduce.com',
        role: 'admin',
        isActive: true,
        joinedAt: '2026-07-01',
      },
    ],

    kybStatus: 'pending',
    pendingReason: 'Pending Tax Clearance Certificate (TIN) and Social Underwriting Field Verification',
    kybSubmittedAt: '2026-07-20T09:00:00Z',
    kybApprovedAt: null,
    kybRejectionReason: null,
    kybDocuments: [],

    // Reconciled against Billing's real subscription (sub_007) — this org
    // was still showing a stale marketplace/Free entry despite genuinely
    // holding an active Government-tier subscription over there. One org,
    // one truth.
    subscriptions: [
      {
        app: 'platform',
        plan: 'Government',
        planId: 'plan_platform_government',
        activeModules: [
          'farmer_database',
          'extended_profile',
          'family_data',
          'location_mapping',
          'plot_registry',
          'compliance_monitoring',
          'clmrs',
          'worker_welfare',
          'pesticide_tracking',
          'carbon_sustainability',
          'soil_carbon',
          'agroforestry',
          'export_traceability',
        ],
        billingState: 'paid',
        renewsAt: '2027-02-01',
      },
    ],

    createdAt: '2026-07-20T09:00:00Z',
  },

  {
    id: 'biz_1005',
    businessId: 'biz_1005',
    name: 'Highveld AgroTraders Ltd',
    type: 'merchant',
    countryCode: 'ZA',
    countryName: 'South Africa',
    subRegion: 'southern_africa',
    continent: 'africa',

    governanceStructure: {
      type: 'corporate',
      directors: ['Yusuf Botha', 'Thabo Mbeki'],
      shareholders: ['Yusuf Botha (100%)'],
    },

    keyOfficers: [
      { id: 'off_4', name: 'Yusuf Botha', position: 'Chief Executive Officer', gender: 'male', phone: '+27 80 123 4505', email: 'yusuf@highveld-agrotraders.co.za' },
      { id: 'off_5', name: 'Thabo Mbeki', position: 'Grain Storekeeper', gender: 'male', phone: '+27 80 433 3221', email: 'thabo@highveld-agrotraders.co.za' },
    ],

    commodityFocus: ['Soybeans', 'Maize', 'Wheat'],

    owner: {
      name: 'Yusuf Botha',
      email: 'yusuf@highveld-agrotraders.co.za',
      phone: '+27 80 123 4505',
    },

    teamMembers: [],

    kybStatus: 'approved',
    kybSubmittedAt: '2026-01-05T10:00:00Z',
    kybApprovedAt: '2026-01-12T10:00:00Z',
    kybRejectionReason: null,
    kybDocuments: [
      {
        type: 'business_registration',
        url: '/kyb-sample-document-2.jpg',
        status: 'verified',
        uploadedAt: '2026-01-05T10:00:00Z',
      },
    ],

    subscriptions: [
      {
        app: 'croppilot',
        plan: 'Starter',
        planId: 'plan_croppilot_starter',
        activeModules: [
        'farmer_database',
        'extended_profile',
        'family_data',
        'location_mapping',
        'plot_registry',
        ],
        billingState: 'paid',
        renewsAt: '2026-12-01',
      },
    ],

    createdAt: '2025-12-01T09:00:00Z',
  },

  {
    id: 'biz_1006',
    businessId: 'biz_1006',
    name: 'Riverbend Farmers Cooperative Union',
    type: 'cooperative',
    countryCode: 'CI',
    countryName: 'Ivory Coast',
    subRegion: 'west_africa',
    continent: 'africa',

    governanceStructure: {
      type: 'cooperative',
      chairman: 'Josephine Danladi',
      secretary: 'Kouassi Konan',
      boardOfTrustees: ['Josephine Danladi', 'Kouassi Konan'],
    },

    keyOfficers: [
      { id: 'off_14', name: 'Josephine Danladi', position: 'Board President', gender: 'female', phone: '+2258096667777', email: 'josephine@riverbendfarmers.ci' },
      { id: 'off_15', name: 'Kouassi Konan', position: 'Cooperative Treasurer', gender: 'male', phone: '+2258073331111', email: 'treasury@riverbendfarmers.ci' },
    ],

    commodityFocus: ['Cocoa', 'Palm Oil', 'Cassava'],

    owner: {
      name: 'Josephine Danladi',
      email: 'josephine@riverbendfarmers.ci',
      phone: '+225012345006',
    },

    teamMembers: [],

    kybStatus: 'pending',
    pendingReason: 'Awaiting Physical Address Social Underwriting Verification by Zowasel Field Team',
    kybSubmittedAt: '2026-07-21T09:00:00Z',
    kybApprovedAt: null,
    kybRejectionReason: null,
    kybDocuments: [],

    subscriptions: [
      {
        app: 'croppilot',
        plan: 'Free',
        planId: 'plan_croppilot_free',
        activeModules: [
        'farmer_database',
        ],
        billingState: 'free',
        renewsAt: null,
      },
    ],

    createdAt: '2026-06-10T09:00:00Z',
  },

  // --- Organizations backfilled to match names already used in billing records ---
  {
    id: 'biz_1007',
    businessId: 'biz_1007',
    name: 'FarmFresh Cooperative',
    type: 'cooperative',
    countryCode: 'NG',
    countryName: 'Nigeria',
    subRegion: 'west_africa',
    continent: 'africa',
    owner: { name: 'Adaeze Nwankwo', email: 'adaeze@farmfreshcoop.com', phone: '+234 802 456 7001' },
    teamMembers: [],
    kybStatus: 'approved',
    kybSubmittedAt: '2026-04-01T09:00:00Z',
    kybApprovedAt: '2026-04-08T09:00:00Z',
    kybRejectionReason: null,
    kybDocuments: [],
    subscriptions: [
      {
        app: 'platform',
        plan: 'Enterprise',
        planId: 'plan_platform_enterprise',
        activeModules: [
        'farmer_database',
        'extended_profile',
        'family_data',
        'location_mapping',
        'plot_registry',
        'compliance_monitoring',
        'clmrs',
        'worker_welfare',
        'pesticide_tracking',
        'carbon_sustainability',
        'soil_carbon',
        'agroforestry',
        'export_traceability',
        'marketplace_listings',
        'market_analytics',
        ],
        billingState: 'paid',
        renewsAt: '2026-08-15',
      },
    ],
    createdAt: '2026-03-20T09:00:00Z',
  },
  {
    id: 'biz_1008',
    businessId: 'biz_1008',
    name: 'AgroHub Ghana',
    type: 'agrodealer',
    countryCode: 'GH',
    countryName: 'Ghana',
    subRegion: 'west_africa',
    continent: 'africa',
    owner: { name: 'Kwabena Asante', email: 'kwabena@agrohubgh.com', phone: '+233 244 567 002' },
    teamMembers: [],
    kybStatus: 'approved',
    kybSubmittedAt: '2026-03-15T09:00:00Z',
    kybApprovedAt: '2026-03-22T09:00:00Z',
    kybRejectionReason: null,
    kybDocuments: [],
    subscriptions: [
      {
        app: 'croppilot',
        plan: 'Growth',
        planId: 'plan_croppilot_growth',
        activeModules: [
        'farmer_database',
        'extended_profile',
        'family_data',
        'location_mapping',
        'plot_registry',
        'carbon_sustainability',
        'soil_carbon',
        'agroforestry',
        ],
        billingState: 'paid',
        renewsAt: '2026-09-01',
      },
    ],
    createdAt: '2026-03-01T09:00:00Z',
  },
  {
    id: 'biz_1009',
    businessId: 'biz_1009',
    name: 'Green Harvest Ltd',
    type: 'merchant',
    countryCode: 'NG',
    countryName: 'Nigeria',
    subRegion: 'west_africa',
    continent: 'africa',
    owner: { name: 'Emeka Obiora', email: 'emeka@greenharvestltd.com', phone: '+234 803 567 003' },
    teamMembers: [],
    kybStatus: 'approved',
    kybSubmittedAt: '2026-02-10T09:00:00Z',
    kybApprovedAt: '2026-02-18T09:00:00Z',
    kybRejectionReason: null,
    kybDocuments: [],
    subscriptions: [
      {
        app: 'croppilot',
        plan: 'Carbon',
        planId: 'plan_croppilot_carbon',
        activeModules: [
        'carbon_sustainability',
        'soil_carbon',
        'agroforestry',
        'export_traceability',
        ],
        billingState: 'paid',
        renewsAt: '2026-08-01',
      },
    ],
    createdAt: '2026-01-25T09:00:00Z',
  },
  {
    id: 'biz_1010',
    businessId: 'biz_1010',
    name: 'Savannah Growers',
    type: 'cooperative',
    countryCode: 'KE',
    countryName: 'Kenya',
    subRegion: 'east_africa',
    continent: 'africa',
    owner: { name: 'Wanjiru Kamau', email: 'wanjiru@savannahgrowers.co.ke', phone: '+254 712 345 004' },
    teamMembers: [],
    kybStatus: 'pending',
    kybSubmittedAt: '2026-07-05T09:00:00Z',
    kybApprovedAt: null,
    kybRejectionReason: null,
    kybDocuments: [],
    subscriptions: [
      {
        app: 'croppilot',
        plan: 'Starter',
        planId: 'plan_croppilot_starter',
        activeModules: [
        'farmer_database',
        'extended_profile',
        'family_data',
        'location_mapping',
        'plot_registry',
        ],
        billingState: 'expired',
        renewsAt: '2026-06-20',
      },
    ],
    createdAt: '2026-06-28T09:00:00Z',
  },
  {
    id: 'biz_1011',
    businessId: 'biz_1011',
    name: 'Harvest Link Africa',
    type: 'buyer',
    countryCode: 'NG',
    countryName: 'Nigeria',
    subRegion: 'west_africa',
    continent: 'africa',
    owner: { name: 'Tunde Bakare', email: 'tunde@harvestlinkafrica.com', phone: '+234 805 678 005' },
    teamMembers: [],
    assignedStaff: {
      primary: { id: 'usr_staff_19', name: 'Adebayo Ogunleye' },
    },
    kybStatus: 'approved',
    kybSubmittedAt: '2026-02-01T09:00:00Z',
    kybApprovedAt: '2026-02-09T09:00:00Z',
    kybRejectionReason: null,
    kybDocuments: [],
    subscriptions: [
      {
        app: 'croppilot',
        plan: 'Growth',
        planId: 'plan_croppilot_growth',
        activeModules: [
        'farmer_database',
        'extended_profile',
        'family_data',
        'location_mapping',
        'plot_registry',
        'carbon_sustainability',
        'soil_carbon',
        'agroforestry',
        ],
        billingState: 'paid',
        renewsAt: '2026-07-05',
      },
    ],
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'biz_1012',
    businessId: 'biz_1012',
    name: 'AgriConnect Zambia',
    type: 'agrodealer',
    countryCode: 'ZM',
    countryName: 'Zambia',
    subRegion: 'southern_africa',
    continent: 'africa',
    owner: { name: 'Mwamba Chileshe', email: 'mwamba@agriconnectzm.com', phone: '+260 977 123 006' },
    teamMembers: [],
    kybStatus: 'approved',
    kybSubmittedAt: '2026-03-05T09:00:00Z',
    kybApprovedAt: '2026-03-14T09:00:00Z',
    kybRejectionReason: null,
    kybDocuments: [],
    subscriptions: [
      {
        app: 'marketplace',
        plan: 'Growth',
        planId: 'plan_marketplace_growth',
        activeModules: [
        'marketplace_listings',
        'market_analytics',
        ],
        billingState: 'paid',
        renewsAt: '2026-12-20',
      },
    ],
    createdAt: '2026-02-20T09:00:00Z',
  },
  {
    id: 'biz_1013',
    businessId: 'biz_1013',
    name: 'EcoFarm Nigeria',
    type: 'merchant',
    countryCode: 'NG',
    countryName: 'Nigeria',
    subRegion: 'west_africa',
    continent: 'africa',
    owner: { name: 'Ngozi Eze', email: 'ngozi@ecofarmng.com', phone: '+234 806 789 007' },
    teamMembers: [],
    kybStatus: 'approved',
    kybSubmittedAt: '2026-01-20T09:00:00Z',
    kybApprovedAt: '2026-01-28T09:00:00Z',
    kybRejectionReason: null,
    kybDocuments: [],
    subscriptions: [
      {
        app: 'croppilot',
        plan: 'Starter',
        planId: 'plan_croppilot_starter',
        activeModules: [
        'farmer_database',
        'extended_profile',
        'family_data',
        'location_mapping',
        'plot_registry',
        ],
        billingState: 'paid',
        renewsAt: '2026-08-10',
      },
    ],
    createdAt: '2026-01-05T09:00:00Z',
  },
  {
    id: 'biz_1014',
    businessId: 'biz_1014',
    name: 'Kilimanjaro Produce',
    type: 'buyer',
    countryCode: 'TZ',
    countryName: 'Tanzania',
    subRegion: 'east_africa',
    continent: 'africa',
    owner: { name: 'Amani Mushi', email: 'amani@kilimanjaroproduce.co.tz', phone: '+255 713 456 008' },
    teamMembers: [],
    kybStatus: 'pending',
    kybSubmittedAt: '2026-07-10T09:00:00Z',
    kybApprovedAt: null,
    kybRejectionReason: null,
    kybDocuments: [],
    subscriptions: [
      {
        app: 'marketplace',
        plan: 'Free',
        planId: 'plan_marketplace_free',
        activeModules: [],
        billingState: 'free',
        renewsAt: null,
      },
    ],
    createdAt: '2026-06-30T09:00:00Z',
  },
];
