<script>
    import {checkApiKeys, hasKeys} from "../../stores/general-store";
    import {Link} from "svelte-navigator";
    import {onMount} from "svelte";

    $: showNotification = !$hasKeys;

    onMount(async () => {
        await checkApiKeys();
    });

</script>

{#if showNotification}
    <div class="contents" class:showNotification>
        <p>You need to add a Guild Wars 2 API key to your account before you can use this service!</p>
        <Link to={'/apikeys'}>My Keys</Link>
    </div>
{/if}

<style>
    .contents {
        width: 100%;
        height: 50px;
        background-color: darkred;
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
</style>