
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { World, Faction, NPC, Quest, Settlement, MagicItem, ContentType, GenerationMethod, Travel, ContentItem } from '../types';
import { randInt } from './utils';

// DNA Generators
import { generateWorldDNA } from './dna/worldDna';
import { generateNpcDNA } from './dna/npcDna';
import { generateFactionDNAString } from './dna/factionDna';
import { generateQuestDNA } from './dna/questDna';
import { generateSettlementDNA } from './dna/settlementDna';
import { generateMagicItemDNA } from './dna/magicItemDna';
import { generateTravelDNA } from './dna/travelDna';

// Decoding Prompts
import { DNA_DECODING_PROMPT } from './prompts/worldPrompt';
import { QUEST_DNA_DECODING_PROMPT } from './prompts/questPrompt';
import { FACTION_DNA_DECODING_PROMPT } from './prompts/factionPrompt';
import { NPC_DNA_DECODING_PROMPT } from './prompts/npcPrompt';
import { SETTLEMENT_DNA_DECODING_PROMPT } from './prompts/settlementPrompt';
import { MAGIC_ITEM_DNA_DECODING_PROMPT } from './prompts/magicItemPrompt';
import { TRAVEL_DNA_DECODING_PROMPT } from './prompts/travelPrompt';


const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("GEMINI_API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const generateGeminiContent = async (prompt: string): Promise<string> => {
    if (!API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured. Please set the environment variable.");
    }
    try {
        console.groupCollapsed('--- GEMINI API CALL ---');
        console.log('SENDING PROMPT:', prompt);

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.8,
                topP: 0.95,
            },
        });
        
        console.log('RECEIVED RAW RESPONSE:', JSON.stringify(response, null, 2));
        const text = response.text;
        console.log('EXTRACTED .text PROPERTY:', text);
        console.groupEnd();

        if (!text || typeof text !== 'string') {
            const safetyRatings = response.candidates?.[0]?.safetyRatings;
            if (safetyRatings?.some(rating => rating.blocked)) {
                console.error("Gemini response blocked due to safety settings:", safetyRatings);
                throw new Error("The response was blocked due to safety concerns. Please adjust your prompt or retry.");
            }
            console.error("Gemini API response was empty or invalid.", response);
            throw new Error("The model returned an empty or invalid response.");
        }
        return text;
    } catch (error) {
        console.groupCollapsed('--- GEMINI API ERROR ---');
        console.error("Error calling Gemini API:", error);
        console.groupEnd();
         if (error instanceof Error) {
            throw new Error(`Failed to communicate with the Gemini API: ${error.message}`);
        }
        throw new Error("Failed to communicate with the Gemini API due to an unknown error.");
    }
};

const extractName = (text: string, patterns: RegExp[], defaultName: string): string => {
    console.groupCollapsed(`--- EXTRACT NAME (${defaultName}) ---`);
    console.log(`INPUT TYPE: ${typeof text}`);
    console.log('INPUT VALUE:', text);

    // Defensively check for non-string types first to prevent errors on the next check.
    if (typeof text !== 'string') {
        console.warn(`extractName received non-string input. Defaulting to "${defaultName}".`);
        console.groupEnd();
        return defaultName;
    }
    
    // Now that we know it's a string, we can safely check if it's falsy (empty string) or just whitespace.
    if (!text.trim()) {
        console.warn(`extractName received an empty or whitespace-only string. Defaulting to "${defaultName}".`);
        console.groupEnd();
        return defaultName;
    }

    for (const pattern of patterns) {
        // Use original text for regex that might depend on line structure
        const match = text.match(pattern);
        if (match && typeof match[1] === 'string') {
            const potentialName = match[1].trim();
            if (potentialName) {
                const finalName = potentialName.replace(/[*_]/g, '').replace(/^"|"$/g, '');
                console.log(`SUCCESS: Found name "${finalName}" with pattern: ${pattern}`);
                console.groupEnd();
                return finalName;
            }
        }
    }

    const lines = text.split('\n');
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine) {
            const cleanedLine = trimmedLine.replace(/^###?\s*|^[\d.]+\s*|[*_]/g, '').trim();
            if (cleanedLine) {
                console.log(`SUCCESS: Found name "${cleanedLine}" by line parsing.`);
                console.groupEnd();
                return cleanedLine;
            }
        }
    }
    
    console.warn(`FAILURE: extractName did not find a name. Defaulting to "${defaultName}". Raw text:`, text);
    console.groupEnd();
    return defaultName;
};

const formatDetailsForPrompt = (details: any, type: ContentType): string => {
    const lines = Object.entries(details)
        .filter(([_, value]) => value && typeof value === 'string' && value.trim() !== '')
        .map(([key, value]) => {
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
            return `  - ${label}: ${value}`;
        });

    if (lines.length === 0) {
        return '';
    }

    return `\n\n### User's Detailed Input for ${type}\n\n${lines.join('\n')}`;
};


