<script>
    import Menu from "../../../lib/components/Menu.svelte";
</script>

<div class="w-full flex flex-col items-center h-full">
    <div class="container flex flex-row h-full">
        <div class="w-full flex flex-col">
            <div class="w-full mb-3">
                <Menu />
            </div>
            <div class="w-full flex flex-col h-full">
                <slot />
            </div>
        </div>
    </div>
</div>
