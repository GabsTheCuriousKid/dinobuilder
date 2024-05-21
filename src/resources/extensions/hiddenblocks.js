/*
    Title: Hidden Blocks
    Description: View blocks that have been hidden from the main toolbox.
*/

const hiddenblocksxml = `
<category name="Hidden Blocks" colour="#FF0000">
    <block type="blocks_createcap" />
    <sep gap="48"></sep>
    <block type="functions_inline">
        <statement name="FUNC">
            <block type="functions_return" />
        </statement>
    </block>
</category>
`

export default hiddenblocksxml;