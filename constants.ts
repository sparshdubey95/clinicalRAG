import { AnalysisResult, DemoScenario, MedicineDetails } from './types';
import { FileText, Scan, FilePlus, Activity, Video, Pill } from 'lucide-react';

// 1. BLOOD WORK - Metabolic Panel
const BLOOD_WORK_RESULT: AnalysisResult = {
  patientName: "John Doe",
  patientId: "MRN-99281",
  age: 45,
  vitals: { bp: "145/92", heartRate: "88", temperature: "98.6", spo2: "98%" },
  riskLevel: "medium",
  riskScore: 65,
  summary: "Comprehensive metabolic panel indicates elevated glucose and HbA1c levels suggestive of pre-diabetes. Lipid profile shows borderline high cholesterol. Immediate lifestyle intervention recommended.",
  findings: [
    { id: "f1", title: "High Fasting Glucose", description: "Fasting blood glucose is 126 mg/dL (Normal: <100). Indicates impaired fasting glucose.", severity: "high", modalitySource: ["report"], confidence: 99 },
    { id: "f2", title: "Elevated HbA1c", description: "HbA1c is 6.1% (Normal: <5.7%). Consistent with pre-diabetes range.", severity: "medium", modalitySource: ["report"], confidence: 99 },
    { id: "f3", title: "Hypertension (Stage 1)", description: "Blood pressure 145/92 mmHg confirmed on two separate readings.", severity: "medium", modalitySource: ["report"], confidence: 95 },
    { id: "f4", title: "High LDL Cholesterol", description: "LDL (Bad Cholesterol) is 145 mg/dL (Target: <100).", severity: "medium", modalitySource: ["report"], confidence: 98 }
  ],
  annotations: [],
  recommendations: ["Dietary modification (Low Carb/Mediterranean)", "Initiate 30min daily cardio", "Home BP monitoring", "Follow up HbA1c in 3 months"],
  historicalComparison: [
    { metric: "Glucose", previous: 105, current: 126, unit: "mg/dL", trend: "worsening" },
    { metric: "HbA1c", previous: 5.8, current: 6.1, unit: "%", trend: "worsening" },
    { metric: "LDL", previous: 130, current: 145, unit: "mg/dL", trend: "worsening" }
  ]
};

// 2. X-RAY - Pneumonia Anomaly
const PNEUMONIA_RESULT: AnalysisResult = {
  patientName: "Robert Chen",
  patientId: "MRN-88421",
  age: 58,
  vitals: { bp: "135/85", heartRate: "92", temperature: "100.2", spo2: "94%" },
  riskLevel: "high",
  riskScore: 78,
  summary: "Chest radiograph demonstrates airspace opacity in the right lower lobe consistent with community-acquired pneumonia. Slight pleural blunting noted. No pneumothorax.",
  findings: [
    { id: "x1", title: "Right Lower Lobe Opacity", description: "Focal consolidation observed in the right lower lung field, highly suggestive of bacterial pneumonia.", severity: "high", modalitySource: ["image"], confidence: 96 },
    { id: "x2", title: "Pleural Effusion", description: "Mild blunting of the right costophrenic angle indicating small fluid collection.", severity: "medium", modalitySource: ["image"], confidence: 89 },
    { id: "x3", title: "Cardiac Silhouette", description: "Heart size is upper limit of normal.", severity: "low", modalitySource: ["image"], confidence: 95 }
  ],
  annotations: [
    { label: "Consolidation", description: "Area of infection", box2d: [550, 200, 850, 500] },
    { label: "Costophrenic Angle", description: "Fluid blunting", box2d: [850, 150, 950, 300] }
  ],
  recommendations: ["Initiate empiric antibiotics (Azithromycin + Ceftriaxone)", "Monitor SpO2 continuously", "Follow up CXR in 4-6 weeks to ensure resolution"],
  historicalComparison: []
};

