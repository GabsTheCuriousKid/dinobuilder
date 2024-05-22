<script>
    import { createEventDispatcher } from "svelte";
    import { hiddenblocksxml } from '../../resources/extensions/hiddenblocks.js';
    import { maintoolbox } from '$lib/toolbox/toolbox.xml';

    const dispatch = createEventDispatcher();

    function cancel() {
        dispatch("cancel");
    }

    const options = [
  {
  name: "Hidden Blocks",
   description: "View blocks that have been hidden from the main toolbox.",
   bannerUrl: "images/extensionIcons/HiddenBlocksIcon.png",
   xml: hiddenblocksxml, // Assuming this is the complete XML string
  },
 ];

 let selectedOption;

 async function importXml(optionXml) {
  const existingXmlString = await fetch(maintoolbox).then(response => response.text());

  const parser = new DOMParser();
  const existingDoc = parser.parseFromString(existingXmlString, 'text/xml');

  const parentElement = existingDoc.querySelector('xml');

  const importedDoc = parser.parseFromString(optionXml, 'text/xml');

  const importedCategoryElement = importedDoc.documentElement.cloneNode(true);

  parentElement.appendChild(importedCategoryElement);

  const serializer = new XMLSerializer();
  const modifiedXmlString = serializer.serializeToString(existingDoc);

 console.log(modifiedXmlString); // For debugging or further use
 }

 function handleOptionSelect(option) {
 selectedOption = option;
 }
</script>

<div class="bg">
    <div class="modal">
        <div class="modal-title">
            <p>Extensions</p>
        </div>
        <div class="modal-content">
            <div
style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%"
>
<ul>
<li on:click={() => handleOptionSelect(options[0])}>
<img src={options[0].bannerUrl} alt={options[0].name + " Banner"} />
<span>{options[0].name}</span>
<p>{options[0].description}</p>
</li>
<li on:click={() => handleOptionSelect(options[1])}>
</li>
</ul>
</div>
        </div>
        <div class="modal-buttons">
            <button class="button-cancel" on:click={cancel}>Cancel</button>
            <div style="margin-left:6px" />
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
    ul {
list-style: none;
padding: 0;
margin: 0;
}

li {
padding: 0.5rem 1rem; /* Add some padding for each list item */
cursor: pointer; /* Indicate interactivity on hover */
border-bottom: 1px solid rgba(0, 0, 0, 0.1);
transition: background-color 0.2s ease-in-out;
&:hover {
background-color: rgba(0, 0, 0, 0.05);
}
}
</style>
