<script>
    import { createToolbar, melt } from "@melt-ui/svelte";
    import { onMount } from "svelte";
    import {
        PencilRuler,
        MousePointerSquareDashed,
        MapPinned,
        PencilLine,
        Hexagon,
        Square,
        Radius,
        Undo,
        Trash2,
        Bold,
        Italic,
        Strikethrough,
        AlignLeft,
        AlignCenter,
        AlignRight,
    } from "lucide-svelte";

    import { Map } from "maplibre-gl";
    import MapboxDraw from "@mapbox/mapbox-gl-draw";
    import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

    import { StaticMode } from "../maplibre-gl-modes/StaticMode";

    // Variables

    let editMode = false;

    let featureData = null;

    // TOOLBAR //

    const {
        elements: { root, button, link, separator },
        builders: { createToolbarGroup },
    } = createToolbar();

    const {
        elements: { group: modeGroup, item: modeItem },
    } = createToolbarGroup();

    const {
        elements: { group: drawGroup, item: drawItem },
    } = createToolbarGroup();

    const {
        elements: { group: fontGroup, item: fontItem },
    } = createToolbarGroup({
        type: "multiple",
    });

    const {
        elements: { group: alignGroup, item: alignItem },
    } = createToolbarGroup();

    // MAP //

    let mapElement;
    let map;
    let draw;
    let drawMode;

    const initialView = [11.583816979394221, 48.130457861822244];

    onMount(async () => {
        map = new Map({
            container: mapElement,
            center: initialView, // starting position [lng, lat]
            zoom: 10, // starting zoom
            maxZoom: 17,
            style: {
                version: 8,
                sources: {
                    "bayern-luftbild": {
                        type: "raster",
                        tiles: [
                            "https://mapproxy.karlislab.com/wmts/bayern-luftbild/GLOBAL_MERCATOR/{z}/{x}/{y}.png",
                        ],
                        tileSize: 256,
                        attribution: "",
                    },
                },
                layers: [
                    {
                        id: "simple-tiles",
                        type: "raster",
                        source: "bayern-luftbild",
                        minzoom: 0,
                        maxzoom: 18,
                    },
                ],
            },
        });

        let cmodes = await import('mapbox-gl-draw-circle');

        var modes = MapboxDraw.modes;
        modes.static = StaticMode;

        draw = new MapboxDraw({
            // don't render the default controls
            displayControlsDefault: false,
            modes: {
                ...MapboxDraw.modes,
                static: StaticMode,
                draw_circle  : cmodes.CircleMode,
                drag_circle  : cmodes.DragCircleMode,
                direct_select: cmodes.DirectMode,
                simple_select: cmodes.SimpleSelectMode
            },
        });
        map.addControl(draw, "top-left");
        drawMode = draw.getMode();
        map.on("draw.modechange", (e) => (drawMode = e.mode));

        map.on('draw.create', updateData);
        map.on('draw.delete', updateData);
        map.on('draw.update', updateData);

        function updateData(e) {

            featureData = JSON.stringify(draw.getAll(), null, 4);

            /*
            const answer = document.getElementById('calculated-area');
            if (data.features.length > 0) {
                const area = turf.area(data);
                // restrict to area to 2 decimal points
                const roundedArea = Math.round(area * 100) / 100;
                answer.innerHTML =
                    `<p><strong>${
                        roundedArea
                    }</strong></p><p>square meters</p>`;
            } else {
                answer.innerHTML = '';
                if (e.type !== 'draw.delete')
                    alert('Use the draw tools to draw a polygon!');
            }
            */
        }
        
    });

    function toggleEditMode() {
        
        editMode = !editMode;

        if (editMode) {
            draw.changeMode(draw.modes.SIMPLE_SELECT);
        } else {
            draw.changeMode('static');
        }    
    }

    function togglePointDrawingMode() {
        draw.changeMode(draw.modes.DRAW_POINT);
    }

    function toggleLineDrawingMode() {
        draw.changeMode(draw.modes.DRAW_LINE_STRING);
    }

    function togglePolygonDrawingMode() {
        draw.changeMode(draw.modes.DRAW_POLYGON);
    }

    function toggleRadiusDrawingMode() {
        draw.changeMode("draw_circle");
    }

</script>


<div
    use:melt={$root}
    class="flex min-w-max items-center gap-4 rounded-md bg-white px-3 py-3 text-neutral-700 shadow-sm lg:w-[35rem]"