// 3. PRESCRIPTION - Handwritten Decoder
const PRESCRIPTION_RESULT: AnalysisResult = {
  patientName: "Unknown",
  patientId: "N/A",
  age: 0,
  vitals: { bp: "-", heartRate: "-", temperature: "-", spo2: "-" },
  riskLevel: "low",
  riskScore: 0,
  summary: "Handwritten prescription decoded successfully. Identified antibiotic and antipyretic regimen.",
  findings: [
    { id: "p1", title: "Amoxicillin 500mg", description: "Antibiotic. Rx: 1 tablet TDS (Three times a day) x 5 days.", severity: "low", modalitySource: ["image"], confidence: 92 },
    { id: "p2", title: "Paracetamol 650mg", description: "Analgesic/Antipyretic. Rx: 1 tablet SOS (As needed for fever/pain).", severity: "low", modalitySource: ["image"], confidence: 94 },
    { id: "p3", title: "Pantoprazole 40mg", description: "Proton Pump Inhibitor. Rx: 1 tablet OD (Once daily) before breakfast.", severity: "low", modalitySource: ["image"], confidence: 88 }
  ],
  annotations: [],
  recommendations: ["Complete full course of antibiotics", "Take Pantoprazole 30 mins before food", "Stay hydrated"],
  historicalComparison: []
};

// 4. VIDEO - Doctor Note Analysis
const VIDEO_RESULT: AnalysisResult = {
  patientName: "Sarah Miller",
  patientId: "MRN-VIDEO-09",
  age: 29,
  vitals: { bp: "110/70", heartRate: "76", temperature: "98.4", spo2: "99%" },
  riskLevel: "medium",
  riskScore: 45,
  summary: "Analysis of doctor's video explanation confirms diagnosis of Iron Deficiency Anemia and Vitamin D Deficiency. Fatigue is the primary presenting symptom.",
  findings: [
    { id: "v1", title: "Conjunctival Pallor", description: "Visual analysis of patient examination in video shows pale inner eyelids, a classic sign of anemia.", severity: "medium", modalitySource: ["video"], confidence: 88 },
    { id: "v2", title: "Reported Fatigue", description: "Patient self-reports 'chronic lethargy' and 'brain fog' in the interview segment.", severity: "medium", modalitySource: ["video", "report"], confidence: 95 },
    { id: "v3", title: "Treatment Plan Identification", description: "Doctor explicitly recommends 'Iron + Vit C' and 'Weekly Vit D' protocol.", severity: "low", modalitySource: ["video"], confidence: 92 }
  ],
  annotations: [],
  recommendations: ["Iron supplementation (Ferrous Sulfate) with Orange Juice", "Vitamin D3 60,000 IU weekly for 8 weeks", "Increase dietary intake of spinach and red meat"],
  historicalComparison: []
};

// 5. TRENDS - Longitudinal Data
const TRENDS_RESULT: AnalysisResult = {
  patientName: "Michael Chang",
  patientId: "MRN-44210",
  age: 52,
  vitals: { bp: "130/82", heartRate: "78", temperature: "98.6", spo2: "98%" },
  riskLevel: "medium",
  riskScore: 55,
  summary: "Longitudinal analysis of lab reports from Jan, Feb, and March 2025. Positive trend observed in Lipid profile after starting statins. Glycemic control remains suboptimal.",
  findings: [
    { id: "t1", title: "Improving Cholesterol", description: "Total Cholesterol dropped from 240 to 190 mg/dL over 3 months.", severity: "low", modalitySource: ["report"], confidence: 100 },
    { id: "t2", title: "Persistent Hyperglycemia", description: "Fasting glucose remains >115 mg/dL despite medication.", severity: "medium", modalitySource: ["report"], confidence: 100 },
    { id: "t3", title: "Stable Kidney Function", description: "Creatinine levels stable at 0.9 mg/dL.", severity: "low", modalitySource: ["report"], confidence: 100 }
  ],
  annotations: [],
  recommendations: ["Continue Atorvastatin 10mg", "Strict adherence to diabetic diet", "Endocrinology referral for sugar control"],
  historicalComparison: [
    { metric: "Total Cholesterol", previous: 240, current: 190, unit: "mg/dL", trend: "improving" },
    { metric: "LDL", previous: 160, current: 110, unit: "mg/dL", trend: "improving" },
    { metric: "Fasting Glucose", previous: 118, current: 122, unit: "mg/dL", trend: "worsening" },
    { metric: "Triglycerides", previous: 180, current: 165, unit: "mg/dL", trend: "improving" },
    { metric: "Creatinine", previous: 0.9, current: 0.9, unit: "mg/dL", trend: "stable" }
  ]
};

