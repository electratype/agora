<script context="module" lang="ts">
    import { ArrowLeft, Folder, FolderOpen, BatteryMedium, Locate } from "lucide-svelte";

    type Icon = "svelte" | "folder" | "js";

    export type TreeItem = {

        name: string;
        icon: Icon;

        children?: TreeItem[];
    };

    export const icons = {
        location: Locate,
        svelte: BatteryMedium,
        folder: Folder,
        folderOpen: FolderOpen,
        js: BatteryMedium,
        highlight: ArrowLeft,
    };
</script>

<script lang="ts">
    import { melt, type TreeView } from "@melt-ui/svelte";
    import { getContext } from "svelte";

    export let treeItems: TreeItem[];
    export let level = 1;

    const {
        elements: { item, group },
        helpers: { isExpanded, isSelected },
    } = getContext<TreeView>("tree");
</script>

{#each treeItems as { name, icon, children }, i}
    {@const itemId = `${name}-${i}`}
    {@const hasChildren = !!children?.length}

    <li class={level !== 1 ? "pl-4" : ""}>
        <button
            class="flex items-center gap-1 rounded-md p-1 focus:bg-magnum-200"
            use:melt={$item({
                id: itemId,
                hasChildren,
            })}
        >
            <!-- Add icon. -->
            {#if icon === "folder" && hasChildren && $isExpanded(itemId)}
                <svelte:component this={icons["folderOpen"]} class="h-4 w-4" />
            {:else}
                <svelte:component this={icons[icon]} class="h-4 w-4" />
            {/if}

            <span class="select-none">{name}</span>

            <!-- Selected icon. -->
            {#if $isSelected(itemId)}
                <svelte:component this={icons["highlight"]} class="h-4 w-4" />
            {/if}
        </button>

        {#if children}
            <ul use:melt={$group({ id: itemId })}>
                <svelte:self treeItems={children} level={level + 1} />
            </ul>
        {/if}
    </li>
{/each}

<style>
    /* Remove docs' focus box-shadow styling. */
    li:focus {
        box-shadow: none !important;
    }
</style>
