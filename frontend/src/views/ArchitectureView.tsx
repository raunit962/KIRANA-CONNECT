import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import {
  Layers,
  Network,
  Cpu,
  Database,
  ShieldCheck,
  Server,
  Code,
  Copy,
  Check,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Play,
  Filter,
  Sparkles,
  FileCode2,
  ArrowRight,
  Boxes,
  Radio,
  User,
  Bike,
  Store,
  QrCode,
  MapPin,
  Clock,
  Volume2,
  CheckCircle2,
  Search,
  Sliders,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface ArchitectureNode {
  id: string;
  name: string;
  file?: string;
  githubPath?: string;
  layer: 'ACTORS' | 'PORTALS' | 'OPERATIONAL_UI' | 'BACKEND_API' | 'DOMAIN_SERVICES';
  layerTitle: string;
  icon: any;
  color: string;
  bgLight: string;
  badge: string;
  description: string;
  keyFunctions: string[];
  inbound: { source: string; relation: string }[];
  outbound: { target: string; relation: string }[];
  navTarget?: string;
  openAction?: string;
}

export const ARCHITECTURE_NODES: Record<string, ArchitectureNode> = {
  node_customer: {
    id: 'node_customer',
    name: 'Customer',
    layer: 'ACTORS',
    layerTitle: 'System Actors',
    icon: User,
    color: '#0F291E',
    bgLight: 'bg-[#fffd47]/20 border-[#fffd47]/60 text-[#0F291E]',
    badge: 'End User',
    description: 'E-commerce buyer receiving deliveries via neighborhood PUDO Kirana stores.',
    keyFunctions: [
      'Receives WhatsApp & SMS notification with digital Boarding Pass',
      'Tracks 72-hour pickup SLA countdown timer',
      'Presents secure encrypted QR or audio OTP at local Kirana counter',
    ],
    inbound: [],
    outbound: [{ target: 'node_customer_portal', relation: 'uses' }],
    navTarget: 'CUSTOMER',
  },
  node_rider: {
    id: 'node_rider',
    name: 'Delivery Rider',
    layer: 'ACTORS',
    layerTitle: 'System Actors',
    icon: Bike,
    color: '#0284C7',
    bgLight: 'bg-[#E0F2FE] border-[#BAE6FD] text-[#0284C7]',
    badge: 'Gig Agent',
    description: 'Last-mile logistics delivery partner executing consolidated batch drops.',
    keyFunctions: [
      'Executes 10-15 parcel consolidated drops at single Kirana hub in 4 minutes',
      'Uploads geo-tagged camera photo proof of shelf handover',
      'Saves 42 km of doorstep vehicle idling per shift',
    ],
    inbound: [],
    outbound: [{ target: 'node_agent_portal', relation: 'uses' }],
    navTarget: 'AGENT',
  },
  node_merchant: {
    id: 'node_merchant',
    name: 'Kirana Merchant',
    layer: 'ACTORS',
    layerTitle: 'System Actors',
    icon: Store,
    color: '#1A5336',
    bgLight: 'bg-[#EAF3ED] border-[#CDE3D5] text-[#1A5336]',
    badge: 'Hub Operator',
    description: 'Neighborhood grocery retailer acting as micro-fulfillment & staging center.',
    keyFunctions: [
      'Scans incoming packages onto labeled 2D shelf matrix (A-01 to C-10)',
      'Validates customer QR / OTP with Instant UPI Soundbox audio feedback',
      'Earns instant ₹15 per parcel commission credited directly to bank account',
    ],
    inbound: [],
    outbound: [{ target: 'node_merchant_portal', relation: 'uses' }],
    navTarget: 'MERCHANT',
  },
  node_admin: {
    id: 'node_admin',
    name: 'Logistics Admin',
    layer: 'ACTORS',
    layerTitle: 'System Actors',
    icon: ShieldCheck,
    color: '#0284C7',
    bgLight: 'bg-[#E0F2FE] border-[#BAE6FD] text-[#0284C7]',
    badge: 'Operations',
    description: 'Logistics network supervisor managing capacity, dispatch, and ESG telemetry.',
    keyFunctions: [
      'Monitors real-time city-wide Kirana network capacity & dispatch pipelines',
      'Tunes Haversine AI proximity weights, rating bonuses, and slot thresholds',
      'Audits cumulative carbon emissions saved and ROI metrics',
    ],
    inbound: [],
    outbound: [{ target: 'node_admin_portal', relation: 'uses' }],
    navTarget: 'ADMIN',
  },

  // Role Portals
  node_app: {
    id: 'node_app',
    name: 'App Shell',
    file: 'frontend/src/App.tsx',
    githubPath: 'frontend/src/App.tsx',
    layer: 'PORTALS',
    layerTitle: 'Role Portals (Frontend)',
    icon: Boxes,
    color: '#0F291E',
    bgLight: 'bg-emerald-50 border-emerald-300 text-emerald-900',
    badge: 'Client Container',
    description: 'Central React application shell orchestrating global state, layout, and role switches.',
    keyFunctions: [
      'Initializes AppProvider contextual store and sound effects',
      'Manages high-level view routing (COVER, CUSTOMER, AGENT, MERCHANT, ADMIN, SIMULATOR, ARCHITECTURE)',
      'Hosts global Indian mobile AuthModal and sliding navigation drawer',
    ],
    inbound: [],
    outbound: [
      { target: 'node_customer_portal', relation: 'renders' },
      { target: 'node_agent_portal', relation: 'renders' },
      { target: 'node_merchant_portal', relation: 'renders' },
      { target: 'node_admin_portal', relation: 'renders' },
      { target: 'node_auth', relation: 'opens' },
      { target: 'node_status_timeline', relation: 'renders' },
      { target: 'node_map', relation: 'renders' },
    ],
    navTarget: 'COVER',
  },
  node_customer_portal: {
    id: 'node_customer_portal',
    name: 'Customer Portal',
    file: 'frontend/src/views/CustomerPortal.tsx',
    githubPath: 'frontend/src/views/CustomerPortal.tsx',
    layer: 'PORTALS',
    layerTitle: 'Role Portals (Frontend)',
    icon: User,
    color: '#1A5336',
    bgLight: 'bg-[#fffd47]/20 border-[#fffd47]/60 text-[#0F291E]',
    badge: 'UI View',
    description: 'Digital self-pickup interface with QR boarding pass, PIN verification, and store directions.',
    keyFunctions: [
      'Interactive QR Boarding Pass with dynamic 4-digit security PIN',
      'Real-time 72-hour pickup countdown SLA with warning badges',
      'Embedded WhatsApp pass forwarder and 1-tap Google Maps directions to store',
    ],
    inbound: [
      { source: 'node_customer', relation: 'uses' },
      { source: 'node_app', relation: 'renders' },
    ],
    outbound: [],
    navTarget: 'CUSTOMER',
  },
  node_agent_portal: {
    id: 'node_agent_portal',
    name: 'Agent Portal',
    file: 'frontend/src/views/AgentPortal.tsx',
    githubPath: 'frontend/src/views/AgentPortal.tsx',
    layer: 'PORTALS',
    layerTitle: 'Role Portals (Frontend)',
    icon: Bike,
    color: '#0284C7',
    bgLight: 'bg-[#E0F2FE] border-[#BAE6FD] text-[#0284C7]',
    badge: 'UI View',
    description: 'High-speed delivery agent operating cockpit for consolidated Kirana drops.',
    keyFunctions: [
      '1-Click Consolidated Batch Handover for 10-15 parcels',
      'Photo proof-of-delivery capture with camera snapshot & file uploads',
      'Direct route navigation and merchant contact trigger',
    ],
    inbound: [
      { source: 'node_rider', relation: 'uses' },
      { source: 'node_app', relation: 'renders' },
    ],
    outbound: [],
    navTarget: 'AGENT',
  },
  node_merchant_portal: {
    id: 'node_merchant_portal',
    name: 'Merchant Portal',
    file: 'frontend/src/views/MerchantPortal.tsx',
    githubPath: 'frontend/src/views/MerchantPortal.tsx',
    layer: 'PORTALS',
    layerTitle: 'Role Portals (Frontend)',
    icon: Store,
    color: '#1A5336',
    bgLight: 'bg-[#EAF3ED] border-[#CDE3D5] text-[#1A5336]',
    badge: 'UI View',
    description: 'Neighborhood dukandar operational hub with physical inventory visualizer and UPI payout logs.',
    keyFunctions: [
      'Integrated 2D Shelf Matrix visualizer (Slots A-01 to C-10) with 5 package color categories',
      'Hover parcel inspection card with contents, serial tags, and customer metadata',
      'Filterable store parcel dropdown explorer and automated payout earnings ledger',
    ],
    inbound: [
      { source: 'node_merchant', relation: 'uses' },
      { source: 'node_app', relation: 'renders' },
    ],
    outbound: [],
    navTarget: 'MERCHANT',
  },
  node_admin_portal: {
    id: 'node_admin_portal',
    name: 'Admin Portal',
    file: 'frontend/src/views/AdminPortal.tsx',
    githubPath: 'frontend/src/views/AdminPortal.tsx',
    layer: 'PORTALS',
    layerTitle: 'Role Portals (Frontend)',
    icon: ShieldCheck,
    color: '#0284C7',
    bgLight: 'bg-[#E0F2FE] border-[#BAE6FD] text-[#0284C7]',
    badge: 'UI View',
    description: 'Centralized urban logistics operations tower, AI matchmaking simulator, and ESG scorecard.',
    keyFunctions: [
      'Interactive store dispatch simulation with customizable destination coordinates',
      'Store onboarding form with live capacity gauge (40-slot threshold)',
      'Green Footprint carbon savings telemetry vs conventional doorstep vans',
    ],
    inbound: [
      { source: 'node_admin', relation: 'uses' },
      { source: 'node_app', relation: 'renders' },
    ],
    outbound: [],
    navTarget: 'ADMIN',
  },

  // Operational UI
  node_auth: {
    id: 'node_auth',
    name: 'Role Auth',
    file: 'frontend/src/components/AuthModal.tsx',
    githubPath: 'frontend/src/components/AuthModal.tsx',
    layer: 'OPERATIONAL_UI',
    layerTitle: 'Operational UI Components',
    icon: KeyRoundIcon,
    color: '#0F291E',
    bgLight: 'bg-amber-50 border-amber-300 text-amber-900',
    badge: 'Modal Dialog',
    description: 'Indian mobile-first authentication system with 4-digit OTP simulation and 1-click fast passes.',
    keyFunctions: [
      '3 Dedicated Indian personas: Customer (Ananya), Rider (Rajesh Kumar), Merchant (Ramesh Gupta)',
      'Auto-advancing 4-digit OTP input boxes with re-send countdown',
      'Persists authenticated profile to React context with instant role onboarding',
    ],
    inbound: [{ source: 'node_app', relation: 'opens' }],
    outbound: [],
    openAction: 'AUTH_MODAL',
  },
  node_qr_scanner: {
    id: 'node_qr_scanner',
    name: 'QR Scanner',
    file: 'frontend/src/components/QRScannerModal.tsx',
    githubPath: 'frontend/src/components/QRScannerModal.tsx',
    layer: 'OPERATIONAL_UI',
    layerTitle: 'Operational UI Components',
    icon: QrCode,
    color: '#0284C7',
    bgLight: 'bg-blue-50 border-blue-300 text-blue-900',
    badge: 'Scanner Widget',
    description: 'High-speed camera & laser barcode simulation engine for instantaneous verification.',
    keyFunctions: [
      'High-frame video viewport with animated laser scanning reticle',
      'Simulates camera optical capture and instant QR decoding',
      'Triggers immediate audio scan beep sound effect upon lock-on',
    ],
    inbound: [],
    outbound: [],
  },
  node_status_timeline: {
    id: 'node_status_timeline',
    name: 'Status Timeline',
    file: 'frontend/src/components/StatusTimeline.tsx',
    githubPath: 'frontend/src/components/StatusTimeline.tsx',
    layer: 'OPERATIONAL_UI',
    layerTitle: 'Operational UI Components',
    icon: Clock,
    color: '#1A5336',
    bgLight: 'bg-emerald-50 border-emerald-300 text-emerald-900',
    badge: 'Status Pipeline',
    description: '5-Stage progressive parcel lifecycle visualizer with timestamped audit milestones.',
    keyFunctions: [
      'Pipeline: DISPATCHED -> RECEIVED_AT_HUB -> OUT_FOR_DELIVERY -> DELIVERED_TO_KIRANA -> PICKED_UP',
      'Dynamic color progression with animated pulses for in-flight packages',
      'Localized Hindi and English stage annotations',
    ],
    inbound: [{ source: 'node_app', relation: 'renders' }],
    outbound: [],
  },
  node_map: {
    id: 'node_map',
    name: 'Interactive Map',
    file: 'frontend/src/components/InteractiveMap.tsx',
    githubPath: 'frontend/src/components/InteractiveMap.tsx',
    layer: 'OPERATIONAL_UI',
    layerTitle: 'Operational UI Components',
    icon: MapPin,
    color: '#0284C7',
    bgLight: 'bg-sky-50 border-sky-300 text-sky-900',
    badge: 'Geospatial Canvas',
    description: 'Hyperlocal interactive map rendering Kirana hub pins, coverage radius circles, and active delivery routes.',
    keyFunctions: [
      'Calculates geodesic distances and optimal walking paths (< 400m)',
      'Visualizes Kirana store pins with live occupancy color codes',
      'Shows rider origin to Kirana consolidated drop paths',
    ],
    inbound: [{ source: 'node_app', relation: 'renders' }],
    outbound: [],
  },
  node_shelf: {
    id: 'node_shelf',
    name: 'Shelf Visualizer',
    file: 'frontend/src/components/ShelfRackVisualizer.tsx',
    githubPath: 'frontend/src/components/ShelfRackVisualizer.tsx',
    layer: 'OPERATIONAL_UI',
    layerTitle: 'Operational UI Components',
    icon: Boxes,
    color: '#1A5336',
    bgLight: 'bg-[#EAF3ED] border-[#CDE3D5] text-[#1A5336]',
    badge: 'Physical 2D Matrix',
    description: 'Interactive 3x10 physical shelf rack map representing physical store shelves with parcel classification.',
    keyFunctions: [
      'Color classification: Red (Electronics/Breakable), Yellow (Clothes/Skincare), Blue (Docs), Green (Kitchen), Purple (Health)',
      'Mouse hover comment box showing item contents, size, courier, and serial tag number',
      'Live slot occupancy indicator (e.g. 18 / 30 slots occupied)',
    ],
    inbound: [],
    outbound: [],
    navTarget: 'MERCHANT',
  },
  node_soundbox: {
    id: 'node_soundbox',
    name: 'UPI Soundbox',
    file: 'frontend/src/components/UPISoundbox.tsx',
    githubPath: 'frontend/src/components/UPISoundbox.tsx',
    layer: 'OPERATIONAL_UI',
    layerTitle: 'Operational UI Components',
    icon: Volume2,
    color: '#D97706',
    bgLight: 'bg-amber-50 border-amber-300 text-amber-900',
    badge: 'Audio Hardware UI',
    description: 'Hardware simulation of merchant IoT soundbox broadcasting vernacular payment confirmation.',
    keyFunctions: [
      'Vernacular audio playback: "KiranaConnect par ₹15 prapt hue"',
      'Dual speaker animation with pulsating volume bars during verification',
      'Provides indisputable physical confirmation to dukandar upon parcel release',
    ],
    inbound: [],
    outbound: [],
    navTarget: 'MERCHANT',
  },

  // Backend API
  node_server: {
    id: 'node_server',
    name: 'API Server',
    file: 'backend/src/server.ts',
    githubPath: 'backend/src/server.ts',
    layer: 'BACKEND_API',
    layerTitle: 'Backend API Layer',
    icon: Server,
    color: '#4338CA',
    bgLight: 'bg-indigo-50 border-indigo-300 text-indigo-900',
    badge: 'Express Core',
    description: 'Primary Express.js server initializing middleware, CORS, rate limits, and sub-routers.',
    keyFunctions: [
      'Mounts REST endpoints on /api/v1/parcels, /api/v1/stores, /api/v1/matching',
      'Global request logging, error boundary, and JSON payload handling',
      'Exposes health check and WebSocket event dispatching',
    ],
    inbound: [],
    outbound: [
      { target: 'node_parcel_routes', relation: 'mounts' },
      { target: 'node_store_controller', relation: 'routes' },
      { target: 'node_matching_controller', relation: 'routes' },
    ],
  },
  node_parcel_routes: {
    id: 'node_parcel_routes',
    name: 'Parcel Routes',
    file: 'backend/src/routes/parcels.routes.ts',
    githubPath: 'backend/src/routes/parcels.routes.ts',
    layer: 'BACKEND_API',
    layerTitle: 'Backend API Layer',
    icon: FileCode2,
    color: '#4338CA',
    bgLight: 'bg-indigo-50 border-indigo-300 text-indigo-900',
    badge: 'Router',
    description: 'REST route declarations for parcel creation, batch agent drops, and customer claims.',
    keyFunctions: [
      'POST /api/parcels/dispatch - Dispatches new shipment into network',
      'PUT /api/parcels/batch-drop - Agent bulk drop at designated Kirana',
      'POST /api/parcels/claim - Verifies customer OTP/QR and marks delivered',
    ],
    inbound: [{ source: 'node_server', relation: 'mounts' }],
    outbound: [{ target: 'node_parcel_controller', relation: 'dispatches' }],
  },
  node_parcel_controller: {
    id: 'node_parcel_controller',
    name: 'Parcel Controller',
    file: 'backend/src/controllers/parcelController.ts',
    githubPath: 'backend/src/controllers/parcelController.ts',
    layer: 'BACKEND_API',
    layerTitle: 'Backend API Layer',
    icon: Cpu,
    color: '#4338CA',
    bgLight: 'bg-indigo-50 border-indigo-300 text-indigo-900',
    badge: 'Controller',
    description: 'Coordinates parcel state transitions, invokes hub matching engine, and executes pickup security.',
    keyFunctions: [
      'Dispatches parcel and selects candidate hub via matchingEngine',
      'Enforces state machine transitions to prevent illegal jumps',
      'Verifies cryptographic pickup credentials before updating database',
    ],
    inbound: [{ source: 'node_parcel_routes', relation: 'dispatches' }],
    outbound: [
      { target: 'node_database', relation: 'reads/writes' },
      { target: 'node_matching', relation: 'selects hub' },
      { target: 'node_security', relation: 'validates pickup' },
      { target: 'node_models', relation: 'uses types' },
    ],
  },
  node_store_controller: {
    id: 'node_store_controller',
    name: 'Store Controller',
    file: 'backend/src/controllers/storeController.ts',
    githubPath: 'backend/src/controllers/storeController.ts',
    layer: 'BACKEND_API',
    layerTitle: 'Backend API Layer',
    icon: Store,
    color: '#4338CA',
    bgLight: 'bg-indigo-50 border-indigo-300 text-indigo-900',
    badge: 'Controller',
    description: 'Handles merchant registration, shelf capacity thresholds, and payout ledger entries.',
    keyFunctions: [
      'Registers new Kirana store with geolocation and shelf capacity',
      'Updates real-time available capacity upon parcel intake and exit',
      'Generates weekly and monthly merchant commission summaries',
    ],
    inbound: [{ source: 'node_server', relation: 'routes' }],
    outbound: [
      { target: 'node_database', relation: 'reads/writes' },
      { target: 'node_models', relation: 'uses types' },
    ],
  },
  node_matching_controller: {
    id: 'node_matching_controller',
    name: 'Matching Controller',
    file: 'backend/src/controllers/matchingController.ts',
    githubPath: 'backend/src/controllers/matchingController.ts',
    layer: 'BACKEND_API',
    layerTitle: 'Backend API Layer',
    icon: Network,
    color: '#4338CA',
    bgLight: 'bg-indigo-50 border-indigo-300 text-indigo-900',
    badge: 'Controller',
    description: 'REST endpoint for matching candidate Kirana hubs given delivery coordinates and pincode.',
    keyFunctions: [
      'Queries available stores within radial distance (< 3.0 km)',
      'Executes multi-factor ranking algorithm considering capacity and ratings',
      'Returns ranked list of candidate PUDO points to e-commerce checkout',
    ],
    inbound: [{ source: 'node_server', relation: 'routes' }],
    outbound: [
      { target: 'node_database', relation: 'reads stores' },
      { target: 'node_matching', relation: 'ranks hubs' },
    ],
  },

  // Domain Services
  node_database: {
    id: 'node_database',
    name: 'Mock Database',
    file: 'frontend/src/lib/mockDatabase.ts',
    githubPath: 'frontend/src/lib/mockDatabase.ts',
    layer: 'DOMAIN_SERVICES',
    layerTitle: 'Domain Services & Data Tier',
    icon: Database,
    color: '#0F291E',
    bgLight: 'bg-emerald-50 border-emerald-300 text-emerald-900',
    badge: 'Data Store',
    description: 'In-memory ACID mock data repository with seed data for stores, parcels, and financial payouts.',
    keyFunctions: [
      'Pre-populated with 5 authentic Indian neighborhood Kirana stores in Sector V Salt Lake',
      'Maintains transactional state across parcel dispatch, drop, and pickup',
      'Supports state reset and local storage persistence for live demos',
    ],
    inbound: [
      { source: 'node_parcel_controller', relation: 'reads/writes' },
      { source: 'node_store_controller', relation: 'reads/writes' },
      { source: 'node_matching_controller', relation: 'reads stores' },
    ],
    outbound: [],
  },
  node_matching: {
    id: 'node_matching',
    name: 'Hub Matching',
    file: 'frontend/src/lib/matchingEngine.ts',
    githubPath: 'frontend/src/lib/matchingEngine.ts',
    layer: 'DOMAIN_SERVICES',
    layerTitle: 'Domain Services & Data Tier',
    icon: Network,
    color: '#0284C7',
    bgLight: 'bg-[#E0F2FE] border-[#BAE6FD] text-[#0284C7]',
    badge: 'Algorithm',
    description: 'Geospatial Haversine calculation and multi-criteria scoring algorithm for PUDO assignment.',
    keyFunctions: [
      'Haversine Great-Circle distance calculation between customer destination and Kirana hubs',
      'Weighted ranking formula: Score = (10 - Distance) * Wp + CapacityRatio * Wc + Rating * Wr',
      'Filters out full stores (> 95% capacity) to prevent shelf overflow',
    ],
    inbound: [
      { source: 'node_parcel_controller', relation: 'selects hub' },
      { source: 'node_matching_controller', relation: 'ranks hubs' },
    ],
    outbound: [{ target: 'node_models', relation: 'uses types' }],
  },
  node_security: {
    id: 'node_security',
    name: 'Pickup Security',
    file: 'frontend/src/lib/securityService.ts',
    githubPath: 'frontend/src/lib/securityService.ts',
    layer: 'DOMAIN_SERVICES',
    layerTitle: 'Domain Services & Data Tier',
    icon: ShieldCheck,
    color: '#0F291E',
    bgLight: 'bg-amber-50 border-amber-300 text-amber-900',
    badge: 'Security Service',
    description: 'Cryptographic security engine for QR generation, PIN hashing, and pickup verification.',
    keyFunctions: [
      'Generates cryptographically random 4-digit numeric pickup PINs',
      'Constructs verifiable JSON QR payload containing parcel ID and tamper hash',
      'Enforces single-use verification token to prevent duplicate pickups',
    ],
    inbound: [{ source: 'node_parcel_controller', relation: 'validates pickup' }],
    outbound: [{ target: 'node_models', relation: 'validates parcel' }],
  },
  node_models: {
    id: 'node_models',
    name: 'Domain Types',
    file: 'frontend/src/types/index.ts',
    githubPath: 'frontend/src/types/index.ts',
    layer: 'DOMAIN_SERVICES',
    layerTitle: 'Domain Services & Data Tier',
    icon: Code,
    color: '#0F291E',
    bgLight: 'bg-emerald-50 border-emerald-300 text-emerald-900',
    badge: 'TypeScript Schemas',
    description: 'Universal TypeScript interfaces for Parcel, KiranaStore, DropStatus, Category, and Payout.',
    keyFunctions: [
      'Type definitions for Parcel, KiranaStore, DeliveryStatus, and ShelfSlot',
      'ParcelCategory enum and Indian geographic coordinate interfaces',
      'Guarantees strict end-to-end type safety across both frontend and backend',
    ],
    inbound: [
      { source: 'node_parcel_controller', relation: 'uses types' },
      { source: 'node_store_controller', relation: 'uses types' },
      { source: 'node_matching', relation: 'uses types' },
      { source: 'node_security', relation: 'validates parcel' },
    ],
    outbound: [],
  },
};

function KeyRoundIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
  );
}

