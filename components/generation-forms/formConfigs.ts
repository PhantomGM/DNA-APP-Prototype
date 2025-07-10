export interface FieldDescriptor {
    name: string;
    label: string;
    description?: string;
    isTextArea?: boolean;
    rows?: number;
    inputType?: string;
    fullWidth?: boolean;
}

export interface FormConfig {
    fields: FieldDescriptor[];
    useGrid?: boolean;
}

import { ContentType } from '../../types';

export const formConfigs: Record<ContentType, FormConfig> = {
    [ContentType.World]: {
        useGrid: false,
        fields: [
            { name: 'genreOrMood', label: 'Genre or Mood', description: 'E.g., Grimdark, Whimsical Mystery, Post-Apocalyptic Hope' },
            { name: 'coreTheme', label: 'Core Theme or Central Struggle', description: 'E.g., Survival against extinction, Rebellion against false gods, Rebuilding after collapse' },
            { name: 'inspirationalMedia', label: 'Inspirational Media, Vibes, or Tropes', description: 'E.g., Nausicaa + Dune, Elden Ring + Evangelion, A world where deserts whisper back', isTextArea: true, rows: 2 },
            { name: 'magicAndTechFlavor', label: 'Magic & Technology Flavor', description: 'E.g., “Tech is sacred relics,” “Magic is fading and feared,” “Everything runs on breath-powered engines”', isTextArea: true, rows: 2 },
            { name: 'geographicalInspirations', label: 'Geographical Inspirations or Must-Have Land Features', description: 'E.g., Floating mountain chains, underground oceans, shattered archipelago' },
            { name: 'culturalInfluence', label: 'Cultural, Philosophical, or Religious Influence', description: 'E.g., Stoicism and ancestor worship dominate daily life; No gods—only contracts' },
            { name: 'numRegions', label: 'Desired Number of Major Regions', description: 'If known. E.g., 3, 5', inputType: 'number' },
            { name: 'factionConflict', label: 'Faction Type, Conflict, or Historic Echo', description: 'E.g., A fallen religious empire still rules through banking; A cold war between magic schools', isTextArea: true, rows: 2 },
            { name: 'knownDetails', label: 'Known Details You’d Like Reflected', description: 'E.g., This is a sequel setting to my homebrew world; Time is fractured, but no one remembers', isTextArea: true, rows: 2 },
            { name: 'additionalNotes', label: 'Additional Notes or Story Seeds to Weave In', description: 'E.g., A god left behind a machine no one dares touch; All the birds are spies', isTextArea: true, rows: 2 },
        ],
    },
    [ContentType.NPC]: {
        useGrid: true,
        fields: [
            { name: 'name', label: 'Name' },
            { name: 'role', label: 'Role/Occupation' },
            { name: 'archetype', label: 'Archetype' },
            { name: 'race', label: 'Race/Species' },
            { name: 'age', label: 'Age' },
            { name: 'pronouns', label: 'Pronouns' },
            { name: 'quirk', label: 'Signature Behavior/Quirk' },
            { name: 'alignment', label: 'Preferred Alignment', description: 'E.g., Lawful Good, Chaotic Neutral' },
            { name: 'appearanceNotes', label: 'Appearance Notes', isTextArea: true, rows: 3, fullWidth: true },
            { name: 'backstoryNotes', label: 'Backstory Notes', isTextArea: true, rows: 3, fullWidth: true },
            { name: 'bdi', label: 'Beliefs/Desires/Intentions' },
            { name: 'secrets', label: 'Secret(s)' },
            { name: 'possessions', label: 'Notable Possessions' },
            { name: 'highTraits', label: 'High-Valued Traits', description: 'E.g., Brave, Honest' },
            { name: 'lowTraits', label: 'Low-Valued Traits', description: 'E.g., Cowardly, Deceitful' },
            { name: 'extraContext', label: 'Extra Context', isTextArea: true, rows: 3, fullWidth: true },
        ],
    },
    [ContentType.Faction]: {
        useGrid: true,
        fields: [
            { name: 'name', label: 'Faction Name' },
            { name: 'goal', label: 'Primary Goal/Motto' },
            { name: 'methods', label: 'Methods', description: 'E.g., Militaristic, Secretive, Diplomatic' },
            { name: 'style', label: 'Organization Style', description: 'E.g., Hierarchical, Decentralized' },
            { name: 'perception', label: 'Public Perception' },
            { name: 'baseOfOperations', label: 'Base of Operations' },
            { name: 'ideology', label: 'Core Beliefs/Ideology', isTextArea: true, rows: 3, fullWidth: true },
            { name: 'strengths', label: 'Key Strengths' },
            { name: 'weaknesses', label: 'Key Weaknesses' },
            { name: 'highTraits', label: 'High-Valued DNA Traits', description: 'E.g., Wealth, Secrecy, Magic' },
            { name: 'lowTraits', label: 'Low-Valued DNA Traits', description: 'E.g., Morality, Numbers' },
            { name: 'extraContext', label: 'Extra Context', isTextArea: true, rows: 3, fullWidth: true },
        ],
    },
    [ContentType.Quest]: {
        useGrid: true,
        fields: [
            { name: 'title', label: 'Quest Title Idea' },
            { name: 'objective', label: 'Primary Objective', description: 'E.g., Rescue, Retrieve, Eliminate' },
            { name: 'obstacle', label: 'Key Obstacle', description: 'E.g., A powerful monster, a political rival' },
            { name: 'giver', label: 'Quest Giver' },
            { name: 'location', label: 'Primary Location' },
            { name: 'tone', label: 'Desired Tone', description: 'E.g., Mystery, Horror, Epic Adventure' },
            { name: 'reward', label: 'Key Reward', description: 'E.g., A unique magic item, a title and land' },
            { name: 'twist', label: 'Potential Twist' },
            { name: 'engagement', label: 'Primary Player Engagement', description: 'E.g., Combat, Exploration, Social' },
            { name: 'difficulty', label: 'Difficulty/Complexity Preference', description: "E.g., 'High difficulty, low complexity'" },
            { name: 'extraContext', label: 'Extra Context', isTextArea: true, rows: 3, fullWidth: true },
        ],
    },
    [ContentType.Settlement]: {
        useGrid: true,
        fields: [
            { name: 'name', label: 'Location Name' },
            { name: 'type', label: 'Location Type', description: 'E.g., City, Forest, Ruin, Dungeon' },
            { name: 'inhabitants', label: 'Primary Inhabitants' },
            { name: 'landmark', label: 'Key Landmark or Feature' },
            { name: 'atmosphere', label: 'General Mood/Atmosphere' },
            { name: 'conflict', label: 'A Current Conflict or Problem' },
            { name: 'secret', label: 'A Hidden Secret or Treasure' },
            { name: 'dnaFocus', label: 'Primary DNA Focus', description: "E.g., 'High Magic,' 'Low Tech,' 'High Conflict'" },
            { name: 'extraContext', label: 'Extra Context', isTextArea: true, rows: 3, fullWidth: true },
        ],
    },
    [ContentType.MagicItem]: {
        useGrid: true,
        fields: [
            { name: 'name', label: 'Item Name Idea' },
            { name: 'type', label: 'Item Type', description: 'E.g., Weapon, Armor, Wondrous Item' },
            { name: 'effect', label: 'Primary Magical Effect', isTextArea: true, rows: 3, fullWidth: true },
            { name: 'appearance', label: 'Visual Appearance', isTextArea: true, rows: 3, fullWidth: true },
            { name: 'origin', label: "Item's Origin/History" },
            { name: 'quirk', label: 'A Minor Quirk or Drawback' },
            { name: 'dnaFocus', label: 'Primary DNA Focus', description: "E.g., 'Focus on a high Arcane score,' 'Make it more Cursed'", fullWidth: true },
            { name: 'extraContext', label: 'Extra Context', isTextArea: true, rows: 3, fullWidth: true },
        ],
    },
    [ContentType.Travel]: {
        useGrid: false,
        fields: [
            { name: 'regionName', label: 'Name of the Region' },
            { name: 'terrain', label: 'Primary Terrain Type' },
            { name: 'startPoint', label: 'Start Point' },
            { name: 'endPoint', label: 'End Point' },
            { name: 'purpose', label: 'Purpose of the Journey', isTextArea: true, rows: 2 },
            { name: 'dangers', label: 'Known Dangers', isTextArea: true, rows: 2 },
            { name: 'preference', label: 'Travel Preference', description: "E.g., 'Make it dangerous,' 'Focus on discovery,' 'Make it cursed'" },
            { name: 'extraContext', label: 'Extra Context', isTextArea: true, rows: 3 },
        ],
    },
};
