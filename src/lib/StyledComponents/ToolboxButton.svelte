<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    function event() {
        dispatch("click");
    }
</script>

<button on:click={event}>
    <slot />
</button>

<style>
    button {
        padding: 0.5rem 1.65rem;

        font-size: 0.75rem;
        color: var(--dinobuilder-text, black);
        background: transparent;
        cursor: pointer;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 4px;
    }
    button:focus,
    button:hover,
    button:active {
        background: white;
    }

    :global(body.dark) button {
        color: var(--dinobuilder-text, #ccc);
        border-color: #c6c6c6;
    }
    :global(body.dark) button:focus,
    :global(body.dark) button:hover,
    :global(body.dark) button:active {
        background: #111;
    }
</style>