const RAW_MERMAID_CODE = `flowchart TD
subgraph group_client["Role Portals"]
  node_app["App Shell<br/>[App.tsx]"]
  node_customer_portal["Customer Portal<br/>[CustomerPortal.tsx]"]
  node_agent_portal["Agent Portal<br/>[AgentPortal.tsx]"]
  node_merchant_portal["Merchant Portal<br/>[MerchantPortal.tsx]"]
  node_admin_portal["Admin Portal<br/>[AdminPortal.tsx]"]
end
subgraph group_ui["Operational UI"]
  node_auth["Role Auth<br/>[AuthModal.tsx]"]
  node_qr_scanner["QR Scanner<br/>[QRScannerModal.tsx]"]
  node_status_timeline["Status Timeline<br/>[StatusTimeline.tsx]"]
  node_map["Interactive Map<br/>[InteractiveMap.tsx]"]
  node_shelf["Shelf Visualizer"]
  node_soundbox["UPI Soundbox<br/>[UPISoundbox.tsx]"]
end
subgraph group_api["Backend API"]
  node_server["API Server<br/>[server.ts]"]
  node_parcel_routes["Parcel Routes<br/>[parcels.routes.ts]"]
  node_parcel_controller["Parcel Controller"]
  node_store_controller["Store Controller<br/>[storeController.ts]"]
  node_matching_controller["Matching Controller"]
end
subgraph group_domain["Domain Services"]
  node_database[("Mock Database<br/>[mockDatabase.ts]")]
  node_matching["Hub Matching<br/>[matchingEngine.ts]"]
  node_security["Pickup Security<br/>[securityService.ts]"]
  node_models["Domain Types<br/>[types.ts]"]
end
node_customer(("Customer"))
node_rider(("Delivery Rider"))
node_merchant(("Kirana Merchant"))
node_admin(("Logistics Admin"))
node_customer -->|"uses"| node_customer_portal
node_rider -->|"uses"| node_agent_portal
node_merchant -->|"uses"| node_merchant_portal
node_admin -->|"uses"| node_admin_portal
node_app -->|"renders"| node_customer_portal
node_app -->|"renders"| node_agent_portal
node_app -->|"renders"| node_merchant_portal
node_app -->|"renders"| node_admin_portal
node_app -->|"opens"| node_auth
node_app -->|"renders"| node_status_timeline
node_app -->|"renders"| node_map
node_server -->|"mounts"| node_parcel_routes
node_server -->|"routes"| node_store_controller
node_server -->|"routes"| node_matching_controller
node_parcel_routes -->|"dispatches"| node_parcel_controller
node_parcel_controller -->|"reads/writes"| node_database
node_parcel_controller -->|"selects hub"| node_matching
node_parcel_controller -->|"validates pickup"| node_security
node_store_controller -->|"reads/writes"| node_database
node_matching_controller -->|"reads stores"| node_database
node_matching_controller -->|"ranks hubs"| node_matching
node_parcel_controller -->|"uses types"| node_models
node_store_controller -->|"uses types"| node_models
node_matching -->|"uses types"| node_models
node_security -->|"validates parcel"| node_models`;

