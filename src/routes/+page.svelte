<script>
    import { onMount } from "svelte";

    // Components
    import NavigationBar from "$lib/NavigationBar/NavigationBar.svelte";
    import NavigationDivider from "$lib/NavigationBar/Divider.svelte";
    import NavigationButton from "$lib/NavigationBar/Button.svelte";
    import StyledButton from "$lib/StyledComponents/ToolboxButton.svelte";

    // Modals
    import ExtensionColorsModal from "$lib/MenuModals/ExtensionColors.svelte";
    import AddExtensionsModal from "$lib/MenuModals/AddExtension.svelte";
    import CreateBlockModal from "$lib/MenuModals/CreateBlock.svelte";
    import AddonsMenuModal from "$lib/MenuModals/AddonsMenu.svelte";

    // Modal Scripts
    import CreateBlockModalScript from "$lib/MenuModals/createblock.js";

    // Toolbox
    import Toolbox from "$lib/Toolbox/Toolbox.xml?raw";

    import hiddenblocksExtension from "$lib/Extensions/hiddenblocks.xml?raw";
    import webExtensionExtension from "$lib/Extensions/webextension.xml?raw";

    import JSZip from "jszip";
    import beautify from "js-beautify";
    import Prism from "prismjs";
    import * as FileSaver from "file-saver";
    import fileDialog from "../resources/fileDialog";
    import EventManager from "../resources/events";

    import AddXMLtoXML from '../utils/AddXMLtoXML.js';

    import Blockly from "blockly/core";
    import * as ContinuousToolboxPlugin from "@blockly/continuous-toolbox";
    import "@blockly/field-colour-hsv-sliders";

    const Theme = Blockly.Theme.defineTheme("BasicTheme", {
        base: Blockly.Themes.Classic,
        fontStyle: {
            family: '"Source Code Pro", monospace',
            weight: "700",
            size: 12,
        },
        startHats: true,
    });

    Blockly.VerticalFlyout.prototype.getFlyoutScale = function () {
        return config.zoom.startScale;
    };

    import En from "blockly/msg/en";
    import "blockly/blocks";

    import BlocklyComponent from "svelte-blockly";

    import Compiler from "../resources/compiler";
    import preload from "../resources/preload";

    // Blocks
    import registerGeneric from "../resources/blocks/generic.js";
    registerGeneric();

    import registerCore from "../resources/blocks/core.js";
    import registerEvents from "../resources/blocks/events.js";
    import registerControl from "../resources/blocks/control.js";
    import registerSensing from "../resources/blocks/sensing.js";
    import registerMotion from "../resources/blocks/motion.js";
    import registerLooks from "../resources/blocks/looks.js";
    import registerSound from "../resources/blocks/sound.js";
    import registerLiterals from "../resources/blocks/literals.js";
    import registerOperators from "../resources/blocks/operators.js";
    import registerConversions from "../resources/blocks/conversions.js";
    import registerVariables from "../resources/blocks/variables.js";
    import registerJSON from "../resources/blocks/json.js";
    import registerBlocks from "../resources/blocks/blocks.js";
    import registerMenus from "../resources/blocks/menus.js";
    import registerFunctions from "../resources/blocks/functions.js";
    import registerDebug from "../resources/blocks/debug.js";
    
    registerCore();
    registerControl();
    registerEvents();
    registerMotion();
    registerLooks();
    registerSound();
    registerSensing();
    registerLiterals();
    registerOperators();
    registerConversions();
    registerVariables();
    registerJSON();
    registerBlocks();
    registerMenus();
    registerFunctions();
    registerDebug();

    // Extension Blocks
    import registerWebExtension from "../resources/blocks/webextension.js";
    registerWebExtension();

    const en = {
        rtl: false,
        msg: {
            ...En,
        },
    };

    import customRenderer from "../resources/renderer"
    Blockly.blockRendering.unregister('custom_renderer') //weird bug
    Blockly.blockRendering.register('custom_renderer', customRenderer)

    let config = {
        toolbox: Toolbox,
        collapse: true,
        comments: true,
        scrollbars: true,
        disable: false,
        theme: Theme,
        renderer: "custom_renderer",
        grid: {
            spacing: 25,
            length: 3,
            colour: "#00000011",
            snap: false,
        },
        zoom: {
            controls: true,
            wheel: false,
            startScale: 0.8,
            maxScale: 4,
            minScale: 0.25,
            scaleSpeed: 1.1,
        },
        plugins: {
            toolbox: ContinuousToolboxPlugin.ContinuousToolbox,
            flyoutsVerticalToolbox: ContinuousToolboxPlugin.ContinuousFlyout,
            metricsManager: ContinuousToolboxPlugin.ContinuousMetrics,
        },
        move: {
            scrollbars: {
                horizontal: true,
                vertical: true,
            },
            drag: true,
            wheel: true,
        },
    };

    let workspace;
    let compiler;
    let projectName = "";
    let projectID = "";
    let lastGeneratedCode = "";

    const extensionImageStates = {
        icon: {
            failed: false,
            square: false,
            loading: false,
            image: "",
        },
        menuicon: {
            failed: false,
            square: false,
            loading: false,
            image: "",
        },
    };
    const extensionMetadata = {
        id: "extensionID",
        name: "Extension",
        docsURL: "",
        color1: "#0088ff",
        color2: "#0063ba",
        color3: "",
        tbShow: true
    };

    function updateGeneratedCode() {
        extensionMetadata.name = "Extension";
        extensionMetadata.id = "extensionID";
        if (projectName) {
            extensionMetadata.name = projectName;
        }
        if (projectID) {
            extensionMetadata.id = projectID;
        }
        const code = compiler.compile(
            workspace,
            extensionMetadata,
            extensionImageStates
        );
        lastGeneratedCode = code;
    }

    import pkg from '@blockly/workspace-minimap';
    const { PositionedMinimap } = pkg;
    onMount(() => {
        console.log("ignore the warnings above we dont care about those");

        window.onbeforeunload = () => "";
        compiler = new Compiler(workspace);
        // workspace was changed
        workspace.addChangeListener(updateGeneratedCode);

        EventManager.allowAttachment();
        EventManager.on(EventManager.EVENT_THEME_CHANGED, () => {
            workspace.refreshTheme();
        });

        const minimap = new PositionedMinimap(workspace);
        minimap.init();
    });

    function downloadProject() {
        // generate file name
        let filteredProjectName = (projectName || projectID).replace(/[^a-z0-9\-]+/gim, "_");
        let fileName = filteredProjectName + ".tb";
        if (!filteredProjectName) {
            fileName = "MyProject.tb";
        }

        // data
        let projectData = Blockly.serialization.workspaces.save(workspace)

        // modify data by me wow
        projectData = {
            blockly: projectData,
            metadata: extensionMetadata,
            images: extensionImageStates
        }

        // zip
        const zip = new JSZip();
        zip.file(
            "README.txt",
            "This file is not meant to be opened!" +
                "\nBe careful as you can permanently break your project!"
        );

        // data
        const data = zip.folder("data");
        data.file("project.json", JSON.stringify(projectData));

        // download
        zip.generateAsync({ type: "blob" }).then((blob) => {
            FileSaver.saveAs(blob, fileName);
        });
    }
    function loadProject() {
        fileDialog({ accept: ".tb" }).then((files) => {
            if (!files) return;
            const file = files[0];

            const projectNameIdx = file.name.lastIndexOf(".tb");

            JSZip.loadAsync(file.arrayBuffer()).then(async (zip) => {
                console.log("loaded zip file...");

                // get project json from the data folder
                const dataFolder = zip.folder("data");
                const projectJsonString = await dataFolder
                    .file("project.json")
                    .async("string");
                const projectJson = JSON.parse(projectJsonString);

                // do your thing
                projectName = projectJson.metadata.name
                projectID = projectJson.metadata.id
                for (var i in projectJson.metadata) {
                    var v = projectJson.metadata[i]
                    extensionMetadata[i] = v
                }
                for (var i in projectJson.images) {
                    var v = projectJson.images[i]
                    extensionImageStates[i] = v
                }

                // get project workspace xml stuffs
                const workspacesFolder = zip.folder("workspaces");
                const fileNames = [];
                workspacesFolder.forEach((_, file) => {
                    const fileName = file.name.replace("workspaces/", "");
                    fileNames.push(fileName);
                });
                // console.log(fileNames); // debug
                const idWorkspacePairs = {};
                for (const fileName of fileNames) {
                    const idx = fileName.lastIndexOf(".xml");
                    const id = fileName.substring(0, idx);
                    // assign to pairs
                    idWorkspacePairs[id] = await workspacesFolder
                        .file(fileName)
                        .async("string");
                }
                // console.log(idWorkspacePairs); // debug

                // laod
                console.log(projectJson); // debug
                Blockly.serialization.workspaces.load(projectJson.blockly, workspace);

                updateGeneratedCode()
            });
        });
    }

    // code display & handling
    function beautifyGeneratedCode(code) {
        const beautified = beautify.js(code, {
            indent_size: 4,
            space_in_empty_paren: true,
        });
        return beautified;
    }
    function displayGeneratedCode(code) {
        const beautified = beautifyGeneratedCode(code);
        const highlighted = Prism.highlight(
            beautified,
            Prism.languages.javascript
        );
        return highlighted;
    }

    // image importing
    function extensionIconAdded(event) {
        console.log(event);
        const filePicker = event.target;
        // check if we have a file
        if (!filePicker.files || !filePicker.files[0]) {
            // remove the image
            extensionImageStates.icon.failed = false;
            extensionImageStates.icon.square = false;
            extensionImageStates.icon.loading = false;
            extensionImageStates.icon.image = "";
            updateGeneratedCode();
            return;
        }
        const file = filePicker.files[0];

        extensionImageStates.icon.loading = true;
        const fileReader = new FileReader();
        fileReader.onload = () => {
            // file finished loading
            const url = fileReader.result;
            extensionImageStates.icon.image = url;
            updateGeneratedCode();
            // start checking the other stuff
            const image = new Image();
            image.onload = () => {
                extensionImageStates.icon.failed = false;
                extensionImageStates.icon.square = image.width === image.height;
                // mark as loading finished
                extensionImageStates.icon.loading = false;
            };
            image.onerror = () => {
                extensionImageStates.icon.failed = true;
                extensionImageStates.icon.square = false;
                // mark as loading finished
                extensionImageStates.icon.loading = false;
            };
            image.src = url;
        };
        fileReader.readAsDataURL(file);
    }

    function extraIconAdded(event) {
        console.log(event);
        const filePicker = event.target;
        // check if we have a file
        if (!filePicker.files || !filePicker.files[0]) {
            // remove the image
            extensionImageStates.menuicon.failed = false;
            extensionImageStates.menuicon.square = false;
            extensionImageStates.menuicon.loading = false;
            extensionImageStates.menuicon.image = "";
            updateGeneratedCode();
            return;
        }
        const file = filePicker.files[0];

        extensionImageStates.menuicon.loading = true;
        const fileReader = new FileReader();
        fileReader.onload = () => {
            // file finished loading
            const url = fileReader.result;
            extensionImageStates.menuicon.image = url;
            updateGeneratedCode();
            // start checking the other stuff
            const image = new Image();
            image.onload = () => {
                extensionImageStates.menuicon.failed = false;
                extensionImageStates.menuicon.square = image.width === image.height;
                // mark as loading finished
                extensionImageStates.menuicon.loading = false;
            };
            image.onerror = () => {
                extensionImageStates.menuicon.failed = true;
                extensionImageStates.menuicon.square = false;
                // mark as loading finished
                extensionImageStates.menuicon.loading = false;
            };
            image.src = url;
        };
        fileReader.readAsDataURL(file);
    }

    // validation
    function isExtensionIDInvalid(id) {
        return Boolean(String(id).match(/[^a-z0-9]/gim));
    }

    let newToolbox;

    // Modals
    const ModalState = {
        extensionColors: false,
        addExtensions: false,
        addonsMenu: false,
        dsText: false,
        blockPIcons: false,
    };
    async function onHiddenBlocksMount() {
        try {
            const scrollX = workspace.getMetrics().viewLeft;
            const scrollY = workspace.getMetrics().viewTop;
            if (!newToolbox) {
                let newToolboxResult = AddXMLtoXML(hiddenblocksExtension, Toolbox, '</category>', '</xml>');
                newToolbox = newToolboxResult
            } else {
                let newToolboxResult = AddXMLtoXML(hiddenblocksExtension, newToolbox, '</category>', '</xml>');
                newToolbox = newToolboxResult
            }
            console.log(newToolbox)
            updateToolbox(newToolbox)
        } catch (error) {
            console.error('Error injecting XML:', error);
        }
    }
    async function onWebExtensionMount() {
        try {
            const scrollX = workspace.getMetrics().viewLeft;
            const scrollY = workspace.getMetrics().viewTop;
            if (!newToolbox) {
                let newToolboxResult = AddXMLtoXML(webExtensionExtension, Toolbox, '</category>', '</xml>');
                newToolbox = newToolboxResult
            } else {
                let newToolboxResult = AddXMLtoXML(webExtensionExtension, newToolbox, '</category>', '</xml>');
                newToolbox = newToolboxResult
            }
            console.log(newToolbox)
            updateToolbox(newToolbox)
        } catch (error) {
            console.error('Error injecting XML:', error);
        }
    }
    let refreshKey = 0;
    function updateToolbox(newToolbox) {
        try {
            workspace.removeChangeListener(updateGeneratedCode);
            config = {
                ...config,
                toolbox: newToolbox,
            };
            workspace.updateToolbox(newToolbox);
            refreshKey = 1;
            workspace.addChangeListener(updateGeneratedCode);
            updateGeneratedCode()
        } catch (error) {
            console.error("Failed to update toolbox:", error);
        }
    }
