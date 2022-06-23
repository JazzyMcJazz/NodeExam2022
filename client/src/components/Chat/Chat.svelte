<script>
    import {afterUpdate, beforeUpdate, onDestroy, onMount} from "svelte";
    import {base_url} from "../../stores/general-store";

    export let guild;
    export let showChat;

    let socket;
    let username;
    let messages = [];
    let div;
    let autoscroll;

    onMount(async () => {
        const response = await fetch(`${$base_url}/users/self`);
        const data = await response.json();
        username = data.username;

        socket = io('/chat');
        socket.emit('chat-connect', {username, guild});
        socket.on(guild, data => messages = [...messages, data]);
    });

    onDestroy(() => socket.close());

    beforeUpdate(() => {
        autoscroll = div && (div.offsetHeight + div.scrollTop) > (div.scrollHeight - 20);
    });

    afterUpdate(() => {
        if (autoscroll) div.scrollTo(0, div.scrollHeight);
    });

    function sendMessage(event) {
        if (event.key !== 'Enter') return;

        const text = event.target.value;
        if (!text) return;

        socket.emit(guild, {username, text, guild});
        event.target.value = '';
    }
</script>
    <div class="chat-container">
        <div class="top-bar">
            <span class="close-chat" on:click={() => showChat = !showChat}>close</span>
        </div>
        <div id="messages" bind:this={div}>
            {#each messages as message}
                <div>
                    <div class="chat-sender">{message.username}></div>
                    <div class="chat-message">{message.text}</div>
                </div>
            {/each}
        </div>
        <input class="input" on:keydown={sendMessage}>
    </div>
<style>

    .chat-container {
        height: 45vh;
        width: 350px;
        border: 2px #999999 solid;
        margin: 0 auto 0 auto;
        background-color: white;
    }

    .top-bar {
        width: 100%;
        height: 30px;
        background-color: #282828;
        text-align: right;
    }

    .close-chat {
        color: deepskyblue;
        margin-right: 20px;
    }

    .close-chat:hover {
        cursor: pointer;
        text-decoration: underline;
    }

    #messages {
        background-color: white;
        width: 100%;
        height: calc(45vh - 30px - 24px);
        overflow-y: scroll;
    }

    .chat-sender {
        display: table-cell;
        padding: 10px;
    }

    .chat-message { display: table-cell }

    .input {
        width: 100%;
        height: 24px;
        padding: 0;
    }
</style>