// 6. MEDICINE ORDERING - Paracetamol Mock
export const MEDICINE_DETAILS_MOCK: MedicineDetails = {
  name: "Paracetamol",
  strength: "500mg",
  quantity: "Strip of 15 Tablets",
  savings: 15,
  prices: [
    { name: "Flipkart Health+", price: 145, url: "https://www.flipkart.com/search?q=Paracetamol+500mg", isCheapest: true },
    { name: "PharmEasy", price: 148, url: "https://www.pharmeasy.in/search?name=Paracetamol+500mg" },
    { name: "Amazon Pharmacy", price: 150, url: "https://amazon.in/s?field-keywords=Paracetamol+500mg" },
    { name: "Tata 1mg", price: 152, url: "https://www.1mg.com/search?q=Paracetamol+500mg" },
    { name: "Apollo Pharmacy", price: 160, url: "https://www.apollopharmacy.in/search?q=Paracetamol+500mg" },
  ]
};

const MEDICINE_RESULT: AnalysisResult = {
  patientName: "Guest User",
  patientId: "GUEST-01",
  age: 30,
  vitals: { bp: "-", heartRate: "-", temperature: "-", spo2: "-" },
  riskLevel: "low",
  riskScore: 0,
  summary: "Pharmacy price comparison for Paracetamol 500mg.",
  findings: [],
  annotations: [],
  recommendations: ["Verify prescription requirements", "Check expiry date upon delivery"],
  historicalComparison: []
};


