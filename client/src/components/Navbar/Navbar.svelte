<script>
    import {Link} from "svelte-navigator";
    import {MdMenu} from "svelte-icons/md";
    import {jwtToken} from "../../stores/cookie-store";
    import Sidebar from "../Sidebar/Sidebar.svelte";

    $: isAuthorized = !!$jwtToken;

    export let open = false;
</script>

<Sidebar bind:open/>

<nav id="nav" class="">
    <div class="nav-section left">
        <div on:click={() => open = !open} class="nav-icon"><MdMenu/></div>
    </div>
    <div class="nav-section center">
        <Link to="/"><div class="logo"><div>GW2 Stats</div></div></Link>
    </div>
    <div></div>
</nav>

<style>
    nav {
        top: 0;
        padding: 0 5px;
        display: flex;
        justify-content: space-between;
    }

    .nav-icon {
        display: contents;
        color: white;
    }

    .nav-section {
        display: flex;
        padding: 5px 0;
        max-height: 35px;
        align-items: center;
    }

    .left {
        width: 45px;
    }

    .left:hover {
        cursor: pointer;
    }

    .center {
        margin-left: -45px;
    }

    .logo {
        color: white;
    }
</style>