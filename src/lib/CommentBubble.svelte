<div>
    <div class="comment-bubble {pointing == "left" ? "pointing-left" : "pointing-right"}">
        <p>{comment.author} <button on:click={setHasReplyFormID}>Reply</button></p>
        <p>{comment.content}</p>
    </div>
</div>

<script>
    export let comment;
    export let pointing = "left";
    export let bgcolor = "gold";
    export let hasReplyFormID = -1;

    function setHasReplyFormID() {
        hasReplyFormID = comment.id;
    }
</script>

<style scoped>
    .comment-bubble {
        --bgcolor: hsl(calc(15deg * var(--comment-index)), 100%, 85%);
        display: block;
        position: relative;
        margin: 0.5em 1.5em;
        border: 0;
        padding: 0.1em 1em;
        border-radius: 0.8em;
        background-color: var(--bgcolor);
    }

    .comment-bubble::after {
        content: var(--bgcolor);
    }

    .comment-bubble.pointing-left {
        border-top-left-radius: 0;
    }

    .comment-bubble.pointing-right {
        border-top-right-radius: 0;
    }

    .comment-bubble.pointing-left::before {
        position: absolute;
        left: -1em;
        top: 0;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 1em 1em 0;
        border-color: transparent var(--bgcolor) transparent transparent;
        content: "";
    }

    .comment-bubble.pointing-right::before {
        position: absolute;
        right: -1em;
        top: 0;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 0 1em 1em;
        border-color: transparent transparent transparent var(--bgcolor);
        content: "";
    }
</style>