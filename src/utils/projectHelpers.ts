import { Project, ContentType, ContentItem } from '../../types';

export interface TypedContentItem extends ContentItem {
    type: ContentType;
}

export function getAllItems(project: Project): TypedContentItem[] {
    return [
        ...project.worlds.map(item => ({ ...item, type: ContentType.World })),
        ...project.npcs.map(item => ({ ...item, type: ContentType.NPC })),
        ...project.factions.map(item => ({ ...item, type: ContentType.Faction })),
        ...project.quests.map(item => ({ ...item, type: ContentType.Quest })),
        ...project.settlements.map(item => ({ ...item, type: ContentType.Settlement })),
        ...project.magicItems.map(item => ({ ...item, type: ContentType.MagicItem })),
        ...project.travels.map(item => ({ ...item, type: ContentType.Travel })),
    ];
}