>
    <div class="flex items-center gap-1" use:melt={$modeGroup}>
        <button
            class="item"
            aria-label="draw or edit"
            use:melt={$modeItem({value: "edit", disabled: false})}
            on:m-click={(e) => {
                toggleEditMode();
            }}
            on:m-keydown={(e) => {
                toggleEditMode();
            }}
        >
            <PencilRuler class="square-5" />
        </button>
    </div>

    <div class="separator" use:melt={$separator} />

    {#if editMode}
    <div id="drawGroup" class="flex items-center gap-1" use:melt={$drawGroup}>
        <button
            class="item"
            aria-label="select"
            use:melt={$drawItem("select")}
            on:m-click={(e) => {

            }}
            on:m-keydown={(e) => {

            }}
        >
            <MousePointerSquareDashed class="square-5" />
        </button>
        <button
            class="item"
            aria-label="place marker"
            use:melt={$drawItem("marker")}
            on:m-click={(e) => {
                togglePointDrawingMode();
            }}
            on:m-keydown={(e) => {
                togglePointDrawingMode();
            }}
        >
            <MapPinned class="square-5" />
        </button>
        <button
            class="item"
            aria-label="draw polyline"
            use:melt={$drawItem("polyline")}
            on:m-click={(e) => {
                toggleLineDrawingMode();
            }}
            on:m-keydown={(e) => {
                toggleLineDrawingMode();
            }}
        >
            <PencilLine class="square-5" />
        </button>
        <button
            class="item"
            aria-label="draw polygon"
            use:melt={$drawItem("polygon")}
            on:m-click={(e) => {
                togglePolygonDrawingMode();
            }}
            on:m-keydown={(e) => {
                togglePolygonDrawingMode();
            }}
        >
            <Hexagon class="square-5" />
        </button>
        <button
            class="item"
            aria-label="draw rectangle"
            use:melt={$drawItem("rectangle")}
        >
            <Square class="square-5" />
        </button>
        <button
            class="item"
            aria-label="draw circle"
            use:melt={$drawItem("circle")}
            on:m-click={(e) => {
                toggleRadiusDrawingMode();
            }}
            on:m-keydown={(e) => {
                toggleRadiusDrawingMode();
            }}
        >
            <Radius class="square-5" />
        </button>
    </div>

    <div class="separator" use:melt={$separator} />

    <div class="flex items-center gap-1" use:melt={$drawGroup}>
        <button
            class="item"
            aria-label="undo"
            use:melt={$drawItem("undo")}
            on:m-click={(e) => {
                
            }}
            on:m-keydown={(e) => {
                
            }}
        >
            <Undo class="square-5" />
        </button>
        <button
            class="item"
            aria-label="delete"
            use:melt={$drawItem("delete")}
            on:m-click={(e) => {
                
            }}
            on:m-keydown={(e) => {
                
            }}
        >
            <Trash2 class="square-5" />
        </button>
    </div>
    {/if}

    <div class="separator" use:melt={$separator} />

    <div class="flex items-center gap-1" use:melt={$fontGroup}>
        <button class="item" aria-label="bold" use:melt={$fontItem("bold")}>
            <Bold class="square-5" />
        </button>
        <button class="item" aria-label="italic" use:melt={$fontItem("italic")}>
            <Italic class="square-5" />
        </button>
        <button
            class="item"
            aria-label="strikethrough"
            use:melt={$fontItem("strikethrough")}
        >
            <Strikethrough class="square-5" />
        </button>
    </div>
    <div class="separator" use:melt={$separator} />
    <div class="flex items-center gap-1" use:melt={$alignGroup}>
        <button
            class="item"
            aria-label="align left"
            use:melt={$alignItem("left")}
        >
            <AlignLeft class="square-5" />
        </button>
        <button
            class="item"
            aria-label="align center"
            use:melt={$alignItem("center")}
        >
            <AlignCenter class="square-5" />
        </button>
        <button
            class="item"
            aria-label="align-right"
            use:melt={$alignItem("right")}
        >
            <AlignRight class="square-5" />
        </button>
    </div>
    <div class="separator" use:melt={$separator} />
    <a href="/" class="link nowrap flex-shrink-0" use:melt={$link}>
        Edited 2 hours ago
    </a>
    <button
        class="ml-auto rounded-md bg-magnum-600 px-3 py-1 font-medium text-magnum-100 hover:opacity-75 active:opacity-50"
        use:melt={$button}>Save</button
    >
</div>

<div id="map" bind:this={mapElement}></div>

<pre><code id="features" contenteditable="false" bind:textContent={featureData}></code></pre>

<style>

    #map {
        height: 1000px;
        border-radius: 10px;
    }

    .item {
        padding: theme("spacing.1");
        border-radius: theme("borderRadius.md");

        &:hover {
            background-color: theme("colors.magnum.100");
        }

        &[data-state="on"] {
            background-color: theme("colors.magnum.200");
            color: theme("colors.magnum.900");
        }

        &:focus {
            @apply ring-2 ring-magnum-400;
        }
    }

    .separator {
        width: 1px;
        background-color: theme("colors.neutral.300");
        align-self: stretch;
    }
</style>
