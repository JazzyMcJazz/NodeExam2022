<script>

    import {cookie_notice_accepted, updateCookieStore} from "../../stores/cookie-store";
    import {navigate} from "svelte-navigator";

    $: accepted = $cookie_notice_accepted;

    function accept() {
        document.cookie = 'cookie_notice_accepted=true';
        updateCookieStore();
    }

</script>

{#if accepted !== 'true'}
    <div class="contents">
        <p>
            This website uses cookies in order to function.
            By continuing to use this website you implicitly agree to the use of cookies
        </p>

        <div class="buttons">
            <div class="button" on:click={accept}>Ok</div>
            <div class="button" on:click={() => navigate('/privacy-policy')}>Privacy Policy</div>
        </div>
    </div>
{/if}

<style>
    .contents {
        background-color: black;
        color: white;
        width: 100%;
        position: fixed;
        bottom: 0;
        text-align: center;
        padding-bottom: 10px;
    }

    p {
        font-size: 0.8em;
        margin-bottom: 10px;
    }

    .buttons {
        display: flex;
        justify-content: center;
    }

    .button {
        color: deepskyblue;
        padding: 1px 5px;
        margin: 0 10px;
    }

    .button:hover {
        cursor: pointer;
        text-decoration: underline;
    }

</style>