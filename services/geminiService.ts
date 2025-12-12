import { GoogleGenAI, Type, Schema, GenerateContentResponse } from "@google/genai";
import { AnalysisResult, ChatMessage } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Retry Logic Helper
async function withRetry<T>(fn: () => Promise<T>, retries = 2, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries === 0) throw error;
    
    // Check if error is retryable (network, 5xx)
    const isRetryable = error.message?.includes('fetch') || error.status >= 500;
    if (!isRetryable) throw error;

    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
}

const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64String = result.split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeMedicalCase = async (
  reportFile: File | null,
  imageFile: File | null,
  videoFile: File | null
): Promise<AnalysisResult> => {
  if (!apiKey) {
      throw new Error("API Key is missing. Please check your configuration.");
  }

  const parts = [];

  try {
    if (reportFile) {
      if (reportFile.size > 50 * 1024 * 1024) throw new Error("Report file exceeds 50MB limit.");
      parts.push(await fileToGenerativePart(reportFile));
      parts.push({ text: "Here is the medical report." });
    }
    if (imageFile) {
      if (imageFile.size > 50 * 1024 * 1024) throw new Error("Image file exceeds 50MB limit.");
      parts.push(await fileToGenerativePart(imageFile));
      parts.push({ text: "Here is the medical scan." });
    }
    if (videoFile) {
      if (videoFile.size > 100 * 1024 * 1024) throw new Error("Video file exceeds 100MB limit.");
      parts.push(await fileToGenerativePart(videoFile));
      parts.push({ text: "Here is a video context." });
    }
  } catch (e: any) {
    throw new Error(`File processing failed: ${e.message}`);
  }

  const systemPrompt = `
    You are MedVision Pro, a specialized medical AI analysis engine.
    
    TASK:
    Extract clinical data and findings from the provided medical files.
    
    CRITICAL EXTRACTION RULES:
    1. EXTRACT REAL DATA ONLY: You must ONLY output values that are explicitly present in the files. 
    2. NO TEMPLATES: Do not default to "John Doe" or generic values. If the patient name is not found, use "Patient".
    3. ACCURACY: If a specific biomarker (e.g., Glucose, HbA1c) is not in the file, do NOT invent a value.
    4. FINDINGS: List specific abnormalities found in the text or image.
    5. SEVERITY: Flag severity based on the actual values found relative to standard medical ranges.
    6. PATIENT IDENTITY: Look carefully for Patient Name, Age, and ID at the top of reports.
    
    OUTPUT FORMAT:
    Return ONLY valid JSON matching the schema.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      patientName: { type: Type.STRING },
      patientId: { type: Type.STRING },
      age: { type: Type.NUMBER },
      vitals: {
        type: Type.OBJECT,
        properties: {
          bp: { type: Type.STRING },
          heartRate: { type: Type.STRING },
          temperature: { type: Type.STRING },
          spo2: { type: Type.STRING },
        }
      },
      riskLevel: { type: Type.STRING, enum: ["low", "medium", "high"] },
      riskScore: { type: Type.NUMBER },
      summary: { type: Type.STRING },
      findings: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            severity: { type: Type.STRING, enum: ["low", "medium", "high", "critical"] },
            modalitySource: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidence: { type: Type.NUMBER },
          }
        }
      },
      annotations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            label: { type: Type.STRING },
            description: { type: Type.STRING },
            box2d: { type: Type.ARRAY, items: { type: Type.NUMBER } },
          }
        }
      },
      recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
      historicalComparison: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            metric: { type: Type.STRING },
            previous: { type: Type.NUMBER },
            current: { type: Type.NUMBER },
            unit: { type: Type.STRING },
            trend: { type: Type.STRING, enum: ["improving", "stable", "worsening"] },
          }
        }
      },
    }
  };

  try {
    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        {
          role: 'user',
          parts: [
            { text: systemPrompt },
            ...parts
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        thinkingConfig: { thinkingBudget: 16000 }
      }
    }));

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    } else {
      throw new Error("AI returned empty analysis.");
    }

  } catch (error: any) {
    console.error("Analysis Error:", error);
    if (error.message?.includes('429')) throw new Error("System is busy. Please try again in a moment.");
    if (error.message?.includes('SAFETY')) throw new Error("Content flagged by safety filters. Unable to analyze.");
    throw new Error("Unable to complete analysis. Please check your internet connection.");
  }
};


export const chatWithMedicalContext = async (
  history: ChatMessage[],
  newMessage: string,
  context: AnalysisResult
): Promise<string> => {
  if (!apiKey) return "Demo Mode: I can't generate new responses, but feel free to browse the sample data.";

  // Check if context is empty/dummy
  const hasContext = context && context.findings && context.findings.length > 0;
  
  const contextStr = hasContext ? JSON.stringify(context) : "NO SPECIFIC MEDICAL FILE UPLOADED YET.";

  // Quick check for prescription requests
  const lowerMsg = newMessage.toLowerCase();
  if (lowerMsg.includes('prescribe') || lowerMsg.includes('prescription')) {
    return "⚠️ **I cannot write prescriptions.** \n\nI can explain what medications are typically used for this condition, but you must see a licensed doctor to get a valid prescription.";
  }
  
  const systemInstruction = `
    You are ClinicalRAG, an empathetic and highly intelligent medical assistant.

    CURRENT PATIENT CONTEXT: ${contextStr}

    ═══════════════════════════════════════════════════════════════════════════════
    CRITICAL INSTRUCTION: DYNAMIC & PERSONALIZED ANALYSIS
    ═══════════════════════════════════════════════════════════════════════════════

    You are analyzing the specific patient data provided in the CONTEXT above.
    
    DO NOT use generic templates.
    DO NOT assume conditions (e.g. Diabetes) if the report is about something else (e.g. Chest Pain).
    
    1. **READ THE CONTEXT**:
       - What is the patient's name? Use it. (e.g. "Mr. PH", "Sarah")
       - What are the specific findings? (e.g. Glucose 126, Chest Pain, Fracture)
       
    2. **USE LAYMAN'S ANALOGIES (Mandatory)**:
       - Explain medical concepts using simple comparisons.
       - Examples:
         * HbA1c -> "Blood sugar 3-month average"
         * Blood Pressure -> "Water pressure in a hose"
         * Red Blood Cells -> "Oxygen delivery trucks" or "Factory workers"
         * Cholesterol -> "Clogged pipes"
         * Infection -> "Invading army"
         * Antibiotics -> "Reinforcements"
    
    3. **STRICT RESPONSE STRUCTURE**:
    
       **Hello [Patient Name],**
       I reviewed your [Report Type] from [Date if available]. Here is what I found:
       
       **1. [Main Finding 1]**
       - **What it is:** [Simple explanation]
       - **The Analogy:** [Insert Analogy]
       - **Status:** 🟢 / 🟡 / 🔴 (Use Traffic Lights)
       
       **2. [Main Finding 2]**
       ... (Repeat for key findings)
       
       **What You Should Do:**
       - [Action 1]
       - [Action 2]
       
       **⚠️ Red Flags (When to call doctor):**
       - [Symptom 1]
       - [Symptom 2]
       
       **Summary:**
       [Encouraging closing statement]

    4. **SAFETY**:
       - Start with "🚑 EMERGENCY" if the context suggests heart attack, stroke, or severe trauma.
       - Never prescribe medication.
       - Always recommend consulting a doctor.

    Refuse to answer questions unrelated to health/medical topics.
  `;
  
  try {
      // Upgrading to gemini-3-pro-preview for chat as well to ensure high-quality reasoning and adherence to analogies.
      const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
            { role: 'user', parts: [{ text: systemInstruction }]},
            ...history.map(h => ({
                role: h.role,
                parts: [{ text: h.text || '' }]
            })),
            { role: 'user', parts: [{ text: newMessage }]}
        ],
        config: {
            tools: [{ googleSearch: {} }] 
        }
      }));

      return response.text || "I'm having trouble thinking right now. Please try again.";
  } catch (e: any) {
      console.error("Chat error", e);
      return "Connection error. Please check your internet and try again.";
  }
};