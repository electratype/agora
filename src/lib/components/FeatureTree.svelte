<script>
    import { createTreeView } from '@melt-ui/svelte';
    import { setContext } from 'svelte';
    import Tree from "./Tree.svelte";

    const ctx = createTreeView({
        defaultExpanded: ['lib-0', 'tree-0'],
    });
    setContext('tree', ctx);

    const {
        elements: { tree },
    } = ctx;


    const treeItems = [
        { name: 'Großlappen', icon: 'location' },
        { name: 'Riem', icon: 'location' },
        { name: 'Obergrashof', icon: 'location' },
        {
        name: 'lib',
        icon: 'folder',
        children: [
            {
            name: 'tree',
            icon: 'folder',
            children: [
                {
                name: 'Tree.svelte',
                icon: 'svelte',
                },
                {
                name: 'TreeView.svelte',
                icon: 'svelte',
                },
            ],
            },
            {
            name: 'icons',
            icon: 'folder',
            children: [
                { name: 'JS.svelte', icon: 'svelte' },
                { name: 'Svelte.svelte', icon: 'svelte' },
            ],
            },
            {
            name: 'index.js',
            icon: 'js',
            },
        ],
        },
        {
        name: 'routes',
        icon: 'folder',
        children: [
            {
            name: 'contents',
            icon: 'folder',
            children: [
                {
                name: '+layout.svelte',
                icon: 'svelte',
                },
                {
                name: '+page.svelte',
                icon: 'svelte',
                },
            ],
            },
        ],
        },
    ];

</script>

<div
  class="flex h-[18.75rem] w-[18.75rem] flex-col rounded-xl bg-white text-neutral-900 md:h-[350px] mb-6"
>
  <div class="flex flex-col gap-1 px-4 pt-4">
    <h3 class="text-lg font-bold">Features</h3>
    <hr />
  </div>

  <ul class="overflow-auto px-4 pb-4 pt-2" {...$tree}>
    <Tree {treeItems} />
  </ul>
 
</div>

