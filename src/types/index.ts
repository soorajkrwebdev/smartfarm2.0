export type FarmingType = 'organic' | 'conventional' | 'transitioning' | 'mixed';

export type AreaUnit = 'acres' | 'hectares' | 'cents' | 'bigha' | 'guntha';

export type FarmingMethod = 'organic' | 'natural' | 'conventional' | 'regenerative' | 'integrated' | 'mixed';

export type OrganicStatus = 'certified_organic' | 'in_conversion' | 'non_certified_organic' | 'conventional';

export type GrowthStage = 
  | 'Nursery / Land Prep'
  | 'Vegetative'
  | 'Flowering'
  | 'Fruiting / Podding'
  | 'Maturity / Ripening'
  | 'Harvesting'
  | 'Post-Harvest';

export type CropStatus = 'active' | 'harvested' | 'fallow' | 'failed';

export type ActivityType = 
  | 'Planting'
  | 'Irrigation'
  | 'Fertilization'
  | 'Organic manure'
  | 'Biofertilizer application'
  | 'Weeding'
  | 'Mulching'
  | 'Pruning'
  | 'Pest monitoring'
  | 'Spraying'
  | 'Harvest'
  | 'Labour'
  | 'Custom activity';

export type InputCategory =
  | 'Seeds'
  | 'Fertilizers'
  | 'Organic manure'
  | 'Biofertilizers'
  | 'Biological inputs'
  | 'Botanical inputs'
  | 'Pesticides'
  | 'Other';

export type OrganicInputCategory =
  | 'Organic Manures'
  | 'Biofertilizers'
  | 'Biological / Biocontrol Inputs'
  | 'Botanical Inputs'
  | 'Soil Amendments';

export interface UserProfile {
  id: string;
  email?: string;
  full_name: string;
  phone?: string;
  state?: string;
  district?: string;
  village?: string;
  preferred_language: string;
  farming_type: FarmingType;
  created_at: string;
  updated_at: string;
}

