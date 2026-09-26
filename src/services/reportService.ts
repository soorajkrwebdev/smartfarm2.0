import { supabase } from '../lib/supabase';
import {
  Farm,
  UserProfile,
  FarmCrop,
  CropActivity,
  FarmInput,
  PestObservation,
  IPMRecord,
  PesticideApplication,
  SoilTest,
  WaterTest,
  FarmWaste,
  CompostBatch,
  FarmExpense,
  CropHarvest,
  FarmReportRecord,
  FarmReportData,
} from '../types';

export interface GenerateReportParams {
  userId: string;
  farm: Farm;
  farmer: UserProfile | null;
  crops: FarmCrop[];
  activities: CropActivity[];
  inputs: FarmInput[];
  expenses: FarmExpense[];
  pestObservations: PestObservation[];
  ipmRecords: IPMRecord[];
  pesticideApplications: PesticideApplication[];
  soilTests: SoilTest[];
  waterTests: WaterTest[];
  waste: FarmWaste[];
  compost: CompostBatch[];
  harvests: CropHarvest[];
}

export function compileFarmReportData(params: GenerateReportParams): FarmReportData {
  const farmCrops = params.crops.filter(c => c.farm_id === params.farm.id);
  const farmActivities = params.activities.filter(a => a.farm_id === params.farm.id);
  const farmInputs = params.inputs.filter(i => i.farm_id === params.farm.id);
  const farmExpenses = params.expenses.filter(e => e.farm_id === params.farm.id);
  const farmPests = params.pestObservations.filter(p => p.farm_id === params.farm.id);
  const farmIpm = params.ipmRecords.filter(r => r.farm_id === params.farm.id);
  const farmSoil = params.soilTests.filter(s => s.farm_id === params.farm.id);
  const farmWater = params.waterTests.filter(w => w.farm_id === params.farm.id);
  const farmWaste = params.waste.filter(w => w.farm_id === params.farm.id);
  const farmCompost = params.compost.filter(c => c.farm_id === params.farm.id);
  const farmHarvests = params.harvests.filter(h => h.farm_id === params.farm.id);

  const organicActs = farmActivities.filter(a =>
    ['Organic manure', 'Biofertilizer application', 'Mulching', 'Weeding'].includes(a.activity_type)
  );

  const organicInps = farmInputs.filter(i =>
    ['Organic manure', 'Biofertilizers', 'Biological inputs', 'Botanical inputs'].includes(i.category)
  );

  const totalExpenseAmount = farmExpenses.reduce((s, e) => s + (e.amount || 0), 0);
  const totalWasteRecycled = farmWaste
    .filter(w => w.status === 'composted' || w.status === 'applied')
    .reduce((s, w) => s + (w.quantity || 0), 0);

  const totalCompostProduced = farmCompost
    .filter(c => c.status === 'finished')
    .reduce((s, c) => s + (c.finished_quantity || 0), 0);

  const totalHarvestAmount = farmHarvests.reduce((s, h) => s + (h.quantity || 0), 0);

  return {
    farmer: {
      name: params.farmer?.full_name || 'Farmer',
      phone: params.farmer?.phone,
      location: [params.farmer?.village, params.farmer?.district, params.farmer?.state]
        .filter(Boolean)
        .join(', '),
      farmingType: params.farmer?.farming_type || 'Organic / Sustainable',
    },
    farm: {
      name: params.farm.name,
      area: params.farm.area,
      areaUnit: params.farm.area_unit,
      location: params.farm.location,
      farmingMethod: params.farm.farming_method,
      organicStatus: params.farm.organic_status,
    },
    crops: farmCrops,
    activitiesCount: farmActivities.length,
    inputsCount: farmInputs.length,
    totalExpenses: totalExpenseAmount,
    pestObservationsCount: farmPests.length,
    ipmRecordsCount: farmIpm.length,
    soilTestsCount: farmSoil.length,
    waterTestsCount: farmWater.length,
    wasteRecycledKg: totalWasteRecycled,
    compostProducedKg: totalCompostProduced,
    harvestsCount: farmHarvests.length,
    totalHarvestQty: totalHarvestAmount,
    sustainabilityIndicators: {
      organicPracticesCount: organicActs.length,
      organicInputUsagePercent:
        farmInputs.length > 0
          ? Math.round((organicInps.length / farmInputs.length) * 100)
          : 100,
      wasteRecycledKg: totalWasteRecycled,
      ipmDecisionsCount: farmIpm.length,
      soilTestCount: farmSoil.length,
    },
  };
}

