import { Organization } from "@/types/organization";

export const mockOrganizations: Organization[] = [
  {
    id: "biz_1001",
    businessId: "biz_1001",
    name: "Greenfields Agro Cooperative",
    type: "cooperative",

    owner: {
      name: "Chiamaka Eze",
      email: "chiamaka@greenfieldsagro.com",
      phone: "+2348012345001",
    },

    teamMembers: [
      {
        id: "tm_1",
        name: "Tunde Okafor",
        email: "tunde@greenfieldsagro.com",
        role: "admin",
        isActive: true,
        joinedAt: "2026-02-10",
      },
      {
        id: "tm_2",
        name: "Ada Nwosu",
        email: "ada@greenfieldsagro.com",
        role: "viewer",
        isActive: true,
        joinedAt: "2026-03-01",
      },
    ],

    kybStatus: "approved",
    kybSubmittedAt: "2026-03-15T10:30:00Z",
    kybApprovedAt: "2026-03-20T14:45:00Z",
    kybRejectionReason: null,
    kybDocuments: [
      {
        type: "business_registration",
        url: "/kyb-sample-document-1.jpg",
        status: "verified",
        uploadedAt: "2026-03-15T10:00:00Z",
      },
      {
        type: "tax_clearance",
        url: "/kyb-sample-document-2.jpg",
        status: "verified",
        uploadedAt: "2026-03-15T10:05:00Z",
      },
    ],

    subscriptions: [
      {
        app: "croppilot",
        plan: "Growth",
        activeModules: [
          "farmer_database",
          "soil_carbon_sequestration",
        ],
        billingState: "paid",
        renewsAt: "2026-08-01",
      },
      {
        app: "marketplace",
        plan: "Free",
        activeModules: [],
        billingState: "free",
        renewsAt: null,
      },
    ],

    createdAt: "2026-02-01T09:00:00Z",
  },

  {
    id: "biz_1002",
    businessId: "biz_1002",
    name: "Sahel Grains Ltd",
    type: "agrodealer",

    owner: {
      name: "Ibrahim Musa",
      email: "ibrahim@sahelgrains.com",
      phone: "+2348012345002",
    },

    teamMembers: [
      {
        id: "tm_3",
        name: "Fatima Bello",
        email: "fatima@sahelgrains.com",
        role: "member",
        isActive: true,
        joinedAt: "2026-05-12",
      },
    ],

    kybStatus: "pending",
    kybSubmittedAt: "2026-07-18T08:00:00Z",
    kybApprovedAt: null,
    kybRejectionReason: null,
    kybDocuments: [
      {
        type: "business_registration",
        url: "/kyb-sample-document-1.jpg",
        status: "pending",
        uploadedAt: "2026-07-18T08:00:00Z",
      },
      {
        type: "directors_id",
        url: "/kyb-sample-document-2.jpg",
        status: "pending",
        uploadedAt: "2026-07-18T08:02:00Z",
      },
    ],

    subscriptions: [
      {
        app: "croppilot",
        plan: "Free",
        activeModules: ["farmer_database"],
        billingState: "free",
        renewsAt: null,
      },
    ],

    createdAt: "2026-07-10T09:00:00Z",
  },

  {
    id: "biz_1003",
    businessId: "biz_1003",
    name: "Delta Basin Farms",
    type: "buyer",

    owner: {
      name: "Peter Effiong",
      email: "peter@deltabasinfarms.com",
      phone: "+2348012345003",
    },

    teamMembers: [],

    kybStatus: "rejected",
    kybSubmittedAt: "2026-06-01T11:00:00Z",
    kybApprovedAt: null,
    kybRejectionReason:
      "Business registration certificate has expired. Please resubmit a current copy.",
    kybDocuments: [
      {
        type: "business_registration",
        url: "/kyb-sample-document-1.jpg",
        status: "rejected",
        uploadedAt: "2026-06-01T11:00:00Z",
        rejectionReason: "Certificate expired as of 2026-01-01.",
      },
    ],

    subscriptions: [
      {
        app: "croppilot",
        plan: "Free",
        activeModules: [],
        billingState: "free",
        renewsAt: null,
      },
    ],

    createdAt: "2026-05-20T09:00:00Z",
  },

  {
    id: "biz_1004",
    businessId: "biz_1004",
    name: "Northline Produce Cooperative",
    type: "cooperative",

    owner: {
      name: "Grace Adeyemi",
      email: "grace@northlineproduce.com",
      phone: "+2348012345004",
    },

    teamMembers: [
      {
        id: "tm_4",
        name: "Samuel Obi",
        email: "samuel@northlineproduce.com",
        role: "admin",
        isActive: true,
        joinedAt: "2026-07-01",
      },
      {
        id: "tm_5",
        name: "Blessing Udo",
        email: "blessing@northlineproduce.com",
        role: "member",
        isActive: false,
        joinedAt: "2026-07-05",
      },
    ],

    kybStatus: "not_submitted",
    kybSubmittedAt: null,
    kybApprovedAt: null,
    kybRejectionReason: null,
    kybDocuments: [],

    subscriptions: [
      {
        app: "marketplace",
        plan: "Free",
        activeModules: [],
        billingState: "free",
        renewsAt: null,
      },
    ],

    createdAt: "2026-07-20T09:00:00Z",
  },

  {
    id: "biz_1005",
    businessId: "biz_1005",
    name: "Kaduna AgroTraders",
    type: "merchant",

    owner: {
      name: "Yusuf Abdullahi",
      email: "yusuf@kaduna-agrotraders.com",
      phone: "+2348012345005",
    },

    teamMembers: [
      {
        id: "tm_6",
        name: "Hauwa Sani",
        email: "hauwa@kaduna-agrotraders.com",
        role: "admin",
        isActive: true,
        joinedAt: "2026-01-15",
      },
      {
        id: "tm_7",
        name: "Emeka Umeh",
        email: "emeka@kaduna-agrotraders.com",
        role: "member",
        isActive: true,
        joinedAt: "2026-02-20",
      },
      {
        id: "tm_8",
        name: "Ngozi Chukwu",
        email: "ngozi@kaduna-agrotraders.com",
        role: "viewer",
        isActive: true,
        joinedAt: "2026-03-10",
      },
    ],

    kybStatus: "approved",
    kybSubmittedAt: "2026-01-05T10:00:00Z",
    kybApprovedAt: "2026-01-12T10:00:00Z",
    kybRejectionReason: null,
    kybDocuments: [
      {
        type: "business_registration",
        url: "/kyb-sample-document-2.jpg",
        status: "verified",
        uploadedAt: "2026-01-05T10:00:00Z",
      },
      {
        type: "tax_clearance",
        url: "/kyb-sample-document-1.jpg",
        status: "verified",
        uploadedAt: "2026-01-05T10:10:00Z",
      },
      {
        type: "utility_bill",
        url: "/kyb-sample-document-2.jpg",
        status: "verified",
        uploadedAt: "2026-01-05T10:15:00Z",
      },
    ],

    subscriptions: [
      {
        app: "croppilot",
        plan: "Growth",
        activeModules: [
          "farmer_database",
          "extended_farmer_profile",
          "crop_calendar_scheduling",
        ],
        billingState: "paid",
        renewsAt: "2026-08-12",
      },
      {
        app: "marketplace",
        plan: "Business",
        activeModules: ["marketplace_listings"],
        billingState: "paid",
        renewsAt: "2026-08-12",
      },
    ],

    createdAt: "2025-12-01T09:00:00Z",
  },

  {
    id: "biz_1006",
    businessId: "biz_1006",
    name: "Riverbend Farmers Union",
    type: "cooperative",

    owner: {
      name: "Josephine Danladi",
      email: "josephine@riverbendfarmers.org",
      phone: "+2348012345006",
    },

    teamMembers: [
      {
        id: "tm_9",
        name: "Aminu Garba",
        email: "aminu@riverbendfarmers.org",
        role: "member",
        isActive: true,
        joinedAt: "2026-06-15",
      },
    ],

    kybStatus: "pending",
    kybSubmittedAt: "2026-07-21T09:00:00Z",
    kybApprovedAt: null,
    kybRejectionReason: null,
    kybDocuments: [
      {
        type: "business_registration",
        url: "/kyb-sample-document-1.jpg",
        status: "pending",
        uploadedAt: "2026-07-21T09:00:00Z",
      },
      {
        type: "memorandum",
        url: "/kyb-sample-document-2.jpg",
        status: "verified",
        uploadedAt: "2026-07-21T09:05:00Z",
      },
    ],

    subscriptions: [
      {
        app: "croppilot",
        plan: "Free",
        activeModules: ["farmer_database"],
        billingState: "free",
        renewsAt: null,
      },
    ],

    createdAt: "2026-06-10T09:00:00Z",
  },
];