export interface Farm {
  id: string;
  user_id: string;
  name: string;
  location: string;
  area: number;
  area_unit: AreaUnit;
  soil_type?: string;
  irrigation_type?: string;
  farming_method: FarmingMethod;
  organic_status: OrganicStatus;
  current_season: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

export interface FarmCrop {
  id: string;
  farm_id: string;
  user_id: string;
  crop_name: string;
  variety?: string;
  area?: number;
  area_unit?: AreaUnit;
  planting_date: string;
  expected_harvest_date?: string;
  growth_stage: GrowthStage;
  soil_type?: string;
  irrigation?: string;
  farming_method?: FarmingMethod;
  status: CropStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined or helper fields
  farm_name?: string;
}

export interface CropActivity {
  id: string;
  farm_id: string;
  crop_id?: string;
  user_id: string;
  activity_type: ActivityType;
  activity_date: string;
  quantity?: number;
  unit?: string;
  cost: number;
  area?: number;
  area_unit?: AreaUnit;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined or helper fields
  farm_name?: string;
  crop_name?: string;
}

export interface FarmInput {
  id: string;
  user_id: string;
  farm_id: string;
  crop_id?: string;
  product_name: string;
  category: InputCategory;
  purchase_date: string;
  quantity: number;
  unit: string;
  cost: number;
  purpose?: string;
  application_method?: string;
  batch_or_lot_no?: string;
  supplier_or_source?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined or helper fields
  farm_name?: string;
  crop_name?: string;
}

export interface OrganicInput {
  id: string;
  name: string;
  category: OrganicInputCategory;
  description: string;
  purpose: string;
  benefits: string[];
  suitable_crops: string[];
  application_information: string;
  precautions?: string;
  organic_relevance?: string;
  source_name: string;
  source_url?: string;
  last_verified_date: string;
  verification_status: string;
  created_at?: string;
  updated_at?: string;
}

export interface CropOrganicInput {
  id: string;
  crop_name: string;
  organic_input_id: string;
  recommended_stage: string;
  dosage_guide: string;
  application_notes?: string;
  source_reference?: string;
  created_at?: string;
  // Joined or helper fields
  organic_input?: OrganicInput;
}

export interface OrganicPractice {
  id: string;
  title: string;
  category: 'Soil & Composting' | 'Bio-stimulants & Teas' | 'Biological Pest Control' | 'Cropping & Mulch';
  summary: string;
  scientific_rationale: string;
  preparation_steps: string[];
  application_rate: string;
  dosage_timing: string;
  cautions: string;
  source: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  condition: string;
  isDay: boolean;
  dailyForecast: {
    date: string;
    dayName: string;
    maxTemp: number;
    minTemp: number;
    condition: string;
    rainProb: number;
  }[];
}

export interface ActivityFilterOptions {
  farmId?: string;
  cropId?: string;
  activityType?: string;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
}

// Phase 3: Pest & IPM Types
export type PestSeverity = 'low' | 'medium' | 'high' | 'critical';
export type PestStatus = 'observed' | 'monitoring' | 'treated' | 'controlled' | 'failed';
export type AdvisoryLevel = 'monitoring' | 'prevention' | 'cultural' | 'mechanical' | 'biological' | 'botanical' | 'chemical';

export interface PestObservation {
  id: string;
  user_id: string;
  farm_id: string;
  crop_id?: string;
  pest_name: string;
  pest_type: 'insect' | 'disease' | 'nematode' | 'weed' | 'mammal' | 'bird' | 'other';
  symptoms: string;
  growth_stage: string;
  severity: PestSeverity;
  affected_area_percent: number;
  observation_date: string;
  photos?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  farm_name?: string;
  crop_name?: string;
}

export interface IPMRecord {
  id: string;
  user_id: string;
  farm_id: string;
  crop_id?: string;
  pest_observation_id?: string;
  pest_name: string;
  advisory_level: AdvisoryLevel;
  recommendation: string;
  rationale: string;
  source_name: string;
  source_url?: string;
  created_at: string;
  // Joined fields
  farm_name?: string;
  crop_name?: string;
}

export interface PesticideApplication {
  id: string;
  user_id: string;
  farm_id: string;
  crop_id?: string;
  pest_observation_id?: string;
  product_name: string;
  active_ingredient?: string;
  application_date: string;
  quantity: number;
  unit: string;
  area: number;
  area_unit: string;
  application_method: string;
  source_reference?: string;
  pre_harvest_interval_days?: number;
  re_entry_interval_hours?: number;
  notes?: string;
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  farm_name?: string;
  crop_name?: string;
  pest_name?: string;
}

export interface PestAdvisory {
  id: string;
  pest_name: string;
  crop_name?: string;
  growth_stage?: string;
  monitoring_guidance: string;
  prevention_measures: string[];
  cultural_controls: string[];
  mechanical_controls: string[];
  biological_controls: string[];
  botanical_options: string[];
  chemical_info?: {
    product_examples: string[];
    active_ingredients: string[];
    caution: string;
    source: string;
  };
  source_name: string;
  source_url?: string;
  last_verified_date: string;
  verification_status: string;
}

// Phase 4: Soil & Water Testing Types
export interface SoilTest {
  id: string;
  user_id: string;
  farm_id: string;
  test_date: string;
  laboratory?: string;
  ph?: number;
  nitrogen?: number; // kg/ha or ppm
  phosphorus?: number; // kg/ha or ppm
  potassium?: number; // kg/ha or ppm
  organic_carbon?: number; // %
  electrical_conductivity?: number; // dS/m
  micronutrients?: string; // JSON or text description
  texture?: string;
  moisture?: number; // %
  other_parameters?: string;
  notes?: string;
  report_url?: string; // File upload reference
  created_at: string;
  updated_at: string;
  // Joined fields
  farm_name?: string;
}

export interface WaterTest {
  id: string;
  user_id: string;
  farm_id: string;
  test_date: string;
  laboratory?: string;
  ph?: number;
  ec?: number; // dS/m or mS/cm
  hardness?: number; // mg/L or ppm
  alkalinity?: number; // mg/L CaCO3
  sodium?: number; // mg/L
  calcium?: number; // mg/L
  magnesium?: number; // mg/L
  chloride?: number; // mg/L
  sulfate?: number; // mg/L
  nitrate?: number; // mg/L
  boron?: number; // mg/L
  iron?: number; // mg/L
  other_parameters?: string;
  suitability?: 'excellent' | 'good' | 'marginal' | 'poor' | 'unsuitable';
  notes?: string;
  report_url?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  farm_name?: string;
}

// Phase 4: Waste & Compost Types
export type WasteType = 'crop_residue' | 'leaves' | 'weeds' | 'animal_waste' | 'organic_waste' | 'other';
export type WasteStatus = 'collected' | 'processing' | 'composted' | 'applied' | 'disposed';
export type CompostStatus = 'preparing' | 'active' | 'curing' | 'finished' | 'used' | 'failed';

export interface FarmWaste {
  id: string;
  user_id: string;
  farm_id: string;
  waste_type: WasteType;
  description?: string;
  quantity: number;
  unit: string;
  collection_date: string;
  source_location?: string;
  status: WasteStatus;
  processed_crop_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  farm_name?: string;
  crop_name?: string;
}

export interface CompostBatch {
  id: string;
  user_id: string;
  farm_id: string;
  compost_type: 'vermicompost' | 'farmyard_manure' | 'green_manure' | 'compost' | 'biological_strain' | 'other';
  input_waste_ids?: string[];
  start_date: string;
  estimated_completion_date?: string;
  actual_completion_date?: string;
  processing_method?: string;
  volume_start: number;
  unit: string;
  volume_finished?: number;
  quality_rating?: 'excellent' | 'good' | 'fair' | 'poor';
  status: CompostStatus;
  applied_to_crop_id?: string;
  application_date?: string;
  application_rate?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  farm_name?: string;
}

// Phase 4: Sustainability Tracking
export interface SustainabilityMetric {
  id: string;
  user_id: string;
  farm_id: string;
  metric_date: string;
  organic_practice_count: number;
  waste_recycled_kg: number;
  ipm_activities_count: number;
  soil_tests_conducted: number;
  input_record_completeness_percent: number;
  organic_input_usage_percent: number;
  compost_produced_kg: number;
  water_tests_conducted: number;
  notes?: string;
  created_at: string;
}
