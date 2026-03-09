/**
 * NucleuX Academy - ATOM v2: Router Agent
 * 
 * Interrogates the user's active MarketHub plugins, filters them by 
 * current room and intent, and securely injects their "Skills-as-Markdown"
 * logic into the central orchestrator's context.
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface ActivePlugin {
    plugin_id: string;
    name: string;
    system_prompt: string;
}

/**
 * Fetches all active plugins for the current user that should trigger in the given room.
 */
export async function getActivePlugins(userId: string, currentRoom: string): Promise<ActivePlugin[]> {
    if (!userId || userId === 'anonymous') return [];

    try {
        // 1. Fetch user's active installations
        const { data: userInstalls, error: installError } = await supabase
            .from('user_plugins')
            .select('plugin_id, active_rooms')
            .eq('user_id', userId)
            .eq('is_active', true);

        if (installError || !userInstalls || userInstalls.length === 0) {
            return [];
        }

        // 2. Fetch the actual plugin details for installed plugins
        const pluginIds = userInstalls.map(ui => ui.plugin_id);
        const { data: plugins, error: pluginError } = await supabase
            .from('atom_plugins')
            .select('plugin_id, name, system_prompt, default_rooms')
            .in('plugin_id', pluginIds)
            .eq('is_published', true); // Ensure they haven't been forcefully unpublished

        if (pluginError || !plugins) {
            return [];
        }

        // 3. Filter plugins by room
        const applicablePlugins: ActivePlugin[] = [];

        for (const plugin of plugins) {
            // Find the user's specific install record
            const install = userInstalls.find(ui => ui.plugin_id === plugin.plugin_id);

            // If user overrode rooms, check those. Otherwise use plugin defaults.
            // (Assuming null/empty active_rooms means "use defaults")
            const validRooms = (install?.active_rooms && install.active_rooms.length > 0)
                ? install.active_rooms
                : plugin.default_rooms;

            // If it's valid for this room, inject it
            if (validRooms && (validRooms.includes('*') || validRooms.includes(currentRoom))) {
                applicablePlugins.push({
                    plugin_id: plugin.plugin_id,
                    name: plugin.name,
                    system_prompt: plugin.system_prompt
                });
            }
        }

        return applicablePlugins;

    } catch (error) {
        console.error('Router Agent: Failed to fetch plugins', error);
        return [];
    }
}

/**
 * Bundles the active plugin prompts into a single injectable markdown block.
 */
export function buildPluginContext(plugins: ActivePlugin[]): string {
    if (!plugins || plugins.length === 0) return '';

    let context = `\n\n## Active MarketHub Skills\nThe student has these specialized skills activated. You MUST follow their instructions where applicable.\n\n`;

    plugins.forEach(p => {
        context += `### Skill: ${p.name}\n${p.system_prompt.trim()}\n\n`;
    });

    return context.trim();
}
