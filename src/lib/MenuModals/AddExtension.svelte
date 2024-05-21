<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    function cancel() {
        dispatch("cancel");
    }
</script>

<div class="bg">
    <div class="modal">
        <div class="modal-title">
            <p>Extensions</p>
        </div>
        <div class="modal-content">
            <p>Work in Progress</p>
        </div>
        <div class="modal-buttons">
            <button class="button-cancel" on:click={cancel}>Cancel</button>
            <div style="margin-left:6px" />
        </div>
    </div>
</div>