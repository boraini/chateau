import Chateau from "./ChateauPrototype.svelte";

const chateau = new Chateau({
    target: document.getElementById("app"),
    props: {
        apiURL: "http://localhost:5173",
        postid: "///",
    }
});

export default chateau;