<div class="comments">
    {#each comments as comment, i}
    <CommentBubble comment={comment} pointing={pointing} --comment-index={commentStylingStartIndex + i} bind:hasReplyFormID/>
    {#if comment.id == hasReplyFormID}
    <CommentForm {commentsInformation} header={`Replying to ${comment.author}`} bind:hasReplyFormID parentid={comment.id} --comment-index={commentStylingStartIndex + i}/>
    {/if}
    {#if comment.children.length > 0}
    <div class="reply-padding">
    <svelte:self {commentsInformation} bind:hasReplyFormID comments={comment.children} pointing={pointing == "left" ? "right" : "left"} commentStylingStartIndex={commentStylingStartIndex + 10}/>
    </div>
    {/if}
    {/each}
</div>

<script>
    import CommentBubble from "./CommentBubble.svelte";
    import CommentForm from "./CommentForm.svelte";

    export let pointing = "left";
    export let commentsInformation;
    export let comments;
    export let commentStylingStartIndex = 12;
    export let hasReplyFormID = -1;
</script>

<style scoped>
    .reply-padding {
        counter-reset: comment-bgcolor-counter;
        margin: 0;
        padding: 0;
        padding-left: 1.5em;
    }
</style>