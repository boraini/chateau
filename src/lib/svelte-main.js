import Chateau from "./Chateau.svelte";

const chateau = new Chateau({
    target: document.getElementById("app"),
    props: {
        commentsInformation: {
            apiURL: "http://localhost:5173",
            postid: "///",
        },
        colorscheme: "light"
    }
});

export default chateau;