export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'bloodwork',
    title: 'Analyze Blood Work',
    description: 'Abnormal glucose & lipids detected',
    icon: FileText,
    prompt: "Analyze my blood work report. I'm worried about the red flagged values.",
    mockAttachment: { name: 'Lab_Report_Jan2025.pdf', type: 'report', isDemo: true },
    mockAnalysis: BLOOD_WORK_RESULT,
    mockResponse: {
      simple: "Your blood work shows early signs of **pre-diabetes** and **high blood pressure**. \n\nThink of glucose like fuel for your car. Right now, there's a bit too much fuel in the tank (your blood) that isn't getting into the engine (your cells). This makes the engine run rough.\n\nYour HbA1c (a 3-month average of sugar) is 6.1%. \n- **Normal:** Below 5.7%\n- **Pre-diabetes:** 5.7% - 6.4%\n- **Diabetes:** 6.5% or higher\n\nYou are in the 'Yellow Zone' - it's a warning light, but you can turn it around.",
      actions: [
        "Cut down on sugary drinks and white bread/rice immediately.",
        "Take a 20-minute walk after dinner every day.",
        "Monitor your blood pressure at home twice a week."
      ],
      technical: "Patient exhibits Impaired Fasting Glucose (IFG) with values >100mg/dL. HbA1c indicates pre-diabetic range. Hypertension Stage 1 noted. Recommended lifestyle intervention before pharmacotherapy."
    }
  },
  {
    id: 'xray',
    title: 'X-Ray Anomaly',
    description: 'Pneumonia detected in right lung',
    icon: Scan,
    prompt: "What does this chest X-ray show? The doctor mentioned a 'spot'.",
    mockAttachment: { name: 'Chest_XR_Pneumonia.jpg', type: 'image', previewUrl: 'https://prod-images-static.radiopaedia.org/images/1336495/43734036b13286e680517565431665_jumbo.jpeg', isDemo: true },
    mockAnalysis: PNEUMONIA_RESULT,
    mockResponse: {
      simple: "The X-ray shows an area of **Pneumonia** in your right lung.\n\nThink of your lungs like soft sponges that fill with air. The X-ray shows a 'cloudy' patch in the lower right part, which means that part of the sponge has some fluid/infection instead of just air.\n\nThis explains why you might be coughing or feeling feverish.",
      actions: [
        "Start the prescribed antibiotics immediately.",
        "Use a thermometer to track your fever daily.",
        "Go to ER if you have trouble breathing."
      ],
      technical: "Right Lower Lobe (RLL) consolidation observed with air bronchograms, consistent with bacterial pneumonia. Mild parapneumonic effusion likely. No evidence of pneumothorax."
    }
  },
  {
    id: 'prescription',
    title: 'Decode Prescription',
    description: 'Messy handwriting to clear list',
    icon: FilePlus,
    prompt: "I can't read this doctor's note. What medicines do I need to take?",
    mockAttachment: { name: 'Rx_Dr_Gupta.jpg', type: 'image', previewUrl: 'https://media.istockphoto.com/id/175426038/photo/medical-prescription.jpg?s=612x612&w=0&k=20&c=1y2Ew-lY6F2uTlzr-J0O3Z-d7vE8yK-W4p5p_5p-5p0=', isDemo: true },
    mockAnalysis: PRESCRIPTION_RESULT,
    mockResponse: {
      simple: "I've decoded the handwriting. The doctor prescribed three medicines:\n\n1. **Amoxicillin (500mg)**\n   - **Antibiotic**: Kills bacteria.\n   - **Dose**: 1 pill, 3 times a day for 5 days.\n\n2. **Paracetamol (650mg)**\n   - **For Fever/Pain**: Take only if you feel hot or hurt.\n\n3. **Pantoprazole (40mg)**\n   - **Stomach Protector**: Take this 30 mins *before* breakfast to prevent acidity.",
      actions: [
        "Set an alarm to take antibiotics at the same time every day.",
        "Finish the full 5-day course even if you feel better."
      ],
      technical: "OCR Analysis: 1. Amoxicillin 500mg PO TDS x 5 days. 2. Paracetamol 650mg PO SOS. 3. Pantoprazole 40mg PO OD AC. Handwriting clarity: Low. Confidence: High."
    }
  },
  {
    id: 'video',
    title: 'Video Explanation',
    description: 'Summary of doctor\'s visit',
    icon: Video,
    prompt: "Transcribe and summarize what the doctor explained in this video.",
    mockAttachment: { name: 'Doctor_Visit_Recording.mp4', type: 'video', isDemo: true },
    mockAnalysis: VIDEO_RESULT,
    mockResponse: {
      simple: "In the video, the doctor explained that your fatigue is likely due to **Vitamin D deficiency** and **mild anemia**.\n\nImagine your body is a solar-powered battery - right now, you aren't storing enough charge from the sun (Vitamin D) and your iron levels (anemia) are a bit low, making the battery drain faster.\n\nShe noted your inner eyelids looked pale.",
      actions: [
        "Start Vitamin D3 supplements (60k IU) once a week for 8 weeks.",
        "Take Iron supplements with orange juice (helps absorption).",
        "Sit in morning sunlight for 15 minutes."
      ],
      technical: "Video Analysis: Physician discusses fatigue etiology. Signs: Conjunctival pallor. Diagnosis: Iron Deficiency Anemia + Vit D Deficiency. Plan: Oral supplementation."
    }
  },
  {
    id: 'comparison',
    title: 'Lab Trends',
    description: 'Graph analysis of 3 months',
    icon: Activity,
    prompt: "Compare my current lab results with last month's. Am I getting better?",
    mockAttachment: { name: 'Multi_Lab_Export.pdf', type: 'report', isDemo: true },
    mockAnalysis: TRENDS_RESULT,
    mockResponse: {
      simple: "I've analyzed your trends over the last 3 months.\n\n**🎉 Great Progress:**\n- Your **Cholesterol** has dropped significantly (240 → 190). The medicine is working!\n\n**⚠️ Needs Attention:**\n- Your **Blood Sugar** is still a bit high (122). It hasn't come down yet.\n\nOverall, your heart health is improving, but we need to focus more on diet for the sugar levels.",
      actions: [
        "Keep taking the cholesterol medicine (Atorvastatin).",
        "Try cutting out dessert for 2 weeks to help the sugar levels.",
        "Schedule a follow-up test in 3 months."
      ],
      technical: "Longitudinal analysis: LDL -31% (Significant improvement). Fasting Glucose +3% (Worsening). Renal function stable. Statin efficacy demonstrated."
    }
  },
  {
    id: 'medicine',
    title: 'Order Medicine',
    description: 'Find cheapest prices online',
    icon: Pill,
    prompt: "Find the cheapest Paracetamol 500mg tablets online.",
    mockAttachment: { name: 'search_query.txt', type: 'report', isDemo: true },
    mockAnalysis: MEDICINE_RESULT,
    mockResponse: {
      simple: "I've found the best prices for **Paracetamol 500mg** across multiple online pharmacies.\n\n**🏆 Best Deal:** Flipkart Health+ is offering the lowest price at ₹145.\n\nCheck the comparison card below to order directly from certified pharmacies.",
      actions: [
        "Verify the quantity (Strip vs Bottle) before ordering.",
        "Check if you need a prescription upload for this medicine."
      ],
      technical: "Price Scraping: 5 vendors analyzed. Range: ₹145 - ₹160. Variance: 10.3%. Best vendor: Flipkart Health+."
    }
  }
];
