<section id="comments" class="chateau" bind:this={chateauRoot}>
    <h2 class="header">
        <span class="title">Comments</span>
        <span> powered by</span>
        <a href="https://github.com/boraini/chateau">
            <img class="logo" alt="Chateau" src={colorscheme == "dark" ? logoDark : logoLight} width="100">
        </a>
    </h2>
    {#if hasReplyFormID == -1}
    <CommentForm {commentsInformation} bind:hasReplyFormID parentid={-1} --comment-index={7} />
    {/if}
    <CommentList {commentsInformation} bind:hasReplyFormID comments={comments} />
</section>

<style>
    .chateau {
        font-family: Arial, Helvetica, sans-serif;
    }

    .chateau .header {
        margin: 0 1em;
        display: flex;
        align-items: center;
    }

    .chateau .header span {
        margin: 0 0.5em 0 0;
    }

    .chateau .header .title {
        flex-grow: 1;
    }

    .chateau .header .logo {
        height: 1.5em;
        width: auto;
    }
</style>

<script>
    import CommentList from "./CommentList.svelte";
    import { onMount } from "svelte";
    import CommentForm from "./CommentForm.svelte";
    import logoLight from "../../media/logo-light.svg";
    import logoDark from "../../media/logo-dark.svg";

    export let commentsInformation;
    export let colorscheme = "light";
    let comments = [];
    let hasReplyFormID = -1;
    let chateauRoot;

    function fetchComments() {
        fetch(commentsInformation.apiURL + "/comments?postid=" + commentsInformation.postid).then(r => r.json()).then(cs => comments = cs);
    }

    function onPostComment() {
        fetchComments();
    }

    onMount(function() {
        fetchComments();

        chateauRoot.addEventListener("chateaucommentposted", onPostComment);
    });
</script>