interface ArchitectureViewProps {
  onNavigateTab?: (tab: string) => void;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({ onNavigateTab }) => {
  const { openAuthModal } = useApp();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node_app');
  const [viewMode, setViewMode] = useState<'BLUEPRINT' | 'MERMAID_LIVE' | 'CODE'>('BLUEPRINT');
  const [filterLayer, setFilterLayer] = useState<string>('ALL');
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  const [simStep, setSimStep] = useState<number>(0);

  // Mermaid Live SVG Render Container
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [mermaidSvg, setMermaidSvg] = useState<string>('');
  const [mermaidError, setMermaidError] = useState<string | null>(null);

  // Initialize and Render Mermaid Diagram
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      themeVariables: {
        fontFamily: 'system-ui, sans-serif',
        primaryColor: '#EAF3ED',
        primaryTextColor: '#0F291E',
        primaryBorderColor: '#1A5336',
        lineColor: '#1A5336',
        secondaryColor: '#E0F2FE',
        tertiaryColor: '#FEF3C7',
      },
      flowchart: {
        curve: 'basis',
        htmlLabels: true,
      },
      securityLevel: 'loose',
    });

    const renderMermaid = async () => {
      try {
        const uniqueId = `mermaid_diag_${Date.now()}`;
        const { svg } = await mermaid.render(uniqueId, RAW_MERMAID_CODE);
        setMermaidSvg(svg);
        setMermaidError(null);
      } catch (err: any) {
        console.error('Mermaid render error:', err);
        setMermaidError('Failed to render official Mermaid SVG. You can view the Interactive Blueprint.');
      }
    };

    renderMermaid();
  }, []);

  // Simulation step timer
  useEffect(() => {
    if (!activeSimulation) {
      setSimStep(0);
      return;
    }

    const simPaths: Record<string, string[]> = {
      DISPATCH: [
        'node_admin',
        'node_admin_portal',
        'node_server',
        'node_matching_controller',
        'node_matching',
        'node_parcel_controller',
        'node_database',
        'node_status_timeline',
      ],
      PICKUP: [
        'node_customer',
        'node_customer_portal',
        'node_qr_scanner',
        'node_security',
        'node_merchant_portal',
        'node_soundbox',
        'node_shelf',
        'node_database',
      ],
      RIDER_DROP: [
        'node_rider',
        'node_agent_portal',
        'node_parcel_routes',
        'node_parcel_controller',
        'node_shelf',
        'node_database',
        'node_status_timeline',
      ],
    };

    const path = simPaths[activeSimulation] || [];
    if (path.length === 0) return;

    const interval = setInterval(() => {
      setSimStep((prev) => {
        if (prev + 1 >= path.length) {
          clearInterval(interval);
          setTimeout(() => setActiveSimulation(null), 2500);
          return prev;
        }
        const nextStep = prev + 1;
        setSelectedNodeId(path[nextStep]);
        return nextStep;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [activeSimulation]);

  const copyMermaidCode = () => {
    navigator.clipboard.writeText(RAW_MERMAID_CODE);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const selectedNode = ARCHITECTURE_NODES[selectedNodeId] || ARCHITECTURE_NODES['node_app'];

  const startSimulation = (simType: string) => {
    setActiveSimulation(simType);
    setSimStep(0);
    const startNode =
      simType === 'DISPATCH' ? 'node_admin' : simType === 'PICKUP' ? 'node_customer' : 'node_rider';
    setSelectedNodeId(startNode);
  };

  const isNodeHighlighted = (nodeId: string) => {
    if (selectedNodeId === nodeId) return true;
    if (activeSimulation) {
      const simPaths: Record<string, string[]> = {
        DISPATCH: [
          'node_admin',
          'node_admin_portal',
          'node_server',
          'node_matching_controller',
          'node_matching',
          'node_parcel_controller',
          'node_database',
          'node_status_timeline',
        ],
        PICKUP: [
          'node_customer',
          'node_customer_portal',
          'node_qr_scanner',
          'node_security',
          'node_merchant_portal',
          'node_soundbox',
          'node_shelf',
          'node_database',
        ],
        RIDER_DROP: [
          'node_rider',
          'node_agent_portal',
          'node_parcel_routes',
          'node_parcel_controller',
          'node_shelf',
          'node_database',
          'node_status_timeline',
        ],
      };
      const path = simPaths[activeSimulation] || [];
      return path.slice(0, simStep + 1).includes(nodeId);
    }
    // Check if connected
    const isInbound = selectedNode.inbound.some((i) => i.source === nodeId);
    const isOutbound = selectedNode.outbound.some((o) => o.target === nodeId);
    return isInbound || isOutbound;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* 1. Header Banner with GitDiagram Attribution & Statistics */}
      <div className="bg-[#0F291E] border border-[#1A5336] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-[#1A5336]/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-60 h-60 rounded-full bg-[#fffd47]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#1A5336] text-[#fffd47] px-3 py-1 rounded-full text-xs font-mono font-bold border border-[#fffd47]/30 flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-[#fffd47]" />
                <span>GitDiagram Architecture</span>
              </span>
              <a
                href="https://gitdiagram.com/raunit962/kirana-connect"
                target="_blank"
                rel="noreferrer"
                className="bg-black/40 hover:bg-black/60 text-[#D1E7DD] px-3 py-1 rounded-full text-xs font-mono transition flex items-center gap-1.5 border border-white/10"
              >
                <span>gitdiagram.com/raunit962/kirana-connect</span>
                <ExternalLink className="w-3 h-3 text-[#fffd47]" />
              </a>
              <a
                href="https://github.com/raunit962/kirana-connect"
                target="_blank"
                rel="noreferrer"
                className="bg-black/40 hover:bg-black/60 text-[#D1E7DD] px-3 py-1 rounded-full text-xs font-mono transition flex items-center gap-1.5 border border-white/10"
              >
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3 text-[#38BDF8]" />
              </a>
            </div>

            <h1 className="font-roxborough text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#F8F5EF] tracking-tight">
              Interactive System Architecture
            </h1>
            <p className="text-sm text-[#A3B8AD] leading-relaxed">
              Explore the complete 4-tier micro-fulfillment topology powering KiranaConnect:
              Actors, Role Portals, Operational UI, Backend REST APIs, and Core Domain Services.
            </p>
          </div>

          {/* Quick Metrics Badge Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
            <div className="bg-[#133827] border border-[#1A5336] rounded-2xl p-3 text-center">
              <div className="text-xl font-black text-[#fffd47]">4</div>
              <div className="text-[11px] font-bold text-[#A3B8AD]">Actors</div>
            </div>
            <div className="bg-[#133827] border border-[#1A5336] rounded-2xl p-3 text-center">
              <div className="text-xl font-black text-[#38BDF8]">5</div>
              <div className="text-[11px] font-bold text-[#A3B8AD]">Role Portals</div>
            </div>
            <div className="bg-[#133827] border border-[#1A5336] rounded-2xl p-3 text-center">
              <div className="text-xl font-black text-white">6</div>
              <div className="text-[11px] font-bold text-[#A3B8AD]">UI Modules</div>
            </div>
            <div className="bg-[#133827] border border-[#1A5336] rounded-2xl p-3 text-center">
              <div className="text-xl font-black text-[#4ADE80]">9</div>
              <div className="text-[11px] font-bold text-[#A3B8AD]">API &amp; Services</div>
            </div>
          </div>
        </div>

        {/* Live Simulation Trigger Buttons */}
        <div className="mt-6 pt-5 border-t border-[#1A5336]/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#fffd47]">
            <Radio className="w-4 h-4 text-[#fffd47] animate-pulse" />
            <span>Interactive Dataflow Simulations:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => startSimulation('DISPATCH')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeSimulation === 'DISPATCH'
                  ? 'bg-[#fffd47] text-[#0F291E] shadow-md'
                  : 'bg-[#1A5336] hover:bg-[#133F28] text-white border border-[#fffd47]/30'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>1. Admin Dispatch Flow</span>
            </button>

            <button
              onClick={() => startSimulation('RIDER_DROP')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeSimulation === 'RIDER_DROP'
                  ? 'bg-[#38BDF8] text-[#0F291E] shadow-md'
                  : 'bg-[#1A5336] hover:bg-[#133F28] text-white border border-[#38BDF8]/40'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>2. Rider Batch Drop</span>
            </button>

            <button
              onClick={() => startSimulation('PICKUP')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeSimulation === 'PICKUP'
                  ? 'bg-[#4ADE80] text-[#0F291E] shadow-md'
                  : 'bg-[#1A5336] hover:bg-[#133F28] text-white border border-[#4ADE80]/40'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>3. Customer QR Pickup</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Controls Toolbar: View Mode Switcher, Zoom, Filter, & Mermaid Code */}
      <div className="bg-white border border-[#CDE3D5] rounded-2xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Left: View Mode Pills */}
        <div className="flex items-center space-x-1.5 bg-[#F4F8F5] p-1 rounded-xl border border-[#CDE3D5]">
          <button
            onClick={() => setViewMode('BLUEPRINT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'BLUEPRINT'
                ? 'bg-[#1A5336] text-[#fffd47] shadow-xs'
                : 'text-[#4A5B52] hover:text-[#0F291E]'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Interactive Blueprint</span>
          </button>

          <button
            onClick={() => setViewMode('MERMAID_LIVE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'MERMAID_LIVE'
                ? 'bg-[#1A5336] text-[#fffd47] shadow-xs'
                : 'text-[#4A5B52] hover:text-[#0F291E]'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Mermaid.js SVG</span>
          </button>

          <button
            onClick={() => setViewMode('CODE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'CODE'
                ? 'bg-[#1A5336] text-[#fffd47] shadow-xs'
                : 'text-[#4A5B52] hover:text-[#0F291E]'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Mermaid Source</span>
          </button>
        </div>

        {/* Center: Layer Filters (for Blueprint mode) */}
        {viewMode === 'BLUEPRINT' && (
          <div className="hidden md:flex items-center space-x-1.5 text-xs">
            <span className="text-[#4A5B52] font-semibold flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#1A5336]" /> Filter:
            </span>
            {['ALL', 'ACTORS', 'PORTALS', 'OPERATIONAL_UI', 'BACKEND_API', 'DOMAIN_SERVICES'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLayer(lvl)}
                className={`px-2 py-1 rounded-lg font-bold text-[11px] transition ${
                  filterLayer === lvl
                    ? 'bg-[#1A5336] text-white'
                    : 'bg-[#EAF3ED] text-[#4A5B52] hover:bg-[#D1E7DD]'
                }`}
              >
                {lvl === 'ALL'
                  ? 'All Layers'
                  : lvl === 'ACTORS'
                  ? 'Actors'
                  : lvl === 'PORTALS'
                  ? 'Portals'
                  : lvl === 'OPERATIONAL_UI'
                  ? 'UI'
                  : lvl === 'BACKEND_API'
                  ? 'API'
                  : 'Domain'}
              </button>
            ))}
          </div>
        )}

        {/* Right: Zoom Controls & Copy Mermaid */}
        <div className="flex items-center space-x-2">
          {viewMode === 'BLUEPRINT' && (
            <div className="flex items-center space-x-1 bg-[#F4F8F5] border border-[#CDE3D5] rounded-xl p-0.5">
              <button
                onClick={() => setZoomScale((z) => Math.max(0.6, z - 0.1))}
                className="p-1.5 text-[#4A5B52] hover:text-[#0F291E] hover:bg-white rounded-lg transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono font-bold px-1.5 text-[#0F291E]">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={() => setZoomScale((z) => Math.min(1.4, z + 0.1))}
                className="p-1.5 text-[#4A5B52] hover:text-[#0F291E] hover:bg-white rounded-lg transition"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomScale(1)}
                className="p-1.5 text-[#4A5B52] hover:text-[#0F291E] hover:bg-white rounded-lg transition"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={copyMermaidCode}
            className="px-3 py-1.5 rounded-xl bg-[#EAF3ED] hover:bg-[#D1E7DD] text-[#1A5336] text-xs font-bold transition flex items-center gap-1.5 border border-[#CDE3D5]"
            title="Copy Mermaid Code"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Copied!' : 'Copy Mermaid'}</span>
          </button>
        </div>
      </div>

      {/* 3. Main Workspace: Diagram Grid / Canvas + Node Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Architecture Canvas (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {viewMode === 'BLUEPRINT' && (
            <div
              className="bg-white border-2 border-[#CDE3D5] rounded-3xl p-6 shadow-md overflow-x-auto relative min-h-[640px] transition-all"
              style={{
                transform: `scale(${zoomScale})`,
                transformOrigin: 'top left',
              }}
            >
              {/* Layer 1: Actors */}
              {(filterLayer === 'ALL' || filterLayer === 'ACTORS') && (
                <div className="mb-6">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#1A5336] flex items-center gap-1.5 mb-3">
                    <User className="w-4 h-4 text-[#1A5336]" />
                    <span>1. System Actors &amp; Humans in the Loop</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['node_customer', 'node_rider', 'node_merchant', 'node_admin'].map((nid) => {
                      const node = ARCHITECTURE_NODES[nid];
                      const Icon = node.icon;
                      const isSelected = selectedNodeId === nid;
                      const isHighlighted = isNodeHighlighted(nid);

                      return (
                        <div
                          key={nid}
                          onClick={() => setSelectedNodeId(nid)}
                          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 select-none ${
                            isSelected
                              ? 'bg-[#0F291E] border-[#fffd47] text-white shadow-lg ring-2 ring-[#fffd47]/60 scale-102'
                              : isHighlighted
                              ? 'bg-[#EAF3ED] border-[#1A5336] shadow-sm'
                              : 'bg-[#F4F8F5] border-[#CDE3D5] hover:border-[#1A5336]/40 hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                                isSelected ? 'bg-[#fffd47] text-[#0F291E]' : node.bgLight
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-roxborough font-bold text-xs sm:text-sm truncate">
                                {node.name}
                              </h4>
                              <span className="text-[10px] font-mono opacity-80">{node.badge}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Connecting arrow separator */}
              <div className="flex items-center justify-center my-3 text-xs text-[#1A5336] font-mono font-bold">
                <span className="bg-[#EAF3ED] border border-[#CDE3D5] px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span>uses &amp; interacts via web sockets</span>
                  <ArrowRight className="w-3.5 h-3.5 rotate-90" />
                </span>
              </div>

              {/* Layer 2: Role Portals Subgraph */}
              {(filterLayer === 'ALL' || filterLayer === 'PORTALS') && (
                <div className="p-4 rounded-3xl bg-[#EAF3ED]/40 border-2 border-dashed border-[#1A5336]/30 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-[#1A5336] uppercase tracking-wider flex items-center gap-1.5">
                      <Boxes className="w-4 h-4 text-[#1A5336]" />
                      <span>subgraph group_client [&quot;Role Portals&quot;]</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#1A5336] border border-[#CDE3D5]">
                      5 Modules
                    </span>
                  </div>

                  {/* App.tsx Container */}
                  <div className="mb-3">
                    {(() => {
                      const nid = 'node_app';
                      const node = ARCHITECTURE_NODES[nid];
                      const Icon = node.icon;
                      const isSelected = selectedNodeId === nid;
                      const isHighlighted = isNodeHighlighted(nid);
                      return (
                        <div
                          onClick={() => setSelectedNodeId(nid)}
                          className={`p-3 rounded-2xl border-2 cursor-pointer transition select-none flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#0F291E] border-[#fffd47] text-white shadow-md ring-2 ring-[#fffd47]/60'
                              : isHighlighted
                              ? 'bg-white border-[#1A5336] shadow-xs'
                              : 'bg-white border-[#CDE3D5] hover:border-[#1A5336]/40'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-[#fffd47] text-[#0F291E]' : 'bg-[#EAF3ED] text-[#1A5336]'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-xs">{node.name}</div>
                              <span className="text-[10px] font-mono opacity-70">[{node.file}]</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/5 dark:bg-white/10">
                            App Shell Coordinator
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* 4 Portal Children */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      'node_customer_portal',
                      'node_agent_portal',
                      'node_merchant_portal',
                      'node_admin_portal',
                    ].map((nid) => {
                      const node = ARCHITECTURE_NODES[nid];
                      const Icon = node.icon;
                      const isSelected = selectedNodeId === nid;
                      const isHighlighted = isNodeHighlighted(nid);

                      return (
                        <div
                          key={nid}
                          onClick={() => setSelectedNodeId(nid)}
                          className={`p-3 rounded-2xl border-2 cursor-pointer transition select-none ${
                            isSelected
                              ? 'bg-[#0F291E] border-[#fffd47] text-white shadow-md ring-2 ring-[#fffd47]/60'
                              : isHighlighted
                              ? 'bg-white border-[#1A5336] shadow-xs'
                              : 'bg-white border-[#CDE3D5] hover:border-[#1A5336]/40'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-[#fffd47] text-[#0F291E]' : node.bgLight
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <h5 className="font-bold text-xs truncate">{node.name}</h5>
                              <div className="text-[10px] font-mono opacity-70 truncate">
                                [{node.file?.split('/').pop()}]
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Layer 3: Operational UI Subgraph */}
              {(filterLayer === 'ALL' || filterLayer === 'OPERATIONAL_UI') && (
                <div className="p-4 rounded-3xl bg-[#E0F2FE]/30 border-2 border-dashed border-[#0284C7]/30 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-[#0284C7] uppercase tracking-wider flex items-center gap-1.5">
                      <LayoutDashboardIcon className="w-4 h-4 text-[#0284C7]" />
                      <span>subgraph group_ui [&quot;Operational UI&quot;]</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#0284C7] border border-[#BAE6FD]">
                      6 Modules
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      'node_auth',
                      'node_qr_scanner',
                      'node_status_timeline',
                      'node_map',
                      'node_shelf',
                      'node_soundbox',
                    ].map((nid) => {
                      const node = ARCHITECTURE_NODES[nid];
                      const Icon = node.icon;
                      const isSelected = selectedNodeId === nid;
                      const isHighlighted = isNodeHighlighted(nid);

                      return (
                        <div
                          key={nid}
                          onClick={() => setSelectedNodeId(nid)}
                          className={`p-3 rounded-2xl border-2 cursor-pointer transition select-none ${
                            isSelected
                              ? 'bg-[#0F291E] border-[#fffd47] text-white shadow-md ring-2 ring-[#fffd47]/60'
                              : isHighlighted
                              ? 'bg-white border-[#0284C7] shadow-xs'
                              : 'bg-white border-[#CDE3D5] hover:border-[#0284C7]/40'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-[#fffd47] text-[#0F291E]' : node.bgLight
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <h5 className="font-bold text-xs truncate">{node.name}</h5>
                              <div className="text-[10px] font-mono opacity-70 truncate">
                                [{node.file?.split('/').pop() || 'Component'}]
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Connecting arrow separator */}
              <div className="flex items-center justify-center my-3 text-xs text-[#4338CA] font-mono font-bold">
                <span className="bg-[#EEF2FF] border border-[#C7D2FE] px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span>REST API calls &amp; Controller Dispatch</span>
                  <ArrowRight className="w-3.5 h-3.5 rotate-90" />
                </span>
              </div>

              {/* Layer 4: Backend API Subgraph */}
              {(filterLayer === 'ALL' || filterLayer === 'BACKEND_API') && (
                <div className="p-4 rounded-3xl bg-[#EEF2FF]/40 border-2 border-dashed border-[#4338CA]/30 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-[#4338CA] uppercase tracking-wider flex items-center gap-1.5">
                      <Server className="w-4 h-4 text-[#4338CA]" />
                      <span>subgraph group_api [&quot;Backend API&quot;]</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#4338CA] border border-[#C7D2FE]">
                      5 Components
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {[
                      'node_server',
                      'node_parcel_routes',
                      'node_parcel_controller',
                      'node_store_controller',
                      'node_matching_controller',
                    ].map((nid) => {
                      const node = ARCHITECTURE_NODES[nid];
                      const Icon = node.icon;
                      const isSelected = selectedNodeId === nid;
                      const isHighlighted = isNodeHighlighted(nid);

                      return (
                        <div
                          key={nid}
                          onClick={() => setSelectedNodeId(nid)}
                          className={`p-3 rounded-2xl border-2 cursor-pointer transition select-none ${
                            isSelected
                              ? 'bg-[#0F291E] border-[#fffd47] text-white shadow-md ring-2 ring-[#fffd47]/60'
                              : isHighlighted
                              ? 'bg-white border-[#4338CA] shadow-xs'
                              : 'bg-white border-[#CDE3D5] hover:border-[#4338CA]/40'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-[#fffd47] text-[#0F291E]' : node.bgLight
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <h5 className="font-bold text-xs truncate">{node.name}</h5>
                              <div className="text-[10px] font-mono opacity-70 truncate">
                                [{node.file?.split('/').pop()}]
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Connecting arrow separator */}
              <div className="flex items-center justify-center my-3 text-xs text-[#0F291E] font-mono font-bold">
                <span className="bg-[#EAF3ED] border border-[#CDE3D5] px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span>Reads / Writes / Validates Services</span>
                  <ArrowRight className="w-3.5 h-3.5 rotate-90" />
                </span>
              </div>

              {/* Layer 5: Domain Services Subgraph */}
              {(filterLayer === 'ALL' || filterLayer === 'DOMAIN_SERVICES') && (
                <div className="p-4 rounded-3xl bg-[#FEF3C7]/20 border-2 border-dashed border-[#D97706]/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-[#D97706] uppercase tracking-wider flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-[#D97706]" />
                      <span>subgraph group_domain [&quot;Domain Services&quot;]</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#D97706] border border-amber-200">
                      4 Services
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['node_database', 'node_matching', 'node_security', 'node_models'].map((nid) => {
                      const node = ARCHITECTURE_NODES[nid];
                      const Icon = node.icon;
                      const isSelected = selectedNodeId === nid;
                      const isHighlighted = isNodeHighlighted(nid);

                      return (
                        <div
                          key={nid}
                          onClick={() => setSelectedNodeId(nid)}
                          className={`p-3 rounded-2xl border-2 cursor-pointer transition select-none ${
                            isSelected
                              ? 'bg-[#0F291E] border-[#fffd47] text-white shadow-md ring-2 ring-[#fffd47]/60'
                              : isHighlighted
                              ? 'bg-white border-[#D97706] shadow-xs'
                              : 'bg-white border-[#CDE3D5] hover:border-[#D97706]/40'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-[#fffd47] text-[#0F291E]' : node.bgLight
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <h5 className="font-bold text-xs truncate">{node.name}</h5>
                              <div className="text-[10px] font-mono opacity-70 truncate">
                                [{node.file?.split('/').pop()}]
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* View Mode 2: Live Mermaid.js SVG Render */}
          {viewMode === 'MERMAID_LIVE' && (
            <div className="bg-white border-2 border-[#CDE3D5] rounded-3xl p-6 shadow-md overflow-x-auto min-h-[600px] flex items-center justify-center">
              {mermaidError ? (
                <div className="text-center p-6 text-red-600 space-y-2">
                  <p className="font-bold">{mermaidError}</p>
                  <button
                    onClick={() => setViewMode('BLUEPRINT')}
                    className="px-4 py-2 bg-[#1A5336] text-[#fffd47] rounded-xl text-xs font-bold"
                  >
                    Switch to Interactive Blueprint
                  </button>
                </div>
              ) : mermaidSvg ? (
                <div
                  ref={mermaidRef}
                  className="w-full flex justify-center [&>svg]:max-w-full [&>svg]:h-auto"
                  dangerouslySetInnerHTML={{ __html: mermaidSvg }}
                />
              ) : (
                <div className="flex flex-col items-center space-y-2 text-[#4A5B52]">
                  <Network className="w-8 h-8 animate-spin text-[#1A5336]" />
                  <p className="text-xs font-mono">Compiling Mermaid graph...</p>
                </div>
              )}
            </div>
          )}

          {/* View Mode 3: Raw Mermaid Source Code with Syntax Box */}
          {viewMode === 'CODE' && (
            <div className="bg-[#0F291E] border-2 border-[#1A5336] rounded-3xl p-6 text-white shadow-xl min-h-[600px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#1A5336]/60 mb-4">
                  <div className="flex items-center space-x-2">
                    <FileCode2 className="w-4 h-4 text-[#fffd47]" />
                    <span className="font-mono text-xs text-[#fffd47] font-bold">
                      raunit962/kirana-connect.mmd
                    </span>
                  </div>
                  <button
                    onClick={copyMermaidCode}
                    className="px-3 py-1 bg-[#1A5336] hover:bg-[#133F28] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? 'Copied to Clipboard' : 'Copy'}</span>
                  </button>
                </div>

                <pre className="font-mono text-xs text-[#D1E7DD] overflow-x-auto p-4 bg-black/40 rounded-2xl border border-white/5 leading-relaxed selection:bg-[#fffd47] selection:text-[#0F291E]">
                  {RAW_MERMAID_CODE}
                </pre>
              </div>

              <div className="pt-4 border-t border-[#1A5336]/60 text-xs text-[#A3B8AD] flex items-center justify-between">
                <span>Directly compatible with GitDiagram, Mermaid Live Editor &amp; GitHub Markdown.</span>
                <a
                  href="https://mermaid.live"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#fffd47] hover:underline font-bold flex items-center gap-1"
                >
                  <span>Open in Mermaid Live</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Node Inspector Drawer (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border-2 border-[#CDE3D5] rounded-3xl p-5 shadow-md space-y-5 sticky top-20">
            {/* Inspector Header */}
            <div className="pb-4 border-b border-[#CDE3D5]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EAF3ED] text-[#1A5336] border border-[#CDE3D5]">
                  {selectedNode.layerTitle}
                </span>
                <span className="text-[10px] font-mono text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-full border border-[#BAE6FD]">
                  {selectedNode.badge}
                </span>
              </div>

              <div className="flex items-center space-x-3 mt-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shadow-xs ${selectedNode.bgLight}`}
                >
                  {(() => {
                    const NodeIcon = selectedNode.icon;
                    return <NodeIcon className="w-6 h-6" />;
                  })()}
                </div>
                <div>
                  <h3 className="font-roxborough font-extrabold text-xl text-[#0F291E] leading-tight">
                    {selectedNode.name}
                  </h3>
                  {selectedNode.file && (
                    <p className="text-xs font-mono text-[#4A5B52] mt-0.5 break-all">
                      {selectedNode.file}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A5336] mb-1.5">
                Overview &amp; Purpose
              </h4>
              <p className="text-xs text-[#4A5B52] leading-relaxed">
                {selectedNode.description}
              </p>
            </div>

            {/* Key Functional Responsibilities */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A5336] mb-2">
                Key Technical Responsibilities
              </h4>
              <ul className="space-y-1.5">
                {selectedNode.keyFunctions.map((fn, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs text-[#4A5B52]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1A5336] shrink-0 mt-0.5" />
                    <span>{fn}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Relationship Connections */}
            <div className="space-y-3 pt-3 border-t border-[#CDE3D5]">
              {/* Inbound calls */}
              {selectedNode.inbound.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-[#4A5B52] mb-1 flex items-center gap-1">
                    <span>Inbound Incoming Calls:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.inbound.map((inb, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedNodeId(inb.source)}
                        className="px-2 py-1 rounded-lg bg-[#F4F8F5] hover:bg-[#EAF3ED] border border-[#CDE3D5] text-[11px] font-mono text-[#0F291E] transition flex items-center gap-1"
                      >
                        <span className="font-bold text-[#1A5336]">
                          {ARCHITECTURE_NODES[inb.source]?.name || inb.source}
                        </span>
                        <span className="text-[9px] text-[#4A5B52]">({inb.relation})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Outbound calls */}
              {selectedNode.outbound.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-[#4A5B52] mb-1 flex items-center gap-1">
                    <span>Outbound Outgoing Calls:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.outbound.map((outb, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedNodeId(outb.target)}
                        className="px-2 py-1 rounded-lg bg-[#F4F8F5] hover:bg-[#EAF3ED] border border-[#CDE3D5] text-[11px] font-mono text-[#0F291E] transition flex items-center gap-1"
                      >
                        <span className="font-bold text-[#0284C7]">
                          {ARCHITECTURE_NODES[outb.target]?.name || outb.target}
                        </span>
                        <span className="text-[9px] text-[#4A5B52]">({outb.relation})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions (Launch in App / View on GitHub) */}
            <div className="pt-3 border-t border-[#CDE3D5] space-y-2">
              {selectedNode.navTarget && onNavigateTab && (
                <button
                  onClick={() => onNavigateTab(selectedNode.navTarget!)}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#1A5336] hover:bg-[#133F28] text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#fffd47]" />
                  <span>Launch in App ({selectedNode.name})</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                </button>
              )}

              {selectedNode.openAction === 'AUTH_MODAL' && (
                <button
                  onClick={() => openAuthModal('CUSTOMER')}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#fffd47] hover:bg-[#fffd47]/90 text-[#0F291E] text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 border border-[#1A5336]"
                >
                  <KeyRoundIcon className="w-3.5 h-3.5" />
                  <span>Open Indian Auth Modal</span>
                </button>
              )}

              {selectedNode.githubPath && (
                <a
                  href={`https://github.com/raunit962/kirana-connect/blob/main/${selectedNode.githubPath}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-[#F4F8F5] hover:bg-[#EAF3ED] text-[#0F291E] text-xs font-semibold transition border border-[#CDE3D5] flex items-center justify-center gap-1.5"
                >
                  <FileCode2 className="w-3.5 h-3.5 text-[#1A5336]" />
                  <span>View Code on GitHub</span>
                  <ExternalLink className="w-3 h-3 text-[#4A5B52] ml-auto" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function LayoutDashboardIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}

export default ArchitectureView;
