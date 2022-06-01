<script>
    import {jwtToken} from "../../stores/cookie-store";
    import Auth from "../Auth/Auth.svelte";

</script>
    {#if $jwtToken}
        <div>Hello</div>
    {:else}
        <Auth/>
    {/if}

<style>

</style>