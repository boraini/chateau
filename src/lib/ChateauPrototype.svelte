<div class="container">
<form id="comment-form" action="/comments" method="POST" bind:this={commentForm} on:submit={postComment}>
    <p id="status" bind:this={statusContainer}></p>
    <input name="postid" type="hidden" value={postid} />
    <input name="parentid" type="hidden" />
    <p>Name: </p>
    <input name="displayname" type="text" />
    <p>Email: </p>
    <input name="email" type="email" value="aaa@bbb.xyz" />
    <p>Comment: </p>
    <textarea name="content"></textarea>
    <input type="submit" />
</form>
<button on:click={fetchComments}>Fetch Comments</button>
<div id="comments" bind:this={commentsContainer}></div>
</div>

<style>
    html, head {
        width: 100%;
        height: 100%;
        background-color: grey;
    }
    .container {
        max-width: 800px;
        margin: 2em auto;
        background-color: white;
    }
    form * {
        width: 100%;
        display: block;
        margin: 1em 0;
    }

    .comment {
        margin: 1em 0;
    }

    .comment-children {
        border-width: 0 0 0 1px;
        border-style: solid;
        border-color: black;
        margin: 1em 0;
        padding: 0;
        padding-left: 0.5em;
    }
</style>

<script>
    import { onMount } from "svelte";

    let commentForm, commentsContainer, statusContainer;

    export let apiURL;
    export let postid;

    function fetchComments() {
        fetch(apiURL + "/comments?postid=" + postid).then(r => r.json()).then(function(nodes) {
            commentsContainer.innerHTML = "";
            commentsContainer.appendChild(renderCommentChildren(nodes));
        });
    }

    function renderComment(node) {
        const mainEl = document.createElement("div");
        mainEl.className = "comment";

        const headerEl = document.createElement("p");
        headerEl.className = "comment-header";
        headerEl.innerHTML = node.author + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + node.date;

        const contentEl = document.createElement("p");
        contentEl.innerHTML = node.content;
        contentEl.className = "comment-body";

        const replyButton = document.createElement("button");
        replyButton.innerHTML = "Reply";
        const replyID = node.id;
        replyButton.onclick = e => setCommentParent(replyID);
        headerEl.appendChild(replyButton);

        mainEl.appendChild(headerEl);
        mainEl.appendChild(contentEl);

        if (node.children.length > 0)
            mainEl.appendChild(renderCommentChildren(node.children));
        
        return mainEl;
    }

    function renderCommentChildren(nodes) {
        const frag = document.createElement("div");
        frag.className = "comment-children";

        for (const node of nodes) {
            frag.appendChild(renderComment(node));
        }

        return frag;
    }

    function postComment(ev) {
        ev.preventDefault();
        fetch(apiURL + "/comments", {
            method: "POST",
            body: new FormData(ev.target)
        }).then(r => r.json()).then(ret => {
            statusContainer.innerHTML = ret.status;
            setCommentParent("");
        });
    }

    function setCommentParent(n) {
        commentForm.elements["parentid"].value = n;
    }
    
    onMount(fetchComments);
</script>