export const generateItem = async <T extends World | NPC | Faction | Quest | Settlement | MagicItem | Travel>(
    type: ContentType,
    method: GenerationMethod,
    guidance: string,
    details: any,
    contextItem: ContentItem | null
): Promise<T> => {
    
    const contextInfo = contextItem ? `\n\nADDITIONAL CONTEXT FROM THE ITEM '${(contextItem as any).name}':\n${contextItem.profile}` : '';

    let userProvidedContext = '';
    if (method === GenerationMethod.Guided && guidance) {
        userProvidedContext = `\n\nADDITIONAL USER GUIDANCE:\n${guidance.trim()}`;
    } else if (method === GenerationMethod.Detailed) {
        userProvidedContext = formatDetailsForPrompt(details, type);
    }
    
    const combinedContext = contextInfo + userProvidedContext;

    if (type === ContentType.World) {
        const numRegions = (method === GenerationMethod.Detailed && details.numRegions) ? parseInt(details.numRegions, 10) : randInt(2, 5);
        const numFactions = randInt(2, 4);
        const dna = generateWorldDNA(numRegions, numFactions);
        
        const prompt = `${DNA_DECODING_PROMPT}\n\nWORLD DNA:\n${dna}${combinedContext}`;
        const profileText = await generateGeminiContent(prompt);

        const worldName = (method === GenerationMethod.Detailed && details.name) || extractName(
            profileText,
            [/^\s*(?:1\.)?\s*\*?World Name\**?\s*:\s*(?:\"|\*\*?)?(.*?)(?:\"|\*\*?)?\s*$/im],
            'Untitled World'
        );

        return { name: worldName, dna, profile: profileText } as T;
    }
    
    if (type === ContentType.Travel) {
        const dna = generateTravelDNA();
        const prompt = `${TRAVEL_DNA_DECODING_PROMPT}${combinedContext}\n\nTRAVEL DNA:\n${dna}`;
        const profileText = await generateGeminiContent(prompt);
        
        const travelName = (method === GenerationMethod.Detailed && details.regionName) || extractName(
            profileText,
            [/^\s*(?:1\.)?\s*\*?Scenario Title\**?\s*:\s*(?:\"|\*\*?)?(.*?)(?:\"|\*\*?)?\s*$/im],
            'Untitled Travel Scenario'
        );

        return { name: travelName, dna, profile: profileText } as T;
    }
    
    if (type === ContentType.NPC) {
        const dna = generateNpcDNA();
        const prompt = `${NPC_DNA_DECODING_PROMPT}${combinedContext}\n\nPERSONALITY DNA:\n${dna}`;
        const profileText = await generateGeminiContent(prompt);

        const npcName = (method === GenerationMethod.Detailed && details.name) || extractName(
            profileText, 
            [
                /^###\s*(?:\*\*)?([^*#\n\r]+)(?:\*\*)?\s*$/im, // Matches '### **Name**' or '### Name' on a single line
                /^###\s*\*+(.*?)\*+\s*\n\s*\*\*Role:/im, 
                /^###\s*\*{0,2}(.*?)\*{0,2}/im 
            ], 
            'Untitled NPC'
        );
        
        return { name: npcName, dna, profile: profileText } as T;
    }

    if (type === ContentType.Quest) {
        const dna = generateQuestDNA();
        const prompt = `${QUEST_DNA_DECODING_PROMPT}${combinedContext}\n\nQUEST DNA:\n${dna}`;
        const profileText = await generateGeminiContent(prompt);

        const questName = (method === GenerationMethod.Detailed && details.title) || extractName(
            profileText, 
            [/^\s*(?:1\.)?\s*\*?Quest Title\**?\s*:\s*(?:\"|\*\*?)?(.*?)(?:\"|\*\*?)?\s*$/im], 
            'Untitled Quest'
        );
        
        return { name: questName, dna, profile: profileText } as T;
    }
    
    if (type === ContentType.Faction) {
        const dna = generateFactionDNAString();
        const prompt = `${FACTION_DNA_DECODING_PROMPT}${combinedContext}\n\nFACTION DNA:\n${dna}`;
        const profileText = await generateGeminiContent(prompt);
        
        const factionName = (method === GenerationMethod.Detailed && details.name) || extractName(
            profileText,
            [
                /^\s*1\.\s*Faction Name & Symbol\s*[\r\n]+\s*\*\*Name:\*\*\s*\*(.*?)\*/i,
                /^\s*\*\*Name:\*\*\s*\*(.*?)\*/i,
                /^\s*\*\*Name:\*\*\s*(.*)/i,
                /^\s*Name:\s*(.*)/im,
                 /^\s*(?:1\.)?\s*\*?Faction Name\**?\s*:\s*(?:\"|\*\*?)?(.*?)(?:\"|\*\*?)?\s*$/im
            ],
            'Untitled Faction'
        );

        return { name: factionName, dna, profile: profileText } as T;
    }

    if (type === ContentType.Settlement) {
        const dna = generateSettlementDNA();
        const prompt = `${SETTLEMENT_DNA_DECODING_PROMPT}${combinedContext}\n\nSETTLEMENT DNA:\n${dna}`;
        const profileText = await generateGeminiContent(prompt);

        const settlementName = (method === GenerationMethod.Detailed && details.name) || extractName(
            profileText,
            [/^\s*(?:1\.)?\s*\*?Settlement Name\**?\s*:\s*(?:\"|\*\*?)?(.*?)(?:\"|\*\*?)?\s*$/im],
            'Untitled Settlement'
        );

        return { name: settlementName, dna, profile: profileText } as T;
    }

    if (type === ContentType.MagicItem) {
        const dna = generateMagicItemDNA();
        const prompt = `${MAGIC_ITEM_DNA_DECODING_PROMPT}${combinedContext}\n\nMAGIC ITEM DNA:\n${dna}`;
        const profileText = await generateGeminiContent(prompt);

        const itemName = (method === GenerationMethod.Detailed && details.name) || extractName(
            profileText,
            [/^\s*(?:1\.)?\s*\*?Item Name\**?\s*:\s*(?:\"|\*\*?)?(.*?)(?:\"|\*\*?)?\s*$/im],
            'Untitled Magic Item'
        );

        return { name: itemName, dna, profile: profileText } as T;
    }

    throw new Error(`Unsupported content type for generation: ${type}`);
};
