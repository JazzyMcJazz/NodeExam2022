<script>
    import {navigate} from "svelte-navigator";

    export let userCount;

    // $: console.log(userCount);
</script>

<footer>
    <div class="empty"></div>
    <div class="copyright">©{new Date().getFullYear()} All Rights Reserved</div>
    <div class="online-indicator">
        {#if userCount}
            <span class="green-dot"></span>
             online users: {userCount}
        {/if}
    </div>
    <div class="privacy-policy" on:click={() => navigate('/privacy-policy')}>Privacy Policy</div>
</footer>

<style>

    .empty { grid-area: left }
    .copyright { grid-area: top }
    .privacy-policy { grid-area: bottom }
    .online-indicator { grid-area: right }

    footer {
        background-color: #585858;
        height: 50px;
        color: white;
        display: grid;
        grid-template-columns: 33.3% auto 33.3%;
        grid-template-areas:
            'left top right'
            'left bottom right';
        font-size: 0.85em;
        margin-top: 50px;
        padding: 0 20px;
        align-items: center;
    }

    div {
        height: fit-content;
    }

    .copyright {
        text-align: center;
    }

    .online-indicator {
        display: flex;
        justify-content: end;
        align-items: center;
    }

    .green-dot {
        background-color: greenyellow;
        width: 5px;
        height: 5px;
        border-radius: 5px;
        margin: 0.35em 5px 0;
    }

    .privacy-policy {
        text-align: center;
        color: lightskyblue;
    }

    .privacy-policy:hover {
        cursor: pointer;
        text-decoration: underline;
    }
</style>