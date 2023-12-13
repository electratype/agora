<script>
    import { createLabel, melt } from "@melt-ui/svelte";

    const {
        elements: { root },
    } = createLabel();
</script>

<div class="flex flex-col bg-white rounded-xl p-4 max-w-lg">
    <h1 class="text-5xl font-bold mb-6">Sign in</h1>
    <form method="POST" action="?/authenticate" class="flex flex-col items-center">
        <div class="flex flex-col items-start justify-center mb-4">
            <label for="email" use:melt={$root}>Email</label>
            <input name="email" type="email" placeholder="admin@example.com" class="h-10 w-[400px] rounded-md bg-white px-3 py-2 text-magnum-700"/>

            <label for="password" use:melt={$root}>Password</label>
            <input name="password" type="password" placeholder="***********" class="h-10 w-[400px] rounded-md bg-white px-3 py-2 text-magnum-700"/>
        </div>

        <button class="ml-auto rounded-md bg-magnum-600 px-3 py-1 font-medium text-magnum-100 hover:opacity-75 active:opacity-50">Log in</button>
    </form>
</div>
