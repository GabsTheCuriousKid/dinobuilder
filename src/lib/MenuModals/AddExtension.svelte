<script>
    import { page } from '$app/stores';
    import { createEventDispatcher } from "svelte";

    import { get, set, remove } from '../utils/GlobalTempVariables.js';

    const dispatch = createEventDispatcher();

    function cancel() {
        dispatch("cancel");
    }

    function event() {
        dispatch("completed", {
            hiddenblocksExt: localhiddenblocksExt,
            webextensionExt: localwebextensionExt,
            jsextensionExt: localjsextensionExt,
            customextensionExt: localcustomextensionExt,
            extensionCode: localCustomExtensionCode,
        });
    }

    export let hiddenblocksExt = false;
    export let webextensionExt = false;
    export let jsextensionExt = false;
    export let customextensionExt = false;
    let localhiddenblocksExt = hiddenblocksExt;
    let localwebextensionExt = webextensionExt;
    let localjsextensionExt = jsextensionExt;
    let localcustomextensionExt = customextensionExt;
    let localCustomExtensionCode = '';

    function toggleHidden() {
        localhiddenblocksExt = !localhiddenblocksExt
    }
    function toggleWeb() {
        localwebextensionExt = !localwebextensionExt
    }
    function toggleJS() {
        localjsextensionExt = !localjsextensionExt
    }
    function toggleCustom() {
        const extensionCode = prompt("Paste the custom Extension Code");
        console.log("Prompt result:", extensionCode);
        if (extensionCode == null || extensionCode == '') {
            localcustomextensionExt = false
            localCustomExtensionCode = ''
            console.log("Cancelled")
        } else {
            localcustomextensionExt = true
            localCustomExtensionCode = extensionCode
        }
    }

    let IsLiveTests;

    $: IsLiveTests = $page.url.searchParams.has('livetests');
</script>

<div class="bg">
    <div class="modal">
        <div class="modal-title">
            <p>Extensions</p>
        </div>
        <div class="modal-content">
            <div 
                style="display:flex;flex-direction:column;align-items:center;justify-content:center;height=100%"
            >
            <p>Choose an Extension you'll like to add</p>
            <p>Note: After you select one or more Extensions, you can't remove the Extension/s unless you refresh the page!</p>
            </div>
            <button class="block-extension" on:click={toggleHidden}>
                <img 
                    alt="HiddenBlocksPNG"
                    src="images/extensionIcons/HiddenBlocksIcon.png"
                    height={50}
                />
                <div style="height:5px" />
                {localhiddenblocksExt ? 'Selected' : 'Hidden Blocks'}
            </button>
            <button class="block-extension" on:click={toggleWeb}>
                <img 
                    alt="WebExtensionPNG"
                    src="images/extensionIcons/NoIcon.png"
                    height={50}
                />
                <div style="height:5px" />
                {localwebextensionExt ? 'Selected' : 'Site Runtime'}
            </button>
            <button class="block-extension" on:click={toggleJS}>
                <img 
                    alt="JSExtensionPNG"
                    src="images/extensionIcons/NoIcon.png"
                    height={50}
                />
                <div style="height:5px" />
                {localjsextensionExt ? 'Selected' : 'Javascript'}
            </button>
            <button class="block-extension" on:click={toggleCustom}>
                <img 
                    alt="CustomExtensionPNG"
                    src="images/extensionIcons/NoIcon.png"
                    height={50}
                />
                <div style="height:5px" />
                {localcustomextensionExt ? 'Selected' : 'Add Custom Extension'}
            </button>
        </div>
        <div class="modal-buttons">
            <button class="button-cancel" on:click={cancel}>Cancel</button>
            <div style="margin-left:6px" />
            <button class="button-accept" on:click={event}>OK</button>
            <div style="margin-left:24px" />
        </div>
    </div>
</div>

<style>
    .button-cancel {
        border: 1px solid rgba(0, 0, 0, 0.15);
        background: white;
        color: black;
        font-weight: bold;
        padding: 0.75rem 1rem;
        border-radius: 0.25rem;
        font-size: 0.85rem;
        cursor: pointer;
    }
    .button-accept {
        border: 1px solid #80f41a;
        background: #80f41a;
        color: white;
        font-weight: bold;
        padding: 0.75rem 1rem;
        border-radius: 0.25rem;
        font-size: 0.85rem;
        cursor: pointer;
    }

    label {
        font-weight: bold;
        font-size: 0.625rem;
        user-select: none;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .bg {
        position: fixed;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        background: #6dd016b0;
        z-index: 999999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .modal {
        width: 60%;
        height: 50%;
        outline: 4px solid hsla(0, 100%, 100%, 0.25);
        border-radius: 0.5rem;
        background: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
    }
    :global(body.dark) .bg {
        background-color: #333333b0;
    }
    :global(body.dark) .modal {
        background-color: #111;
    }

    .modal-title {
        width: 100%;
        height: 10%;
        background: #80f41a;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    :global(body.dark) .modal-title {
        background-color: #333;
    }
    .modal-content {
        width: 100%;
        height: 75%;
        overflow: auto;
    }
    .modal-buttons {
        width: 100%;
        height: 15%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: right;
    }
    .block-extension {
        background: transparent;
        font-weight: bold;
        margin: 5px;
        padding: 8px 32px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 12px;
        cursor: pointer;
    }
    :global(body.dark) .block-extension {
        color: white;
        border-color: #ccc;
    }
    .block-extension:focus,
    .block-extension:hover {
        border-color: #80f41a !important;
    }
    .block-extension:active {
        border-color: black !important;
    }
    :global(body.dark) .block-extension:active {
        border-color: rgb(114, 114, 114) !important;
    }
</style>
