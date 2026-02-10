// pages/dashboard.tsx
import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { callPredict } from "../src/helpers/predict"; // adjust path if needed

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceDot,
} from "recharts";

type ChartPoint = { year: number | string; historical?: number; predicted?: number };

export default function Dashboard() {
  const [form, setForm] = useState<any>({
    district: "",
    crop: "",
    season: "",
    soil_ph: 6.5,
    soil_n: 80,
    soil_p: 30,
    soil_k: 140,
    rainfall_30d: 90,
    temp_mean_30d: 25,
    previous_yield: 28,
    fertilizer_used: "NPK 10-26-26",
    fertilizer_amount_kg_per_ha: 100,
    recent_pest_issue: "",
  });
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);

  // chart controls
  const [showHistorical, setShowHistorical] = useState(true);
  const [showPredicted, setShowPredicted] = useState(true);
  const [startYear, setStartYear] = useState<number>(2018);
  const [endYear, setEndYear] = useState<number>(2024);

  const districts = [
    "Angul","Balangir","Balasore","Bargarh","Bhadrak","Boudh","Cuttack","Deogarh","Dhenkanal",
    "Gajapati","Ganjam","Jagatsinghpur","Jajpur","Jharsuguda","Kalahandi","Kandhamal","Kendrapara",
    "Kendujhar","Khordha","Koraput","Malkangiri","Mayurbhanj","Nabarangpur","Nayagarh","Nuapada",
    "Puri","Rayagada","Sambalpur","Sonepur","Sundargarh"
  ];
  const crops = ["Paddy","Maize","Pulses","Groundnut","Sugarcane","Cotton","Jute"];
  const seasons = ["Kharif","Rabi","Summer"];

  // default demo historical data (replace with your actual historical series if available)
  const defaultHistorical: ChartPoint[] = [
    { year: 2018, historical: 40 },
    { year: 2019, historical: 42 },
    { year: 2020, historical: 38 },
    { year: 2021, historical: 45 },
    { year: 2022, historical: 43 },
    { year: 2023, historical: 48 },
    { year: 2024, historical: 46 },
  ];

  // builds the chart data by slicing the historical series and inserting the predicted point (predicted for '2025' or endYear+1)
  const chartData: ChartPoint[] = useMemo(() => {
    const hist = defaultHistorical.filter(p => Number(p.year) >= startYear && Number(p.year) <= endYear).map(p => ({ ...p }));
    // if we have a predicted value from model, insert predicted at endYear+1
    if (prediction?.yield && !isNaN(Number(prediction.yield))) {
      const predYear = Number(endYear) + 1;
      // make sure not to mutate historical array directly
      const combined = hist.map(p => ({ ...p }));
      combined.push({ year: predYear, predicted: Number(prediction.yield) });
      return combined;
    }
    return hist;
  }, [startYear, endYear, prediction]);

  async function handlePredict() {
    if (!form.district || !form.crop || !form.season) {
      alert("Please fill district, crop and season");
      return;
    }
    setLoading(true);
    setPrediction(null);

    try {
      const payload: Record<string, any> = {
        district: form.district,
        crop: form.crop,
        season: form.season,
        soil_ph: Number(form.soil_ph),
        soil_n: Number(form.soil_n),
        soil_p: Number(form.soil_p),
        soil_k: Number(form.soil_k),
        rainfall_30d: Number(form.rainfall_30d),
        temp_mean_30d: Number(form.temp_mean_30d),
      };
      if (form.previous_yield !== undefined && form.previous_yield !== "") {
        payload.previous_yield = Number(form.previous_yield);
      }
      payload.fertilizer_used = form.fertilizer_used || null;
      payload.fertilizer_amount_kg_per_ha = Number(form.fertilizer_amount_kg_per_ha || 0);
      payload.recent_pest_issue = form.recent_pest_issue || null;

      const json = await callPredict(payload);
      const result = json?.result ?? json;

      const predicted = result?.predicted_yield ?? null;
      const units = result?.units ?? "q_per_ha";
      const recs: string[] = result?.recommendations ?? [];

      // simple client-side heuristics (same as previous)
      const fertAdvice = buildFertilizerAdvice({
        soil_n: payload.soil_n,
        soil_p: payload.soil_p,
        soil_k: payload.soil_k,
        fertilizer_used: payload.fertilizer_used,
        fertilizer_amount: payload.fertilizer_amount_kg_per_ha,
        previous_yield: payload.previous_yield,
        predicted_yield: predicted,
      });
      const pestAdvice = buildPestAdvice({
        rainfall_30d: payload.rainfall_30d,
        temp_mean_30d: payload.temp_mean_30d,
        recent_pest_issue: payload.recent_pest_issue,
      });
      const conclusions = buildConclusions({
        predicted_yield: predicted,
        previous_yield: payload.previous_yield,
        fertAdvice,
        pestAdvice,
        soil_ph: payload.soil_ph,
        soil_n: payload.soil_n,
        soil_p: payload.soil_p,
        soil_k: payload.soil_k,
        crop: payload.crop,
      });

      setPrediction({
        yield: predicted != null ? Number(predicted).toFixed(2) : null,
        units,
        recommendations: recs,
        fertilizer: fertAdvice,
        pest: pestAdvice,
        conclusions,
      });

      // bring chart controls into sensible default window
      setStartYear(2018);
      setEndYear(2024);
      setShowHistorical(true);
      setShowPredicted(true);
    } catch (err: any) {
      console.error(err);
      alert("Prediction failed: " + (err?.message || err));
    } finally {
      setLoading(false);
    }
  }

  // download chart CSV
  function downloadChartCsv() {
    const rows = chartData.map(r => ({
      year: r.year,
      historical: r.historical ?? "",
      predicted: r.predicted ?? "",
    }));
    const csv = [
      Object.keys(rows[0]).join(","),
      ...rows.map(r => `${r.year},${r.historical},${r.predicted}`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "yield_chart.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 pb-16">
      <header className="bg-white/70 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-800">KrishiMitra Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-green-600 hover:underline">Home</Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - input form (spans 1 of 3) */}
          <motion.div initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-6 rounded-2xl shadow border border-gray-200">
            <h2 className="text-2xl font-bold text-black mb-3">Input Details</h2>

            <label className="block text-sm font-medium text-black mt-2">District</label>
            <select value={form.district} onChange={(e)=>setForm({...form, district: e.target.value})} className="w-full mt-2 p-3 border rounded-md text-black">
              <option value="">Choose district...</option>
              {districts.map(d=> <option key={d} value={d}>{d}</option>)}
            </select>

            <label className="block text-sm font-medium text-black mt-3">Crop</label>
            <select value={form.crop} onChange={(e)=>setForm({...form, crop: e.target.value})} className="w-full mt-2 p-3 border rounded-md text-black">
              <option value="">Choose crop...</option>
              {crops.map(c=> <option key={c} value={c}>{c}</option>)}
            </select>

            <label className="block text-sm font-medium text-black mt-3">Season</label>
            <select value={form.season} onChange={(e)=>setForm({...form, season: e.target.value})} className="w-full mt-2 p-3 border rounded-md text-black">
              <option value="">Choose season...</option>
              {seasons.map(s=> <option key={s} value={s}>{s}</option>)}
            </select>

            {/* Soil & weather */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <input type="number" step="0.1" value={form.soil_ph} onChange={(e)=>setForm({...form, soil_ph: e.target.value})} className="p-3 border rounded-md text-black" placeholder="Soil pH" />
              <input type="number" step="1" value={form.soil_n} onChange={(e)=>setForm({...form, soil_n: e.target.value})} className="p-3 border rounded-md text-black" placeholder="Soil N (kg/ha)" />
              <input type="number" step="1" value={form.soil_p} onChange={(e)=>setForm({...form, soil_p: e.target.value})} className="p-3 border rounded-md text-black" placeholder="Soil P (kg/ha)" />
              <input type="number" step="1" value={form.soil_k} onChange={(e)=>setForm({...form, soil_k: e.target.value})} className="p-3 border rounded-md text-black" placeholder="Soil K (kg/ha)" />
              <input type="number" step="0.1" value={form.rainfall_30d} onChange={(e)=>setForm({...form, rainfall_30d: e.target.value})} className="p-3 border rounded-md text-black" placeholder="Rainfall 30d (mm)" />
              <input type="number" step="0.1" value={form.temp_mean_30d} onChange={(e)=>setForm({...form, temp_mean_30d: e.target.value})} className="p-3 border rounded-md text-black" placeholder="Temp mean 30d (°C)" />
              <input type="number" step="0.1" value={form.previous_yield} onChange={(e)=>setForm({...form, previous_yield: e.target.value})} className="p-3 border rounded-md col-span-2 text-black" placeholder="Previous yield (q/ha) - optional" />
            </div>

            {/* Fertilizer & Pest */}
            <div className="mt-3">
              <h3 className="text-lg font-medium text-black">Fertilizer</h3>
              <input type="text" value={form.fertilizer_used} onChange={(e)=>setForm({...form, fertilizer_used: e.target.value})} className="w-full mt-2 p-3 border rounded-md text-black" placeholder="Fertilizer used (e.g. NPK 10-26-26)" />
              <input type="number" step="1" value={form.fertilizer_amount_kg_per_ha} onChange={(e)=>setForm({...form, fertilizer_amount_kg_per_ha: e.target.value})} className="w-full mt-2 p-3 border rounded-md text-black" placeholder="Amount (kg/ha)" />
            </div>

            <div className="mt-3">
              <h3 className="text-lg font-medium text-black">Pest / Disease</h3>
              <input type="text" value={form.recent_pest_issue} onChange={(e)=>setForm({...form, recent_pest_issue: e.target.value})} className="w-full mt-2 p-3 border rounded-md text-black" placeholder="Recent pest/disease (optional)" />
              <p className="text-sm text-gray-600 mt-1">E.g. Stem borer, Blast, Fall armyworm</p>
            </div>

            <div className="mt-5">
              <button onClick={handlePredict} disabled={loading} className="w-full py-3 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold shadow">
                {loading ? "Predicting..." : "Predict Yield"}
              </button>
            </div>
          </motion.div>

          {/* Right column - summary tiles (spans 2 of 3 on wide screens) */}
          <div className="lg:col-span-2 space-y-6">
            {/* big chart controls + chart */}
            <div className="bg-white p-4 rounded-2xl shadow border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-700">Start Year</label>
                  <input type="number" value={startYear} onChange={(e)=>setStartYear(Number(e.target.value))} className="p-2 border rounded-md w-24" />
                  <label className="ml-3 text-sm text-gray-700">End Year</label>
                  <input type="number" value={endYear} onChange={(e)=>setEndYear(Number(e.target.value))} className="p-2 border rounded-md w-24" />
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={showHistorical} onChange={(e)=>setShowHistorical(e.target.checked)} /> Show historical</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={showPredicted} onChange={(e)=>setShowPredicted(e.target.checked)} /> Show predicted</label>
                  <button onClick={downloadChartCsv} className="ml-3 px-3 py-2 bg-gray-100 rounded-md border">Download CSV</button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-black mb-2">5-Year Yield Trend (example)</h3>
              <div style={{ width: "100%", height: 380 }}>
                <ResponsiveContainer width="100%" height={380}>
                  <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: any, name: any) => [value, name]} />
                    <Legend />
                    {showHistorical && <Line type="monotone" dataKey="historical" stroke="#8884d8" dot={{ r: 4 }} strokeWidth={2} name="Historical yield (q/ha)" />}
                    {showPredicted && <Line type="monotone" dataKey="predicted" stroke="#16a34a" dot={{ r: 6 }} strokeWidth={3} strokeDasharray="5 5" name="Predicted yield (q/ha)" />}
                    {/* annotation: latest predicted point */}
                    {showPredicted && prediction?.yield && (
                      <ReferenceDot x={String(Number(endYear) + 1)} y={Number(prediction.yield)} r={6} fill="#16a34a" stroke="#fff" label={{ position: "top", value: `Pred ${prediction.yield}`, fill: "#0f5132" }} />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Prediction + advice blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl shadow border border-gray-200">
                <h4 className="text-sm font-semibold text-black">Predicted Yield</h4>
                <p className="text-3xl font-bold text-green-700 mt-2">{prediction?.yield ?? "—"} {prediction?.units ?? "q/ha"}</p>
                <p className="text-sm text-gray-600 mt-1">Model estimate based on inputs</p>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow border border-gray-200">
                <h4 className="text-sm font-semibold text-black">Fertilizer Advice</h4>
                <p className="text-gray-700 mt-2">{prediction?.fertilizer?.summary ?? "Provide soil test for precise recommendations."}</p>
                <ul className="list-disc list-inside text-gray-700 mt-2">
                  {prediction?.fertilizer?.recommendations?.slice(0,4).map((r:string,i:number)=>(<li key={i}>{r}</li>))}
                </ul>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow border border-gray-200">
                <h4 className="text-sm font-semibold text-black">Pest Management</h4>
                <p className="text-gray-700 mt-2">{prediction?.pest?.summary ?? "No pest info provided."}</p>
                <ul className="list-disc list-inside text-gray-700 mt-2">
                  {prediction?.pest?.recommendations?.slice(0,4).map((r:string,i:number)=>(<li key={i}>{r}</li>))}
                </ul>
              </div>
            </div>

            {/* Detailed Conclusions full-width */}
            <div className="bg-white p-4 rounded-2xl shadow border border-gray-200">
              <h4 className="text-lg font-semibold text-black mb-3">Detailed Conclusions & Action Plan</h4>
              {prediction?.conclusions ? (
                <ol className="list-decimal list-inside text-gray-800 space-y-2">
                  {prediction.conclusions.map((c:string,i:number)=>(<li key={i}><span className="font-semibold mr-2">Step {i+1}:</span>{c}</li>))}
                </ol>
              ) : (
                <p className="text-gray-700">No conclusions yet — run prediction to get a prioritized action plan.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------------------------
  Helper heuristics (client-side)
---------------------------- */

function buildFertilizerAdvice(opts: {
  soil_n?: number, soil_p?: number, soil_k?: number,
  fertilizer_used?: string, fertilizer_amount?: number,
  previous_yield?: number, predicted_yield?: number
}) {
  const { soil_n, soil_p, soil_k, fertilizer_used, fertilizer_amount, previous_yield, predicted_yield } = opts;
  const recs: string[] = [];
  if (soil_n == null || isNaN(soil_n)) recs.push("Get soil N test for exact N recommendation.");
  else if (soil_n < 80) recs.push("Soil N low — apply recommended N (split dosing) such as urea in splits.");
  else if (soil_n > 250) recs.push("Soil N high — avoid extra N to prevent lodging and N loss.");
  else recs.push("Soil N moderate — follow balanced N schedule.");

  if (soil_p == null || isNaN(soil_p)) recs.push("Get soil P test; apply basal P (DAP/SSP) if low.");
  else if (soil_p < 20) recs.push("Soil P low — apply phosphorus at basal dose (e.g., DAP).");
  else recs.push("Soil P adequate for many crops.");

  if (soil_k == null || isNaN(soil_k)) recs.push("Get K test; K side-dressing may be required.");
  else if (soil_k < 120) recs.push("Soil K low — apply muriate of potash as needed.");
  else recs.push("Soil K appears adequate.");

  if (fertilizer_amount != null && !isNaN(fertilizer_amount)) {
    if (fertilizer_amount < 50) recs.push("Applied fertilizer seems low — validate recommended dose for crop.");
    else if (fertilizer_amount > 300) recs.push("Applied fertilizer seems high — avoid over-application.");
    else recs.push("Applied fertilizer amount within common range; ensure correct splits.");
  }

  if (previous_yield != null && predicted_yield != null) {
    if (predicted_yield > previous_yield * 1.15) recs.push("Predicted improvement — maintain soil fertility and irrigation.");
    else if (predicted_yield < previous_yield * 0.9) recs.push("Predicted drop — prioritize soil fertility improvement.");
  }

  const summary = recs[0] ?? "Follow soil-test based fertilization.";
  return { summary, recommendations: recs };
}

function buildPestAdvice(opts: { rainfall_30d?: number, temp_mean_30d?: number, recent_pest_issue?: string }) {
  const { rainfall_30d, temp_mean_30d, recent_pest_issue } = opts;
  const recs: string[] = [];
  if (recent_pest_issue) recs.push(`Reported: ${recent_pest_issue} — do targeted scouting and IPM.`);
  else recs.push("No pest reported — maintain weekly scouting.");

  if (rainfall_30d != null && rainfall_30d > 150) recs.push("Heavy rainfall increases fungal risks — prioritize disease monitoring.");
  if (temp_mean_30d != null && temp_mean_30d > 30) recs.push("High temp may favor some pests — increase monitoring.");

  recs.push("Practice field sanitation and use biological control wherever possible.");
  const summary = recs[0];
  return { summary, recommendations: recs };
}

function buildConclusions(opts: {
  predicted_yield?: number, previous_yield?: number,
  fertAdvice?: any, pestAdvice?: any, soil_ph?: number,
  soil_n?: number, soil_p?: number, soil_k?: number, crop?: string
}) {
  const conclusions: string[] = [];
  const { predicted_yield, previous_yield, fertAdvice, pestAdvice, soil_ph, soil_n, soil_p, soil_k, crop } = opts;

  if (predicted_yield != null) {
    conclusions.push(`Model predicts ${Number(predicted_yield).toFixed(2)} q/ha for ${crop ?? "the crop"}.`);
    if (previous_yield != null) {
      if (predicted_yield > previous_yield * 1.1) conclusions.push("This suggests potential improvement — preserve current good practices and refine irrigation timing.");
      else if (predicted_yield < previous_yield * 0.9) conclusions.push("This suggests a yield gap — address soil fertility and water stress first.");
      else conclusions.push("Yield looks similar to last season — small optimizations can help.");
    }
  } else {
    conclusions.push("Prediction not available — use soil test and local advice.");
  }

  if (soil_ph != null) {
    if (soil_ph < 5.5) conclusions.push("Soil acidic: apply lime as per soil test.");
    else if (soil_ph > 7.8) conclusions.push("Soil alkaline: consider gypsum or acidifying measures.");
    else conclusions.push("Soil pH acceptable.");
  } else conclusions.push("Obtain soil pH test.");

  if (fertAdvice) conclusions.push(...(fertAdvice.recommendations || []).slice(0,3).map((r:string)=>`FERT: ${r}`));
  if (pestAdvice) conclusions.push(...(pestAdvice.recommendations || []).slice(0,3).map((r:string)=>`PEST: ${r}`));

  conclusions.push("Quick wins: correct planting date, split nitrogen dosing, timely irrigation (flowering), and weekly pest scouting.");
  conclusions.push("Consult local extension for crop-specific schedules and soil-test based fertilizer charts.");

  return conclusions;
}
