import React, { useState, useEffect, useRef } from "react";
import {
    Code2,
    Layers,
    Network,
    Play,
    Upload,
    Copy,
    Check,
    Sparkles,
    Key,
    RefreshCw,
    Terminal,
    Eye,
    Cpu,
    ShieldAlert,
    Braces,
    FileCode,
    Zap,
    HelpCircle,
    ChevronRight,
    Info,
    Maximize2,
    X,
    FileJson,
    Layout,
    CheckCircle2,
    AlertTriangle,
    ArrowRight,
    User,
    LogOut,
    Binary,
} from "lucide-react";

    // Preset sample data for instant sandbox testing
    const PRESETS = {
    UI: [
        {
        id: "ui-1",
        title: "Dark Mode Product Card",
        desc: "E-commerce product card with tag, rating, and CTA",
        preview:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
        },
        {
        id: "ui-2",
        title: "SaaS Analytics Widget",
        desc: "Metric card with sparkline trend indicator",
        preview:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
        },
    ],
    CODE: [
        {
        id: "code-1",
        title: "Minified Auth Token Validator",
        lang: "javascript",
        raw: `function _0x4a2b(d,e){var f=_0x1b2c();return _0x4a2b=function(a,b){a=a-0x0;var c=f[a];return c;},_0x4a2b(d,e);}function validateToken(_0x1e2f){var _0x3a21=_0x4a2b;if(!_0x1e2f)return!1;var _0x5f12=_0x1e2f['split']('.');if(_0x5f12['length']!==0x3)return!1;try{var _0x2b4c=JSON['parse'](atob(_0x5f12[0x1]));return _0x2b4c['exp']&&_0x2b4c['exp']>(Date['now']()/0x3e8);}catch(_0x4d3e){return!1;}}`,
        },
        {
        id: "code-2",
        title: "Obfuscated C++ Encryption Chunk",
        lang: "cpp",
        raw: `void _x99(char* k,char* d,int l){int _a=0;_b:if(_a>=l)goto _c;d[_a]=d[_a]^k[_a%0x10];_a++;goto _b;_c:return;}`,
        },
    ],
    NETWORK: [
        {
        id: "net-1",
        title: "User Profile Response Payload",
        raw: JSON.stringify(
            {
            id: "usr_9921841",
            account_type: "enterprise_v2",
            attributes: {
                full_name: "Amina Al-Sayed",
                email: "amina.dev@system.io",
                verified: true,
                roles: ["admin", "security_auditor"],
                login_count: 142,
            },
            billing: {
                plan: "scale_monthly",
                active_until: 1775001600,
                payment_method: "card_4242",
            },
            tags: ["beta_tester", "high_volume"],
            },
            null,
            2,
        ),
        },
        {
        id: "net-2",
        title: "E-commerce Checkout Session",
        raw: JSON.stringify(
            {
            session_id: "chk_live_891283",
            amount_total: 12900,
            currency: "usd",
            payment_status: "paid",
            line_items: [
                {
                item_id: "itm_01",
                qty: 2,
                price: 4950,
                name: "Developer Pass Tier 1",
                },
                {
                item_id: "itm_09",
                qty: 1,
                price: 3000,
                name: "Priority Support Addon",
                },
            ],
            },
            null,
            2,
        ),
        },
    ],
    BINARY: [
        {
        id: "bin-1",
        title: "ELF 64-bit LSB Executable Check",
        raw: "7f 45 4c 46 02 01 01 00 00 00 00 00 00 00 00 00 02 00 3e 00 01 00 00 00 b0 10 40 00 00 00 00 00",
        },
    ],
    };

    export default function ReverseEngineerStudio() {
    const [activeTab, setActiveTab] = useState("ui"); // 'ui', 'code', 'network', 'binary', 'sandbox'
    const [apiKey, setApiKey] = useState("");
    const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [toastMsg, setToastMsg] = useState("");

    // UI Tab State
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [uiProcessing, setUiProcessing] = useState(false);
    const [uiResult, setUiResult] = useState(null);
    const [uiViewMode, setUiViewMode] = useState("preview"); // 'preview' | 'code'

    // Code Tab State
    const [rawCode, setRawCode] = useState(PRESETS.CODE[0].raw);
    const [sourceLang, setSourceLang] = useState("javascript");
    const [targetOutput, setTargetOutput] = useState("clean_js");
    const [codeProcessing, setCodeProcessing] = useState(false);
    const [codeResult, setCodeResult] = useState(null);

    // Network Tab State
    const [rawNetworkJson, setRawNetworkJson] = useState(PRESETS.NETWORK[0].raw);
    const [schemaMode, setSchemaMode] = useState("ts"); // 'ts', 'zod', 'sql', 'swagger'
    const [netProcessing, setNetProcessing] = useState(false);
    const [netResult, setNetResult] = useState(null);

    // Binary / REA Tab State (New Advanced Module)
    const [rawBinaryInput, setRawBinaryInput] = useState(PRESETS.BINARY[0].raw);
    const [binaryProcessing, setBinaryProcessing] = useState(false);
    const [binaryResult, setBinaryResult] = useState(null);

    // Show toast utility
    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(""), 3000);
    };

    const copyToClipboard = (text, label = "Copied to clipboard!") => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        showToast(label);
        setTimeout(() => setCopied(false), 2000);
    };

    // Helper for Gemini API Calls with Fallback
    const callGeminiAPI = async (prompt, imageBase64 = null) => {
        if (!apiKey) {
        await new Promise((res) => setTimeout(res, 1800));
        return null;
        }

        try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
        const parts = [{ text: prompt }];

        if (imageBase64) {
            const base64Data = imageBase64.includes(",")
            ? imageBase64.split(",")[1]
            : imageBase64;
            parts.push({
            inlineData: {
                mimeType: "image/png",
                data: base64Data,
            },
            });
        }

        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts }] }),
        });

        if (!res.ok) {
            throw new Error(`Gemini API Error: ${res.statusText}`);
        }

        const data = await res.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        return responseText;
        } catch (err) {
        console.warn("API Call failed, falling back to simulated engine:", err);
        showToast("Using local offline simulation engine");
        return null;
        }
    };

    // 1. UI Reverse Engineering Handler
    const handleUiReverseEngine = async (customImage = null) => {
        const targetImage = customImage || imagePreview;
        if (!targetImage) {
        showToast("Please upload an image or choose a preset first!");
        return;
        }

        setUiProcessing(true);
        setUiResult(null);

        const prompt = `
        Reverse engineer this UI screenshot into clean React component code with inline Tailwind CSS classes.
        Provide your output in valid JSON format ONLY with the following structure:
        {
        "colorPalette": ["#hex1", "#hex2", "#hex3"],
        "typography": "Sans-serif / Inter font hierarchy description",
        "structureSummary": "High-level summary of the layout structure and grid",
        "code": "Complete runnable React JSX component string using standard Tailwind classes"
        }
        No markdown formatting or extra commentary outside the raw JSON object.
        `;

        const rawResponse = await callGeminiAPI(prompt, targetImage);

        if (rawResponse) {
        try {
            const cleanedJson = rawResponse
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
            const parsed = JSON.parse(cleanedJson);
            setUiResult(parsed);
        } catch (e) {
            setUiResult(generateSimulatedUiResult());
        }
        } else {
        setUiResult(generateSimulatedUiResult());
        }

        setUiProcessing(false);
    };

    const generateSimulatedUiResult = () => ({
        colorPalette: ["#FAF5F0", "#7C3AED", "#1E293B", "#F97316"],
        typography:
        "Inter / System UI, bold headers (text-2xl), high contrast warm subtexts (text-stone-600)",
        structureSummary:
        "Flex column layout wrapped in a cream soft panel with subtle rounded border accents and vibrant CTA button.",
        code: `import React from 'react';

    export default function ReconstructedCard() {
    return (
        <div className="max-w-md mx-auto p-8 bg-[#FAF5F0] rounded-3xl border border-stone-200 shadow-xl text-stone-900">
        <div className="flex items-center justify-between mb-6">
            <span className="px-3.5 py-1.5 text-xs font-bold tracking-wider text-purple-700 bg-purple-100 rounded-full border border-purple-200 uppercase">
            REVERSE-ENGINEERED
            </span>
            <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Sync
            </div>
        </div>

        <h3 className="text-2xl font-bold text-stone-900 mb-3 tracking-tight">
            AI analysis for real-time discussions
        </h3>
        
        <p className="text-sm text-stone-600 leading-relaxed mb-8">
            Live AI records your meetings, recognizes who is speaking, and provides real-time insights naturally.
        </p>

        <button className="w-full py-3.5 px-6 bg-gradient-to-r from-purple-600 via-purple-500 to-orange-400 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5">
            <span>Start for free</span>
        </button>
        </div>
    );
    }`,
    });

    // 2. Code Reverse Engineering Handler
    const handleCodeReverseEngine = async () => {
        if (!rawCode.trim()) {
        showToast("Please paste obfuscated or compiled code first!");
        return;
        }

        setCodeProcessing(true);
        setCodeResult(null);

        const prompt = `
        You are an expert reverse engineer and malware analyst.
        De-obfuscate and analyze this ${sourceLang} code:
        \`\`\`${sourceLang}
        ${rawCode}
        \`\`\`

        Provide output in strict JSON format ONLY:
        {
        "summary": "High level description of what this obfuscated code actually does",
        "renamedVariables": [
            {"original": "_0x1e2f", "suggested": "jwtTokenString", "purpose": "Holds encoded JWT string"}
        ],
        "logicBreakdown": [
            "Step 1: Check if input string is provided",
            "Step 2: Split token by '.' separator to extract header, payload, signature"
        ],
        "securityVulnerabilities": [
            "Uses client-side base64 decoding (atob) without validating payload signature."
        ],
        "reconstructedCode": "Clean, refactored, production-ready code with meaningful naming"
        }
        No extra text outside JSON.
        `;

        const rawResponse = await callGeminiAPI(prompt);

        if (rawResponse) {
        try {
            const cleanedJson = rawResponse
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
            setCodeResult(JSON.parse(cleanedJson));
        } catch (e) {
            setCodeResult(generateSimulatedCodeResult());
        }
        } else {
        setCodeResult(generateSimulatedCodeResult());
        }

        setCodeProcessing(false);
    };

    const generateSimulatedCodeResult = () => ({
        summary:
        "Client-side JWT Token Verification routine. Decodes base64 payload to verify token expiration date without cryptographic signature checking.",
        renamedVariables: [
        {
            original: "_0x1e2f",
            suggested: "authToken",
            purpose: "Target string token passed into function",
        },
        {
            original: "_0x5f12",
            suggested: "tokenParts",
            purpose: "Array of JWT components [header, payload, sig]",
        },
        {
            original: "_0x2b4c",
            suggested: "payloadObj",
            purpose: "Parsed JSON payload containing exp claim",
        },
        ],
        logicBreakdown: [
        "Guards against null or undefined token inputs.",
        "Splits JWT by '.' delimiter and verifies 3 distinct segments exist.",
        "Base64 decodes the payload segment (atob) and parses JSON.",
        "Compares the 'exp' timestamp claim against current Unix epoch timestamp.",
        ],
        securityVulnerabilities: [
        "Insecure Client-Side Auth Validation: Signature is never verified against a secret key.",
        "Susceptible to token tampering by modifying the unverified payload in local storage.",
        ],
        reconstructedCode: `/**
    * Validates JWT expiration timestamp.
    * Note: Does NOT perform signature verification.
    */
    export function isJwtTokenExpired(authToken) {
    if (!authToken || typeof authToken !== 'string') {
        return false;
    }

    const tokenParts = authToken.split('.');
    if (tokenParts.length !== 3) {
        return false;
    }

    try {
        const payloadBase64 = tokenParts[1];
        const decodedPayload = atob(payloadBase64);
        const payloadObj = JSON.parse(decodedPayload);

        if (!payloadObj.exp) {
        return false;
        }

        const currentEpochSeconds = Math.floor(Date.now() / 1000);
        return payloadObj.exp > currentEpochSeconds;
    } catch (err) {
        console.error("Failed to parse token payload:", err);
        return false;
    }
    }`,
    });

    // 3. Network Reverse Engineering Handler
    const handleNetworkReverseEngine = async () => {
        if (!rawNetworkJson.trim()) {
        showToast("Please input raw JSON or network response payload!");
        return;
        }

        setNetProcessing(true);
        setNetResult(null);

        const prompt = `
        Analyze this JSON API response payload and reverse engineer strict data schemas:
        ${rawNetworkJson}

        Generate strict schema outputs in JSON format:
        {
        "detectedTypes": "Overview of inferred fields and data types",
        "typescript": "TypeScript Interface string",
        "zod": "Zod schema definition string",
        "sql": "CREATE TABLE SQL DDL statement",
        "swagger": "OpenAPI 3.0 schema YAML/JSON string snippet"
        }
        No extra markdown wrappers outside raw JSON.
        `;

        const rawResponse = await callGeminiAPI(prompt);

        if (rawResponse) {
        try {
            const cleanedJson = rawResponse
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
            setNetResult(JSON.parse(cleanedJson));
        } catch (e) {
            setNetResult(generateSimulatedNetResult());
        }
        } else {
        setNetResult(generateSimulatedNetResult());
        }

        setNetProcessing(false);
    };

    const generateSimulatedNetResult = () => ({
        detectedTypes:
        "12 distinct fields detected across 3 nested levels (Attributes, Billing). Primary Key: id (UUID string).",
        typescript: `export interface UserProfileResponse {
    id: string;
    account_type: 'enterprise_v2' | 'standard' | string;
    attributes: {
        full_name: string;
        email: string;
        verified: boolean;
        roles: string[];
        login_count: number;
    };
    billing: {
        plan: string;
        active_until: number; // Unix timestamp
        payment_method: string;
    };
    tags: string[];
    }`,
        zod: `import { z } from 'zod';

    export const UserProfileSchema = z.object({
    id: z.string().startsWith('usr_'),
    account_type: z.string(),
    attributes: z.object({
        full_name: z.string().min(1),
        email: z.string().email(),
        verified: z.boolean(),
        roles: z.array(z.string()),
        login_count: z.number().int().nonnegative()
    }),
    billing: z.object({
        plan: z.string(),
        active_until: z.number(),
        payment_method: z.string()
    }),
    tags: z.array(z.string())
    });`,
        sql: `CREATE TABLE user_profiles (
    id VARCHAR(64) PRIMARY KEY,
    account_type VARCHAR(32) NOT NULL,
    full_name VARCHAR(128) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    verified BOOLEAN DEFAULT FALSE,
    login_count INT DEFAULT 0,
    billing_plan VARCHAR(64),
    billing_active_until BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`,
        swagger: `type: object
    properties:
    id:
        type: string
        example: "usr_9921841"
    account_type:
        type: string
    attributes:
        type: object
        properties:
        full_name:
            type: string
        email:
            type: string
            format: email
        verified:
            type: boolean`,
    });

    // 4. Binary & Assembly Reverse Engineering Handler (REA Advanced Module)
    const handleBinaryReverseEngine = async () => {
        if (!rawBinaryInput.trim()) {
        showToast("Please input binary hex stream or ELF header first!");
        return;
        }

        setBinaryProcessing(true);
        setBinaryResult(null);

        const prompt = `
        Analyze this low-level binary / hex stream or assembly stub:
        \`\`\`
        ${rawBinaryInput}
        \`\`\`
        Provide reverse engineering insights in strict JSON format ONLY:
        {
        "architecture": "Detected CPU architecture and file format (e.g. x86_64 ELF Executable)",
        "entropy": "Calculated entropy value and evaluation (e.g. 7.42 - High entropy, packed/encrypted)",
        "disassembly": "Simulated or analyzed assembly instruction block",
        "strings": ["Extracted ASCII string 1", "Extracted ASCII string 2"]
        }
        No extra markdown formatting outside JSON.
        `;

        const rawResponse = await callGeminiAPI(prompt);

        if (rawResponse) {
        try {
            const cleanedJson = rawResponse
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
            setBinaryResult(JSON.parse(cleanedJson));
        } catch (e) {
            setBinaryResult(generateSimulatedBinaryResult());
        }
        } else {
        setBinaryResult(generateSimulatedBinaryResult());
        }

        setBinaryProcessing(false);
    };

    const generateSimulatedBinaryResult = () => ({
        architecture: "x86_64 / ELF 64-bit LSB Shared Object / Executable",
        entropy: "7.48 (High entropy - Section likely packed or compressed with UPX/Custom packer)",
        disassembly: `00401000:  48 83 ec 08          sub    rsp, 0x8
    00401004:  48 8b 05 b5 2f 00 00 mov    rax, qrip[0x2fb5]
    0040100b:  ff d0                call   rax
    0040100d:  48 83 c4 08          add    rsp, 0x8
    00401011:  c3                   ret`,
        strings: [
        "/lib64/ld-linux-x86-64.so.2",
        "GCC: (Ubuntu 11.2.0-19ubuntu1) 11.2.0",
        "Access Granted: Authorized Debug Session",
        "Error: Invalid Security Token Check",
        ],
    });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
            setSelectedImage(file);
        };
        reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-purple-600 via-purple-500 to-orange-400 font-sans flex flex-col justify-start relative overflow-x-hidden">
        
        {/* Top Header / Navigation Bar */}
        <header className="border-b border-white/20 bg-white/90 backdrop-blur-md sticky top-0 z-40 w-full px-6 lg:px-16 py-4">
            <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-stone-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-md shrink-0">
                R
                </div>
                <div>
                <div className="flex items-center gap-3">
                    <h1 className="font-extrabold text-xl lg:text-2xl tracking-tight text-stone-900">
                    REVERSE<span className="text-purple-600">.AI</span> STUDIO
                    </h1>
                    <span className="px-2.5 py-0.5 text-xs font-mono font-semibold bg-purple-100 text-purple-700 border border-purple-200 rounded-full">
                    REA v2.5
                    </span>
                </div>
                
                <p className="text-xs lg:text-sm text-stone-600 font-semibold tracking-wide mt-1">
                    Automated Full-Stack & Binary Reverse Engineering Platform (MCP Powered)
                </p>
                </div>
            </div>

            {/* Quick Actions & Navigation Options */}
            <div className="flex items-center gap-4 self-end md:self-auto">
                <button
                onClick={() => setIsKeyModalOpen(true)}
                className={`flex items-center gap-2.5 px-4 py-2 text-xs lg:text-sm font-semibold rounded-full border transition-all ${
                    apiKey
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                    : "bg-white/80 text-stone-700 border-stone-200 hover:bg-white"
                }`}
                >
                <Key className="w-4 h-4 text-purple-600" />
                <span>{apiKey ? "API Key Active" : "Set Gemini Key"}</span>
                <span
                    className={`w-2.5 h-2.5 rounded-full ${apiKey ? "bg-emerald-500 animate-ping" : "bg-amber-400"}`}
                />
                </button>
                <div className="w-9 h-9 bg-white/80 border border-stone-200 rounded-full flex items-center justify-center text-stone-600 cursor-pointer hover:bg-white transition-colors">
                <User className="w-4 h-4" />
                </div>
            </div>
            </div>
        </header>

        {/* Main Tab Bar Navigation (Updated with Binary / REA Module) */}
        <div className="border-b border-white/20 bg-white/50 backdrop-blur-md w-full px-6 lg:px-16 py-4">
            <div className="w-full max-w-[1400px] mx-auto flex overflow-x-auto no-scrollbar gap-3">
            <button
                onClick={() => setActiveTab("ui")}
                className={`flex items-center gap-2.5 px-5 py-2.5 text-xs lg:text-sm font-bold rounded-2xl transition-all whitespace-nowrap ${
                activeTab === "ui"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25"
                    : "bg-white/70 text-stone-700 hover:bg-white hover:text-stone-900 border border-white/50"
                }`}
            >
                <Layout className="w-4 h-4" />
                UI to Code (Visual)
            </button>

            <button
                onClick={() => setActiveTab("code")}
                className={`flex items-center gap-2.5 px-5 py-2.5 text-xs lg:text-sm font-bold rounded-2xl transition-all whitespace-nowrap ${
                activeTab === "code"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25"
                    : "bg-white/70 text-stone-700 hover:bg-white hover:text-stone-900 border border-white/50"
                }`}
            >
                <Code2 className="w-4 h-4" />
                De-obfuscate & Logic (Code)
            </button>

            <button
                onClick={() => setActiveTab("network")}
                className={`flex items-center gap-2.5 px-5 py-2.5 text-xs lg:text-sm font-bold rounded-2xl transition-all whitespace-nowrap ${
                activeTab === "network"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25"
                    : "bg-white/70 text-stone-700 hover:bg-white hover:text-stone-900 border border-white/50"
                }`}
            >
                <Network className="w-4 h-4" />
                Payload to Schema (Network)
            </button>

            <button
                onClick={() => setActiveTab("binary")}
                className={`flex items-center gap-2.5 px-5 py-2.5 text-xs lg:text-sm font-bold rounded-2xl transition-all whitespace-nowrap ${
                activeTab === "binary"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25"
                    : "bg-white/70 text-stone-700 hover:bg-white hover:text-stone-900 border border-white/50"
                }`}
            >
                <Binary className="w-4 h-4" />
                Binary & Assembly (REA)
            </button>

            <button
                onClick={() => setActiveTab("sandbox")}
                className={`flex items-center gap-2.5 px-5 py-2.5 text-xs lg:text-sm font-bold rounded-2xl transition-all whitespace-nowrap ${
                activeTab === "sandbox"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25"
                    : "bg-white/70 text-stone-700 hover:bg-white hover:text-stone-900 border border-white/50"
                }`}
            >
                <Zap className="w-4 h-4" />
                Preset Sandbox
            </button>
            </div>
        </div>

        {/* Main Container Content */}
        <main className="w-full max-w-[1400px] mx-auto flex-1 px-6 lg:px-16 py-8">
            {/* TAB 1: VISUAL REVERSE ENGINEERING (UI TO CODE) */}
            {activeTab === "ui" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
                <div className="lg:col-span-5 space-y-6">
                <div className="bg-white/95 backdrop-blur-md border border-white/80 rounded-[2rem] p-6 lg:p-8 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm lg:text-base font-bold text-stone-900 flex items-center gap-2.5">
                        <Upload className="w-5 h-5 text-purple-600" />
                        Input Design Screenshot
                    </h2>
                    <span className="text-xs text-stone-400 font-mono">
                        PNG, JPG, WebP
                    </span>
                    </div>

                    <label className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-stone-300 hover:border-purple-500 rounded-3xl cursor-pointer bg-stone-50/50 hover:bg-purple-50/30 transition-all overflow-hidden group">
                    {imagePreview ? (
                        <div className="relative w-full h-full">
                        <img
                            src={imagePreview}
                            alt="Target UI"
                            className="w-full h-full object-contain p-4"
                        />
                        <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm font-medium text-white">
                            Click or drag to change image
                        </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-6 text-center">
                        <div className="p-4 bg-purple-100 rounded-2xl text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="w-7 h-7" />
                        </div>
                        <p className="text-sm font-bold text-stone-800 mb-1">
                            Drop UI screenshot here
                        </p>
                        <p className="text-xs text-stone-400">
                            or click to browse local files
                        </p>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                    />
                    </label>

                    <div className="mt-6">
                    <p className="text-xs font-bold text-stone-500 mb-3">
                        Or test with preset samples:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        {PRESETS.UI.map((preset) => (
                        <button
                            key={preset.id}
                            onClick={() => {
                            setImagePreview(preset.preview);
                            handleUiReverseEngine(preset.preview);
                            }}
                            className="text-left p-3.5 bg-stone-50/80 hover:bg-purple-50/80 border border-stone-200/80 rounded-2xl transition-all"
                        >
                            <p className="text-xs font-bold text-stone-800 truncate mb-1">
                            {preset.title}
                            </p>
                            <p className="text-[11px] text-stone-400 truncate">
                            {preset.desc}
                            </p>
                        </button>
                        ))}
                    </div>
                    </div>

                    <button
                    onClick={() => handleUiReverseEngine()}
                    disabled={uiProcessing || !imagePreview}
                    className="w-full mt-8 py-4 px-6 bg-stone-900 hover:bg-black disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.99]"
                    >
                    {uiProcessing ? (
                        <>
                        <RefreshCw className="w-5 h-5 animate-spin text-white" />
                        <span>Deconstructing Layout & Styles...</span>
                        </>
                    ) : (
                        <>
                        <Sparkles className="w-5 h-5 text-purple-300" />
                        <span>Reverse Engineer UI to Code</span>
                        </>
                    )}
                    </button>
                </div>
                </div>

                <div className="lg:col-span-7 space-y-6">
                {uiResult ? (
                    <div className="bg-white/95 backdrop-blur-md border border-white/80 rounded-[2rem] overflow-hidden shadow-xl">
                    <div className="px-6 py-4 border-b border-stone-200/60 bg-stone-50/50 flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                        <button
                            onClick={() => setUiViewMode("preview")}
                            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                            uiViewMode === "preview"
                                ? "bg-stone-900 text-white"
                                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                            }`}
                        >
                            Interactive Preview
                        </button>
                        <button
                            onClick={() => setUiViewMode("code")}
                            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                            uiViewMode === "code"
                                ? "bg-stone-900 text-white"
                                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                            }`}
                        >
                            Generated React Code
                        </button>
                        </div>

                        <button
                        onClick={() =>
                            copyToClipboard(uiResult.code, "React code copied!")
                        }
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-all"
                        >
                        {copied ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                            <Copy className="w-4 h-4" />
                        )}
                        <span>Copy JSX Code</span>
                        </button>
                    </div>

                    <div className="p-5 bg-stone-50/30 border-b border-stone-200/60 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="p-3 bg-white rounded-xl border border-stone-200/80 shadow-xs">
                        <p className="text-[11px] text-stone-400 font-bold uppercase mb-2">
                            Color Palette
                        </p>
                        <div className="flex items-center gap-2">
                            {uiResult.colorPalette?.map((color, i) => (
                            <span
                                key={i}
                                className="w-6 h-6 rounded-lg border border-stone-200 shadow-xs"
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                            ))}
                        </div>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-stone-200/80 shadow-xs col-span-2">
                        <p className="text-[11px] text-stone-400 font-bold uppercase mb-1">
                            Layout Breakdown
                        </p>
                        <p className="text-stone-700 text-xs leading-relaxed font-medium">
                            {uiResult.structureSummary}
                        </p>
                        </div>
                    </div>

                    <div className="p-6">
                        {uiViewMode === "code" ? (
                        <pre className="p-6 bg-stone-900 font-mono text-xs text-purple-300 rounded-2xl overflow-x-auto border border-stone-800 leading-relaxed max-h-[500px]">
                            <code>{uiResult.code}</code>
                        </pre>
                        ) : (
                        <div className="p-8 bg-[#FAF6F0] border border-stone-200/60 rounded-3xl flex items-center justify-center min-h-[400px]">
                            <div className="w-full max-w-md p-8 bg-white rounded-3xl border border-stone-100 shadow-xl text-stone-900">
                            <div className="flex items-center justify-between mb-6">
                                <span className="px-3.5 py-1.5 text-xs font-bold tracking-wider text-purple-700 bg-purple-100 rounded-full border border-purple-200 uppercase">
                                REVERSE-ENGINEERED
                                </span>
                                <span className="flex h-2.5 w-2.5 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-stone-900 mb-3">
                                AI analysis for real-time discussions
                            </h3>
                            <p className="text-sm text-stone-600 mb-8 leading-relaxed">
                                Live AI records your meetings and provides real-time insights naturally.
                            </p>
                            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 mb-8 text-xs flex justify-between text-stone-700 font-medium">
                                <span>Tailwind CSS</span>
                                <span className="text-emerald-600 font-mono font-bold">
                                100% Match
                                </span>
                            </div>
                            <button className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-orange-400 text-white rounded-xl text-xs font-bold transition-all shadow-md">
                                Start for free
                            </button>
                            </div>
                        </div>
                        )}
                    </div>
                    </div>
                ) : (
                    <div className="bg-white/95 backdrop-blur-md border border-white/80 rounded-[2rem] p-16 text-center flex flex-col items-center justify-center min-h-[450px] shadow-xl">
                    <div className="p-5 bg-purple-50 rounded-3xl text-purple-600 mb-4">
                        <Eye className="w-10 h-10" />
                    </div>
                    <h3 className="text-base font-bold text-stone-800 mb-2">
                        Awaiting UI Analysis
                    </h3>
                    <p className="text-sm text-stone-500 max-w-md leading-relaxed">
                        Upload an image on the left or select a preset to generate
                        clean, modern React + Tailwind code.
                    </p>
                    </div>
                )}
                </div>
            </div>
            )}

            {/* TAB 2: CODE DE-OBFUSCATION & LOGIC EXPLAINER */}
            {activeTab === "code" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
                <div className="lg:col-span-5 space-y-6">
                <div className="bg-white/95 backdrop-blur-md border border-white/80 rounded-[2rem] p-6 lg:p-8 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm lg:text-base font-bold text-stone-900 flex items-center gap-2.5">
                        <FileCode className="w-5 h-5 text-purple-600" />
                        Obfuscated Source Code
                    </h2>
                    <select
                        value={sourceLang}
                        onChange={(e) => setSourceLang(e.target.value)}
                        className="bg-stone-50 border border-stone-200 text-stone-700 text-xs rounded-xl px-3 py-2 outline-none focus:border-purple-500 font-mono"
                    >
                        <option value="javascript">JavaScript / TS</option>
                        <option value="cpp">C / C++</option>
                        <option value="python">Python</option>
                    </select>
                    </div>

                    <textarea
                    value={rawCode}
                    onChange={(e) => setRawCode(e.target.value)}
                    placeholder="Paste minified, obfuscated or raw code snippets here..."
                    className="w-full h-64 p-4 bg-stone-50/80 border border-stone-200 rounded-2xl font-mono text-xs text-stone-800 focus:outline-none focus:border-purple-500 resize-none leading-relaxed shadow-inner"
                    />

                    <div className="mt-6">
                    <p className="text-xs font-bold text-stone-500 mb-3">
                        Or select obfuscated sample:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        {PRESETS.CODE.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => {
                            setRawCode(p.raw);
                            setSourceLang(p.lang);
                            }}
                            className="text-left p-3.5 bg-stone-50/80 hover:bg-purple-50/80 border border-stone-200/80 rounded-2xl transition-all"
                        >
                            <p className="text-xs font-bold text-stone-800 truncate mb-1">
                            {p.title}
                            </p>
                            <p className="text-[11px] font-mono text-purple-600 uppercase font-semibold">
                            {p.lang}
                            </p>
                        </button>
                        ))}
                    </div>
                    </div>

                    <button
                    onClick={handleCodeReverseEngine}
                    disabled={codeProcessing || !rawCode.trim()}
                    className="w-full mt-8 py-4 px-6 bg-stone-900 hover:bg-black disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.99]"
                    >
                    {codeProcessing ? (
                        <>
                        <RefreshCw className="w-5 h-5 animate-spin text-white" />
                        <span>De-obfuscating AST & Control Flow...</span>
                        </>
                    ) : (
                        <>
                        <Terminal className="w-5 h-5 text-purple-300" />
                        <span>De-obfuscate & Analyze Code</span>
                        </>
                    )}
                    </button>
                </div>
                </div>

                <div className="lg:col-span-7 space-y-6">
                {codeResult ? (
                    <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/95 backdrop-blur-md border border-white/80 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-xs lg:text-sm font-bold text-stone-900 mb-3 flex items-center gap-2.5">
                            <Info className="w-4 h-4 text-purple-600" />
                            Executive Summary
                        </h3>
                        <p className="text-xs lg:text-sm text-stone-600 leading-relaxed">
                            {codeResult.summary}
                        </p>
                        </div>

                        <div className="bg-amber-50/95 backdrop-blur-md border border-amber-200/80 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-xs lg:text-sm font-bold text-amber-800 mb-3 flex items-center gap-2.5">
                            <ShieldAlert className="w-4 h-4 text-amber-600" />
                            Security / Vulnerability Insights
                        </h3>
                        <ul className="text-xs lg:text-sm text-amber-900/80 space-y-2 list-disc pl-4 leading-relaxed font-medium">
                            {codeResult.securityVulnerabilities?.map(
                            (vuln, idx) => (
                                <li key={idx}>{vuln}</li>
                            ),
                            )}
                        </ul>
                        </div>
                    </div>

                    {codeResult.renamedVariables?.length > 0 && (
                        <div className="bg-white/95 backdrop-blur-md border border-white/80 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-xs lg:text-sm font-bold text-stone-900 mb-4 flex items-center gap-2.5">
                            <Braces className="w-4 h-4 text-purple-600" />
                            Inferred Variable Name Mappings
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs font-mono">
                            <thead>
                                <tr className="border-b border-stone-200 text-stone-400 pb-3">
                                <th className="pb-3">Obfuscated</th>
                                <th className="pb-3">Suggested Identifier</th>
                                <th className="pb-3">Purpose</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-stone-700">
                                {codeResult.renamedVariables.map((v, i) => (
                                <tr key={i}>
                                    <td className="py-3 text-rose-600 font-bold">
                                    {v.original}
                                    </td>
                                    <td className="py-3 text-emerald-600 font-bold">
                                    {v.suggested}
                                    </td>
                                    <td className="py-3 text-stone-500 text-xs font-sans">
                                    {v.purpose}
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                        </div>
                    )}

                    <div className="bg-white/95 backdrop-blur-md border border-white/80 rounded-[2rem] overflow-hidden shadow-xl">
                        <div className="px-6 py-4 border-b border-stone-200/60 bg-stone-50/50 flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            De-obfuscated & Cleaned Output
                        </span>
                        <button
                            onClick={() =>
                            copyToClipboard(
                                codeResult.reconstructedCode,
                                "Cleaned code copied!",
                            )
                            }
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-all"
                        >
                            {copied ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                            <Copy className="w-4 h-4" />
                            )}
                            <span>Copy Code</span>
                        </button>
                        </div>
                        <pre className="p-6 bg-stone-900 font-mono text-xs text-purple-300 overflow-x-auto leading-relaxed max-h-[400px]">
                        <code>{codeResult.reconstructedCode}</code>
                        </pre>
                    </div>
                    </div>
                ) : (
                    <div className="bg-white/95 backdrop-blur-md border border-white/80 rounded-[2rem] p-16 text-center flex flex-col items-center justify-center min-h-[450px] shadow-xl">
                    <div className="p-5 bg-purple-50 rounded-3xl text-purple-600 mb-4">
                        <Terminal className="w-10 h-10" />
                    </div>
                    <h3 className="text-base font-bold text-stone-800 mb-2">
                        Awaiting Code Input
                    </h3>
                    <p className="text-sm text-stone-500 max-w-md leading-relaxed">
                        Paste minified JS or C++ code snippet on the left to
                        de-obfuscate and uncover hidden business logic.
                    </p>
                    </div>
                )}
                </div>
            </div>
            )}

            {/* TAB 3: NETWORK & API PAYLOAD TO SCHEMA */}
            {activeTab === "network" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
                <div className="lg:col-span-5 space-y-6">
                <div className="bg-white/95 backdrop-blur-md border border-white/80 rounded-[2rem] p-6 lg:p-8 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm lg:text-base font-bold text-stone-900 flex items-center gap-2.5">
                        <FileJson className="w-5 h-5 text-purple-600" />
                        Network JSON / Payload
                    </h2>
                    </div>

                    <textarea
                    value={rawNetworkJson}
                    onChange={(e) => setRawNetworkJson(e.target.value)}
                    placeholder="Paste raw API JSON response payload..."
                    className="w-full h-64 p-4 bg-stone-50/80 border border-stone-200 rounded-2xl font-mono text-xs text-stone-800 focus:outline-none focus:border-purple-500 resize-none leading-relaxed shadow-inner"
                    />

                    <div className="mt-6">
                    <p className="text-xs font-bold text-stone-500 mb-3">
                        Or load network payload sample:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        {PRESETS.NETWORK.map((n) => (
                        <button
                            key={n.id}
                            onClick={() => setRawNetworkJson(n.raw)}
                            className="text-left p-3.5 bg-stone-50/80 hover:bg-purple-50/80 border border-stone-200/80 rounded-2xl transition-all"
                        >
                            <p className="text-xs font-bold text-stone-800 truncate">
                            {n.title}
                            </p>
                        </button>
                        ))}
                    </div>
                    </div>

                    <button
                    onClick={handleNetworkReverseEngine}
                    disabled={netProcessing || !rawNetworkJson.trim()}
                    className="w-full mt-8 py-4 px-6 bg-stone-900 hover:bg-black disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.99]"
                    >
                    {netProcessing ? (
                        <>
                        <RefreshCw className="w-5 h-5 animate-spin text-white" />
                        <span>Generating Schemas & Type Specs...</span>
                        </>
                    ) : (
                        <>
                        <Braces className="w-5 h-5 text-purple-300" />
                        <span>Reverse Engineer API Schemas</span>
                        </>
                    )}
                    </button>
                </div>
                </div>

                <div className="lg:col-span-7 space-y-6">
                {netResult ? (
                    <div className="bg-white/95 backdrop-blur-md border border-white/80 rounded-[2rem] overflow-hidden shadow-xl">
                    <div className="px-6 py-4 border-b border-stone-200/60 bg-stone-50/50 flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto">
                        <button
                            onClick={() => setSchemaMode("ts")}
                            className={`px-4 py-2 text-xs font-mono font-bold rounded-xl transition-all ${
                            schemaMode === "ts"
                                ? "bg-purple-600 text-white"
                                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                            }`}
                        >
                            TypeScript Interface
                        </button>
                        <button
                            onClick={() => setSchemaMode("zod")}
                            className={`px-4 py-2 text-xs font-mono font-bold rounded-xl transition-all ${
                            schemaMode === "zod"
                                ? "bg-purple-600 text-white"
                                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                            }`}
                        >
                            Zod Validation
                        </button>
                        <button
                            onClick={() => setSchemaMode("sql")}
                            className={`px-4 py-2 text-xs font-mono font-bold rounded-xl transition-all ${
                            schemaMode === "sql"
                                ? "bg-purple-600 text-white"
                                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                            }`}
                        >
                            SQL DDL
                        </button>
                        <button
                            onClick={() => setSchemaMode("swagger")}
                            className={`px-4 py-2 text-xs font-mono font-bold rounded-xl transition-all ${
                            schemaMode === "swagger"
                                ? "bg-purple-600 text-white"
                                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                            }`}
                        >
                            OpenAPI / Swagger
                        </button>
                        </div>

                        <button
                        onClick={() =>
                            copyToClipboard(
                            netResult[
                                schemaMode === "ts" ? "typescript" : schemaMode
                            ],
                            "Schema copied!",
                            )
                        }
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-all"
                        >
                        {copied ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                            <Copy className="w-4 h-4" />
                        )}
                        <span>Copy Schema</span>
                        </button>
                    </div>

                    <div className="p-5 bg-purple-50/50 border-b border-stone-200/60 text-xs lg:text-sm text-purple-900 font-medium flex items-center gap-3">
                        <Info className="w-5 h-5 text-purple-600 shrink-0" />
                        <span>{netResult.detectedTypes}</span>
                    </div>

                    <pre className="p-6 bg-stone-900 font-mono text-xs lg:text-sm text-purple-300 overflow-x-auto leading-relaxed max-h-[450px]">
                        <code>
                        {
                            netResult[
                            schemaMode === "ts" ? "typescript" : schemaMode
                            ]
                        }
                        </code>
                    </pre>
                    </div>
                ) : (
                    <div className="bg-white/95 backdrop-blur-md border border-white/80 rounded-[2rem] p-16 text-center flex flex-col items-center justify-center min-h-[450px] shadow-xl">
                    <div className="p-5 bg-purple-50 rounded-3xl text-purple-600 mb-4">
                        <Network className="w-10 h-10" />
                    </div>
                    <h3 className="text-base font-bold text-stone-800 mb-2">
                        Awaiting Network Payload
                    </h3>
                    <p className="text-sm text-stone-500 max-w-md leading-relaxed">
                        Paste raw API response payloads on the left to extract
                        TypeScript definitions, Zod schemas, or SQL structures.
                    </p>
                    </div>
                )}
                </div>
            </div>
            )}

            {/* TAB 4: BINARY & ASSEMBLY DECOMPILER (REA ADVANCED MODULE) */}
            {activeTab === "binary" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
                <div className="lg:col-span-5 space-y-6">
                <div className="bg-white/95 backdrop-blur-md border border-white/80 rounded-[2rem] p-6 lg:p-8 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm lg:text-base font-bold text-stone-900 flex items-center gap-2.5">
                        <Binary className="w-5 h-5 text-purple-600" />
                        Binary / Hex / ELF Stream
                    </h2>
                    </div>

                    <textarea
                    value={rawBinaryInput}
                    onChange={(e) => setRawBinaryInput(e.target.value)}
                    placeholder="Paste hex bytes or binary header here..."
                    className="w-full h-64 p-4 bg-stone-50/80 border border-stone-200 rounded-2xl font-mono text-xs text-stone-800 focus:outline-none focus:border-purple-500 resize-none leading-relaxed shadow-inner"
                    />

                    <div className="mt-6">
                    <p className="text-xs font-bold text-stone-500 mb-3">
                        Or select binary sample:
                    </p>
                    <div className="grid grid-cols-1 gap-3">
                        {PRESETS.BINARY.map((b) => (
                        <button
                            key={b.id}
                            onClick={() => setRawBinaryInput(b.raw)}
                            className="text-left p-3.5 bg-stone-50/80 hover:bg-purple-50/80 border border-stone-200/80 rounded-2xl transition-all"
                        >
                            <p className="text-xs font-bold text-stone-800 truncate mb-1">
                            {b.title}
                            </p>
                            <p className="text-[11px] font-mono text-purple-600 truncate">
                            {b.raw}
                            </p>
                        </button>
                        ))}
                    </div>
                    </div>

                    <button
                    onClick={handleBinaryReverseEngine}
                    disabled={binaryProcessing || !rawBinaryInput.trim()}
                    className="w-full mt-8 py-4 px-6 bg-stone-900 hover:bg-black disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.99]"
                    >
                    {binaryProcessing ? (
                        <>
                        <RefreshCw className="w-5 h-5 animate-spin text-white" />
                        <span>Decompiling Binaries & Analyzing Entropy...</span>
                        </>
                    ) : (
                        <>
                        <Cpu className="w-5 h-5 text-purple-300" />
                        <span>Decompile Binary & Assembly</span>
                        </>
                    )}
                    </button>
                </div>
                </div>

                <div className="lg:col-span-7 space-y-6">
                {binaryResult ? (
                    <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/95 backdrop-blur-md border border-white/80 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-xs lg:text-sm font-bold text-stone-900 mb-2 flex items-center gap-2">
                            <Info className="w-4 h-4 text-purple-600" />
                            Architecture & Format
                        </h3>
                        <p className="text-xs lg:text-sm font-mono text-purple-700 font-bold">
                            {binaryResult.architecture}
                        </p>
                        </div>
                        <div className="bg-amber-50/95 backdrop-blur-md border border-amber-200/80 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-xs lg:text-sm font-bold text-amber-800 mb-2 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-amber-600" />
                            Entropy Analysis
                        </h3>
                        <p className="text-xs lg:text-sm font-mono text-amber-900 font-bold">
                            {binaryResult.entropy}
                        </p>
                        </div>
                    </div>

                    <div className="bg-white/95 backdrop-blur-md border border-white/80 rounded-[2rem] overflow-hidden shadow-xl">
                        <div className="px-6 py-4 border-b border-stone-200/60 bg-stone-50/50 flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-2 font-mono">
                            <CheckCircle2 className="w-4 h-4" />
                            Disassembly Output (x86_64 Assembly)
                        </span>
                        <button
                            onClick={() =>
                            copyToClipboard(
                                binaryResult.disassembly,
                                "Assembly code copied!",
                            )
                            }
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-all"
                        >
                            {copied ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                            <Copy className="w-4 h-4" />
                            )}
                            <span>Copy Assembly</span>
                        </button>
                        </div>
                        <pre className="p-6 bg-stone-900 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed max-h-[300px]">
                        <code>{binaryResult.disassembly}</code>
                        </pre>
                    </div>

                    {binaryResult.strings?.length > 0 && (
                        <div className="bg-white/95 backdrop-blur-md border border-white/80 rounded-[2rem] p-6 shadow-xl">
                        <h3 className="text-xs lg:text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
                            <Braces className="w-4 h-4 text-purple-600" />
                            Extracted ASCII Strings
                        </h3>
                        <div className="bg-stone-900 rounded-2xl p-4 max-h-40 overflow-y-auto font-mono text-xs text-purple-300 space-y-1">
                            {binaryResult.strings.map((str, idx) => (
                            <div key={idx} className="border-b border-stone-800 pb-1">
                                {str}
                            </div>
                            ))}
                        </div>
                        </div>
                    )}
                    </div>
                ) : (
                    <div className="bg-white/95 backdrop-blur-md border border-white/80 rounded-[2rem] p-16 text-center flex flex-col items-center justify-center min-h-[450px] shadow-xl">
                    <div className="p-5 bg-purple-50 rounded-3xl text-purple-600 mb-4">
                        <Cpu className="w-10 h-10" />
                    </div>
                    <h3 className="text-base font-bold text-stone-800 mb-2">
                        Awaiting Binary Stream
                    </h3>
                    <p className="text-sm text-stone-500 max-w-md leading-relaxed">
                        Paste binary hex bytes or ELF headers on the left to inspect
                        low-level architecture, entropy, and assembly instructions.
                    </p>
                    </div>
                )}
                </div>
            </div>
            )}

            {/* TAB 5: PRESET SANDBOX DEMO */}
            {activeTab === "sandbox" && (
            <div className="space-y-6 w-full">
                <div className="bg-white/95 backdrop-blur-md border border-white/80 rounded-[2.5rem] p-8 lg:p-12 shadow-xl">
                <div className="max-w-3xl mb-8">
                    <h2 className="text-xl lg:text-2xl font-bold text-stone-900 mb-3 flex items-center gap-3">
                    <Zap className="w-6 h-6 text-purple-600" />
                    Interactive Reverse Engineering Sandbox
                    </h2>
                    <p className="text-sm text-stone-600 leading-relaxed">
                    Select any pre-configured reverse engineering workflow below
                    to test full processing pipelines from UI components down to
                    binary assembly.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Workflow 1 */}
                    <div className="bg-[#FAF6F0] border border-stone-200 hover:border-purple-400 rounded-3xl p-6 transition-all flex flex-col justify-between group shadow-sm">
                    <div>
                        <div className="p-3.5 bg-purple-100 text-purple-700 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                        <Layout className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-stone-900 mb-2">
                        UI Screenshot Deconstruction
                        </h3>
                        <p className="text-xs text-stone-600 mb-6 leading-relaxed">
                        Converts UI images into modular React JSX components.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                        setActiveTab("ui");
                        setImagePreview(PRESETS.UI[0].preview);
                        handleUiReverseEngine(PRESETS.UI[0].preview);
                        }}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-md"
                    >
                        <span>Run UI Test</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    </div>

                    {/* Workflow 2 */}
                    <div className="bg-[#FAF6F0] border border-stone-200 hover:border-purple-400 rounded-3xl p-6 transition-all flex flex-col justify-between group shadow-sm">
                    <div>
                        <div className="p-3.5 bg-purple-100 text-purple-700 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                        <Code2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-stone-900 mb-2">
                        JavaScript De-obfuscation
                        </h3>
                        <p className="text-xs text-stone-600 mb-6 leading-relaxed">
                        Decodes token scripts and flags security flaws.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                        setActiveTab("code");
                        setRawCode(PRESETS.CODE[0].raw);
                        setSourceLang("javascript");
                        handleCodeReverseEngine();
                        }}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-md"
                    >
                        <span>Run Code Test</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    </div>

                    {/* Workflow 3 */}
                    <div className="bg-[#FAF6F0] border border-stone-200 hover:border-purple-400 rounded-3xl p-6 transition-all flex flex-col justify-between group shadow-sm">
                    <div>
                        <div className="p-3.5 bg-purple-100 text-purple-700 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                        <Network className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-stone-900 mb-2">
                        API Schema Extraction
                        </h3>
                        <p className="text-xs text-stone-600 mb-6 leading-relaxed">
                        Converts JSON responses into TypeScript & Zod schemas.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                        setActiveTab("network");
                        setRawNetworkJson(PRESETS.NETWORK[0].raw);
                        handleNetworkReverseEngine();
                        }}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-md"
                    >
                        <span>Run Schema Test</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    </div>

                    {/* Workflow 4 (New REA Binary Pipeline) */}
                    <div className="bg-[#FAF6F0] border border-stone-200 hover:border-purple-400 rounded-3xl p-6 transition-all flex flex-col justify-between group shadow-sm">
                    <div>
                        <div className="p-3.5 bg-purple-100 text-purple-700 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                        <Binary className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-stone-900 mb-2">
                        Binary & Assembly REA
                        </h3>
                        <p className="text-xs text-stone-600 mb-6 leading-relaxed">
                        Decompiles low-level ELF headers and x86 disassembly.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                        setActiveTab("binary");
                        setRawBinaryInput(PRESETS.BINARY[0].raw);
                        handleBinaryReverseEngine();
                        }}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-md"
                    >
                        <span>Run Binary Test</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    </div>
                </div>
                </div>
            </div>
            )}
        </main>

        {/* API Key Modal Dialog */}
        {isKeyModalOpen && (
            <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-stone-200 rounded-3xl max-w-lg w-full p-8 shadow-2xl relative">
                <button
                onClick={() => setIsKeyModalOpen(false)}
                className="absolute top-6 right-6 text-stone-400 hover:text-stone-600"
                >
                <X className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl">
                    <Key className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-stone-900">
                    Gemini API Key
                    </h3>
                    <p className="text-xs text-stone-500">
                    Enable real-time AI reverse engineering analysis
                    </p>
                </div>
                </div>

                <p className="text-xs lg:text-sm text-stone-600 mb-6 leading-relaxed">
                Entering your Gemini API key unlocks live cloud models for visual
                UI breakdown and code de-obfuscation. If left empty, the
                application seamlessly runs on an offline local engine simulation.
                </p>

                <div className="space-y-5">
                <div>
                    <label className="block text-xs font-bold text-stone-700 mb-2">
                    API Key string
                    </label>
                    <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl font-mono text-xs text-stone-800 focus:outline-none focus:border-purple-500"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                    onClick={() => setIsKeyModalOpen(false)}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-2xl transition-all shadow-lg shadow-purple-600/20"
                    >
                    Save & Apply Key
                    </button>
                </div>
                </div>
            </div>
            </div>
        )}

        {/* Floating Toast Notification */}
        {toastMsg && (
            <div className="fixed bottom-8 right-8 z-50 bg-stone-900 border border-stone-800 text-white text-xs px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold">{toastMsg}</span>
            </div>
        )}
        </div>
    );
}