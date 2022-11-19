<section id="comments" class="chateau">
    <h2 class="header"><span class="title">Comments</span><span> powered by</span><img class="logo" src={colorscheme == "dark" ? logoDark : logoLight} width="100"></h2>
    {#if hasReplyFormID == -1}
    <CommentForm {commentsInformation} bind:hasReplyFormID parentid={-1} --comment-index={7} />
    {/if}
    <CommentList {commentsInformation} bind:hasReplyFormID comments={comments} />
</section>

<style>
    .chateau {
        font-family: Arial, Helvetica, sans-serif;
    }

    .header {
        margin: 0 1em;
        display: flex;
        align-items: center;
    }

    .header span {
        margin: 0 0.5em 0 0;
    }

    .header .title {
        flex-grow: 1;
    }

    .header .logo {
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

    function fetchComments() {
        fetch(commentsInformation.apiURL + "/comments?postid=" + commentsInformation.postid).then(r => r.json()).then(cs => comments = cs);
    }

    onMount(function() {
        fetchComments();
    });
</script>