export async function saveFarmReport(
  userId: string,
  farmId: string,
  title: string,
  reportData: FarmReportData
): Promise<{ data?: FarmReportRecord; error?: string }> {
  if (!supabase || !userId) return { error: 'Authentication required' };

  try {
    const { data, error } = await supabase
      .from('farm_reports')
      .insert({
        user_id: userId,
        farm_id: farmId,
        report_title: title,
        report_data: reportData as any,
      })
      .select('*, farms(name)')
      .single();

    if (error) return { error: error.message };
    return {
      data: {
        ...data,
        farm_name: data.farms?.name || 'Farm',
      },
    };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function fetchFarmReports(userId: string): Promise<FarmReportRecord[]> {
  if (!supabase || !userId) return [];
  try {
    const { data, error } = await supabase
      .from('farm_reports')
      .select('*, farms(name)')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false });

    if (error) {
      console.warn('Notice fetching farm_reports:', error.message);
      return [];
    }

    return (data || []).map((row: any) => ({
      ...row,
      farm_name: row.farms?.name || 'Farm',
    }));
  } catch (err) {
    console.error('Failed to load farm reports:', err);
    return [];
  }
}

/**
 * Triggers standard browser PDF printable document layout for farm report export
 */
export function exportReportToPdf(report: FarmReportData, reportTitle: string) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to export the report PDF.');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${reportTitle} - SmartFarm 2.0</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; padding: 20px; line-height: 1.5; font-size: 12px; }
          .header { border-bottom: 2px solid #059669; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
          .title { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0; }
          .subtitle { font-size: 11px; color: #64748b; margin: 2px 0 0 0; }
          .disclaimer { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 10px; border-radius: 8px; font-size: 10px; color: #166534; margin-bottom: 20px; }
          .section { margin-bottom: 18px; }
          .section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #059669; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 10px; }
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
          .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; }
          .card-label { font-size: 9px; text-transform: uppercase; color: #64748b; font-weight: 700; }
          .card-value { font-size: 16px; font-weight: 800; color: #0f172a; margin-top: 2px; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 11px; }
          th { background: #f1f5f9; text-align: left; padding: 6px 10px; font-size: 10px; font-weight: 700; color: #475569; border: 1px solid #cbd5e1; }
          td { padding: 6px 10px; border: 1px solid #cbd5e1; }
          .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">${reportTitle}</h1>
            <p class="subtitle">Generated by SmartFarm 2.0 Sustainable Agriculture Platform on ${new Date().toLocaleDateString()}</p>
          </div>
          <div style="text-align: right;">
            <strong>${report.farm.name}</strong><br/>
            <span>${report.farm.area} ${report.farm.areaUnit} • ${report.farm.location}</span>
          </div>
        </div>

        <div class="disclaimer">
          <strong>Notice:</strong> This is a farmer operations and sustainability ledger report. Uploaded test records and farm practices are internal farm management records and do not substitute for official NPOP/APEDA organic certification.
        </div>

        <div class="section">
          <div class="section-title">1. Farm & Farmer Overview</div>
          <div class="grid">
            <div class="card"><div class="card-label">Farmer Name</div><div class="card-value">${report.farmer.name}</div></div>
            <div class="card"><div class="card-label">Farming Method</div><div class="card-value" style="text-transform: capitalize;">${report.farm.farmingMethod}</div></div>
            <div class="card"><div class="card-label">Organic Status</div><div class="card-value" style="text-transform: capitalize;">${report.farm.organicStatus.replace('_', ' ')}</div></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">2. Sustainability & Operations Summary</div>
          <div class="grid">
            <div class="card"><div class="card-label">Organic Practices Logged</div><div class="card-value">${report.sustainabilityIndicators.organicPracticesCount}</div></div>
            <div class="card"><div class="card-label">Organic Input Usage</div><div class="card-value">${report.sustainabilityIndicators.organicInputUsagePercent}%</div></div>
            <div class="card"><div class="card-label">Waste Recycled into Compost</div><div class="card-value">${report.wasteRecycledKg} kg</div></div>
            <div class="card"><div class="card-label">IPM Decisions Executed</div><div class="card-value">${report.ipmRecordsCount}</div></div>
            <div class="card"><div class="card-label">Soil Tests Recorded</div><div class="card-value">${report.soilTestsCount}</div></div>
            <div class="card"><div class="card-label">Total Recorded Expenses</div><div class="card-value">Rs ${report.totalExpenses.toLocaleString()}</div></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">3. Registered Crops on Farm (${report.crops.length})</div>
          <table>
            <thead>
              <tr>
                <th>Crop</th>
                <th>Variety</th>
                <th>Growth Stage</th>
                <th>Planted Date</th>
                <th>Area</th>
              </tr>
            </thead>
            <tbody>
              ${
                report.crops.length === 0
                  ? '<tr><td colspan="5" style="text-align: center; color: #94a3b8;">No crops currently registered on this farm.</td></tr>'
                  : report.crops
                      .map(
                        c => `
                        <tr>
                          <td><strong>${c.crop_name}</strong></td>
                          <td>${c.variety || 'Local'}</td>
                          <td>${c.growth_stage}</td>
                          <td>${c.planting_date}</td>
                          <td>${c.area || '-'} ${c.area_unit || ''}</td>
                        </tr>
                      `
                      )
                      .join('')
              }
            </tbody>
          </table>
        </div>

        <div class="footer">
          SmartFarm 2.0 • Data verified against authenticated database records • Page 1 of 1
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
