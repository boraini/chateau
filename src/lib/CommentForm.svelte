<form class="comment-form" action={commentsInformation.apiURL + "/comments"} method="POST" bind:this={commentForm} on:submit={postComment}>
    <input name="postid" type="hidden" value={commentsInformation.postid} />
    <input name="parentid" type="hidden" value={parentid == -1 ? "" : parentid} />
    <p>{ header }</p>
    <p>
    <label for="chateau-displayname">Name: </label>
    <input id="chateau-displayname" name="displayname" type="text" />
    </p>
    <p>
    <label for="chateau-email">Email (hashed before storage and used to identify different comments as of the same person): </label>
    <input id="chateau-email" name="email" type="email" value="aaa@bbb.xyz" />
    </p>
    <p>
    <label for="cheateau-content">{#if parentid == -1}Comment: {:else}Reply: {/if}</label>
    <textarea id="chateau-content" name="content"></textarea>
    </p>
    <p><input type="submit" value="Submit" /></p>
    <p><input type="button" value="Cancel" on:click={cancelForm}/></p>
</form>

<script>
    import { CommentErrorType } from "../common/enum.js";

    export let commentsInformation;
    export let parentid = -1;
    export let hasReplyFormID;
    export let header = "Post a comment";
    let commentForm;

    function dispatchCommentFormSubmitted() {
        const event  = new CustomEvent('chateaucommentposted', {
            detail: {
                content: 'comment form submitted'
            }, 
            bubbles: true
        });
        commentForm.dispatchEvent(event);
    }

    function postComment(ev) {
        ev.preventDefault();
        console.log(commentsInformation);
        fetch(commentsInformation.apiURL + "/comments", {
            method: "POST",
            body: new FormData(ev.target)
        }).then(r => r.json()).then(invalidateComment);
    }

    function invalidateComment(serverResponse) {
        console.log(serverResponse);
        if (serverResponse.status == CommentErrorType.ContentMissing) {
            alert("Please enter some text for your comment.");
        } else if (serverResponse.status == CommentErrorType.AuthorMissing) {
            alert("Please enter a non-empty display name and your email.");
        } else {
            alert("Comment was posted successfully!");
            hasReplyFormID = -1;
            dispatchCommentFormSubmitted();
        }
    }

    function cancelForm(ev) {
        ev.preventDefault();
        hasReplyFormID = -1;
    }
</script>

<style scoped>
    .comment-form {
        --bgcolor: hsl(calc(15deg * var(--comment-index)), 100%, 85%);
        display: block;
        margin: 0.5em 1.5em;
        border: 0;
        margin-left: 1.5em;
        padding: 0.1em 1em;
        border-radius: 0.8em;
        background-color: var(--bgcolor);
    }

    .comment-form textarea, .comment-form input {
        display: block;
        width: 100%;
    }

    .comment-form textarea {
        resize: vertical;
    }
</style>