</script>

<CreateBlockModal
    color1={extensionMetadata.color1}
    color2={extensionMetadata.color2}
    color3={extensionMetadata.color3}
/>
{#if ModalState.addExtensions}
    <AddExtensionsModal
        on:completed={async (addextensiondata) => {
            ModalState.addExtensions = false;
            if (addextensiondata.detail.hiddenblocksExt === true) {
                onHiddenBlocksMount()
            }
            if (addextensiondata.detail.webextensionExt === true) {
                onWebExtensionMount()
            }
        }}
        on:cancel={() => {
            ModalState.addExtensions = false;
        }}
    />
{/if}
{#if ModalState.extensionColors}
    <ExtensionColorsModal
        color1={extensionMetadata.color1}
        color2={extensionMetadata.color2}
        color3={extensionMetadata.color3}
        tbShow={extensionMetadata.tbShow}
        on:completed={(colors) => {
            ModalState.extensionColors = false;
            extensionMetadata.color1 = colors.detail.color1;
            extensionMetadata.color2 = colors.detail.color2;
            extensionMetadata.color3 = colors.detail.color3;
            extensionMetadata.tbShow = colors.detail.tbShow;
            updateGeneratedCode();
        }}
        on:cancel={() => {
            ModalState.extensionColors = false;
            updateGeneratedCode();
        }}
    />
{/if}
{#if ModalState.addonsMenu}
    <AddonsMenuModal
        dsText={ModalState.dsText}
        blockPIcons={ModalState.blockPIcons}
        on:completed={(events) => {
            ModalState.addonsMenu = false;
            ModalState.dsText = events.detail.dstext;
            ModalState.blockPIcons = events.detail.blockPaletteIcons;
            document.documentElement.style.setProperty('--dinobuilder-text', events.detail.dstext ? 'transparent' : '');
        }}
        on:cancel={() => {
            ModalState.addonsMenu = false;
        }}
    />
{/if}
<NavigationBar>
    <NavigationButton on:click={() => { ModalState.addonsMenu = true; }}>Addons</NavigationButton>
    <NavigationDivider />
    <NavigationButton on:click={downloadProject}>Save</NavigationButton>
    <NavigationButton on:click={loadProject}>Load</NavigationButton>
    <NavigationDivider />
    <input
        class="project-name"
        type="text"
        placeholder="Extension ID (ex: extensionID)"
        style="margin-left:4px;margin-right:4px"
        data-invalid={isExtensionIDInvalid(projectID)}
        bind:value={projectID}
        on:change={updateGeneratedCode}
    />
    {#if isExtensionIDInvalid(projectID)}
        <p style="color:white;margin-left:4px">
            <b>Extension ID must be only letters and numbers.</b>
        </p>
    {/if}
    <NavigationDivider />
    <input
        class="project-name"
        type="text"
        placeholder="Extension Name (ex: Extension)"
        style="margin-left:4px;margin-right:4px"
        bind:value={projectName}
        on:change={updateGeneratedCode}
    />
</NavigationBar>
<div class="main">
    <div class="row-menus">
        <div class="row-first-submenus">
            <div class="blockMenuButtons">
                <StyledButton
                    on:click={() => {
                        ModalState.addExtensions = true;
                    }}
                >
                    Add an Extension
                </StyledButton>
                <div style="margin-left:8px" />
                <StyledButton
                    on:click={() => {
                        ModalState.extensionColors = true;
                    }}
                >
                    Edit Extension Colors
                </StyledButton>
                <div style="margin-left:8px" />
                <!--<StyledButton
                    on:click={() => {
                        CreateBlockModalScript.open();
                    }}
                >
                    Create an Extension Block
                </StyledButton> wont need this since im changing the system -->
                <div style="margin-left:8px" />
                <div class="extensionMenuPreview">
                    <div style="text-align: center;">
                        {#if !extensionImageStates.icon.loading && !extensionImageStates.icon.failed && extensionImageStates.icon.image}
                            <div
                                class="extensionBubbleIcon"
                                style={`border: 0; border-radius: 0; background-image: url(${extensionImageStates.icon.image})`}
                            />
                        {:else}
                            <div
                                class="extensionBubbleIcon"
                                style={`background: ${extensionMetadata.color1}; border-color: ${extensionMetadata.color2}`}
                            />
                        {/if}
                        <div class="extensionBubbleName">
                            {#if projectName}
                                {projectName}
                            {:else}
                                Extension
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
            <div class="blocklyWrapper">
                <BlocklyComponent {config} key={refreshKey} locale={en} bind:workspace />
            </div>
        </div>
        <div class="row-submenus">
            <div class="assetsWrapper">
                <h1>Assets</h1>
                <p>
                    Extra things that will appear under
                    {#if projectName}
                        "{projectName}"
                    {:else}
                        "Extension"
                    {/if}
                    in the block list.
                    <br />
                    These things are not required, so you can leave them empty if
                    you do not need them.
                </p>
                <p>
                    Documentation URL:
                    <input
                        type="text"
                        placeholder="https://..."
                        bind:value={extensionMetadata.docsURL}
                        on:change={updateGeneratedCode}
                    />
                </p>
                <p>
                    Extension Icon:
                    <input type="file" accept=".png,.jpg,.jpeg" on:change={extensionIconAdded} />
                </p>
                {#if !extensionImageStates.icon.loading && !extensionImageStates.icon.failed && extensionImageStates.icon.image}
                    <img
                        alt="Extension Icon"
                        title="Extension Icon"
                        class="extensionIcon"
                        src={extensionImageStates.icon.image}
                    />
                {/if}
                {#if extensionImageStates.icon.image}
                    {#if extensionImageStates.icon.failed}
                        <p class="warning">
                            The extension icon is not an image, this may appear
                            broken in the category list.
                        </p>
                    {/if}
                    {#if !extensionImageStates.icon.square}
                        <p class="warning">
                            The image is not square, this may appear broken in
                            the category list.
                        </p>
                    {/if}
                {/if}
                <h3>Extra Icons</h3>
                <p>
                    Blocks can use their own icons instead of the Extension
                    icon.
                    <br />
                    Add more images here to use them.
                </p>
                <p>
                    <input type="file" accept=".png,.jpg,.jpeg" on:change={extraIconAdded} />
                </p>
                {#if !extensionImageStates.menuicon.loading && !extensionImageStates.menuicon.failed && extensionImageStates.menuicon.image}
                    <img
                        alt="Menu Icon"
                        title="Menu Icon"
                        class="menuIcon"
                        src={extensionImageStates.menuicon.image}
                    />
                {/if}
                {#if extensionImageStates.menuicon.image}
                    {#if extensionImageStates.menuicon.failed}
                        <p class="warning">
                            The menu icon is not an image, this may appear
                            broken.
                        </p>
                    {/if}
                    {#if !extensionImageStates.menuicon.square}
                        <p class="warning">
                            The image is not square, this may appear broken.
                        </p>
                    {/if}
                {/if}
            </div>
            <div class="row-subsubmenus">
                <div class="codeActionsWrapper">
                    <p style="margin-right: 12px"><b>Extension Code</b></p>
                    <StyledButton
                        on:click={() => {
                            // copy code
                            const code =
                                beautifyGeneratedCode(lastGeneratedCode);
                            navigator.clipboard.writeText(code);
                        }}
                    >
                        Copy
                    </StyledButton>
                    <div style="margin-right: 4px" />
                    <StyledButton
                        on:click={() => {
                            // download
                            const code =
                                beautifyGeneratedCode(lastGeneratedCode);
                            const filteredProjectName = projectName.replace(
                                /[^a-z0-9\-]+/gim,
                                "_"
                            );
                            const blob = new Blob([code], {
                                type: "text/javascript;charset=UTF-8",
                            });
                            FileSaver.saveAs(blob, filteredProjectName + ".js");
                        }}
                    >
                        Download
                    </StyledButton>
                </div>
                <div class="codeWrapper">
                    <div class="codeDisplay" key={refreshKey}>
                        {@html displayGeneratedCode(lastGeneratedCode)}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    :root {
        --nav-height: 3rem;
    }
    input[type="file"]::file-selector-button {
        padding: 0.35rem 1.65rem;

        font-size: 0.75rem;
        color: black;
        background: transparent;
        cursor: pointer;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 4px;
    }
    input[type="file"]::file-selector-button:focus,
    input[type="file"]::file-selector-button:hover,
    input[type="file"]::file-selector-button:active {
        background: white;
    }

    :global(body.dark) input[type="file"]::file-selector-button {
        color: #ccc;
        border-color: #c6c6c6;
    }
    :global(body.dark) input[type="file"]::file-selector-button:focus,
    :global(body.dark) input[type="file"]::file-selector-button:hover,
    :global(body.dark) input[type="file"]::file-selector-button:active {
        background: #111;
    }

    :global(body.dark) input[type="text"],
    :global(body.dark) input[type="number"] {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.7);
        color: white;
    }
    :global(body.dark) input[type="text"]:hover,
    :global(body.dark) input[type="number"]:hover {
        background: transparent;
        border: 1px solid dodgerblue;
    }

    .main {
        position: absolute;
        left: 0px;
        top: var(--nav-height);
        width: 100%;
        height: calc(100% - var(--nav-height));

        min-width: 870px;
    }

    .project-name {
        width: 236px;

        font-size: 20px;

        border-radius: 6px;
        outline: 1px dashed rgba(0, 0, 0, 0.15);
        border: 0;
        background: rgba(255, 255, 255, 0.25);
        color: white;

        font-weight: bold;
        font-size: 1rem;
        padding: 0.5rem;
        transition: 0.25s;
    }
    .project-name::placeholder {
        font-weight: normal;
        color: white;
        opacity: 1;
        font-style: italic;
    }
    .project-name:hover {
        background-color: hsla(0, 100%, 100%, 0.5);
        transition: 0.25s;
    }
    .project-name:active,
    .project-name:focus {
        outline: none;
        border: 1px solid hsla(0, 100%, 100%, 0);
        box-shadow: 0 0 0 calc(0.5rem * 0.5) hsla(0, 100%, 100%, 0.25);
        background-color: hsla(0, 100%, 100%, 1);
        color: black;
        transition: 0.25s;
    }

    .project-name[data-invalid="true"] {
        background-color: #a7f464;
        text-decoration: red underline;
    }
    :global(body.dark) .project-name[data-invalid="true"] {
        background-color: #9b0000 !important;
        text-decoration: red underline;
    }

    .extensionIcon {
        width: 96px;
        height: 96px;
        object-fit: contain;
    }

    .menuIcon {
        width: 96px;
        height: 96px;
        object-fit: contain;
    }

    .row-menus {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .row-submenus {
        display: flex;
        flex-direction: column;
        width: 35%;
        height: 100%;
    }
    .row-first-submenus {
        display: flex;
        flex-direction: column;
        width: 65%;
        height: 100%;
    }
    .row-subsubmenus {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 50%;
    }

    .extensionMenuPreview {
        width: 60px;
        cursor: pointer;
        overflow: hidden;
        color: #575e75;
        user-select: none;
    }
    .extensionMenuPreview:hover {
        color: #4c97ff !important;
    }
    .extensionMenuPreview:focus,
    .extensionMenuPreview:active {
        background-color: #e9eef2;
    }
    :global(body.dark) .extensionMenuPreview {
        color: #ccc;
    }
    :global(body.dark) .extensionMenuPreview:focus,
    :global(body.dark) .extensionMenuPreview:active {
        background-color: #1e1e1e;
    }
    .extensionBubbleIcon {
        width: 20px;
        height: 20px;
        background-size: 100%;
        border-radius: 100%;
        margin: 0 auto 0.125rem;
        border: 1px rgba(0, 0, 0, 0.2) solid;
    }
    .extensionBubbleName {
        font-size: 0.65rem;
    }

    .blockMenuButtons {
        position: relative;
        width: 100%;
        height: 48px;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        background: #f9f9f9;
    }
    :global(body.dark) .blockMenuButtons {
        background-color: #111;
    }

    .blocklyWrapper {
        position: relative;
        width: 100%;
        height: calc(100% - 48px);
    }
    .assetsWrapper {
        position: relative;
        width: calc(100% - 16px);
        height: calc(50% - 16px);
        padding: 8px;
        overflow: auto;
    }
    .codeActionsWrapper {
        position: relative;
        width: 100%;
        height: 48px;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        background: #f9f9f9;
    }
    :global(body.dark) .codeActionsWrapper {
        background-color: #111;
    }
    .codeWrapper {
        position: relative;
        width: 100%;
        height: calc(100% - 48px);
    }

    .codeDisplay {
        width: 100%;
        height: 100%;

        border: 0;
        padding: 0;
        overflow: auto;

        background: #f9f9f9;
        white-space: pre-wrap;
        font-family: monospace !important;
    }
    :global(body.dark) .codeDisplay {
        background-color: #111;
    }

    .warning {
        background-color: yellow;
        color: black;
    }
</style>
