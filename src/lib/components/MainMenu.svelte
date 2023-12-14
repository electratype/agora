<script>
    import { createMenubar } from "@melt-ui/svelte";
    import { goto } from "$app/navigation";
    import { Home, Map, Settings } from "lucide-svelte";

    const {
        elements: { menubar },
        builders: { createMenu },
    } = createMenubar();

    const {
        elements: { trigger, menu, item, separator },
        builders: { createSubmenu, createMenuRadioGroup },
    } = createMenu();
</script>

<nav
    class="fixed bottom-4 left-1/2 px-4 py-2 rounded-3xl bg-white inline-flex gap-3"
    use:melt={$menubar}
>
    <a href="/">
        <button>
            <Home />
        </button>
    </a>

    <a href="/map">
        <button>
            <Map />
        </button>
    </a>

    <a href="/settings">
        <button>
            <Settings />
        </button>
    </a>
</nav>

<style>
    .separator {
        width: 1px;
        background-color: theme("colors.neutral.300");
        align-self: stretch;
    }
</style>
