<script>
    import {expireCookie, jwtToken} from "../../stores/cookie-store";
    import {Link, navigate} from "svelte-navigator";
    import {MdArrowForward} from "svelte-icons/md";
    import {hasKeys} from "../../stores/general-store";

    export let open = true;
    $: opaque = open;

    $: isAuthenticated = !!$jwtToken;

    const close = () => open = false;

    // ensure the bottom elements in the sidebar don't get hidden behind browser interface
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    $: open ? disableScroll() : enableScroll();

    function disableScroll() {
        // Get the current page scroll position
        let scrollTop = window.scrollY || document.documentElement.scrollTop;
        let scrollLeft = window.scrollX || document.documentElement.scrollLeft;

        // if any scroll is attempted, set this to the previous value
        window.onscroll = function() {
            window.scrollTo(scrollLeft, scrollTop);
        };
    }

    function enableScroll() {
        window.onscroll = function() {};
    }
</script>

<aside id="sidebar" class:open>
    <div class="container">
        <div class="top">
        <div class="title">
            <div></div>
            <div class="left white">
                <h3>MENU</h3>
            </div>

            <div class="right" on:click={close}>
                <span class="cross1 line"></span>
                <span class="cross2 line"></span>
            </div>
        </div>

        {#if isAuthenticated}
            <div class="menu-items">
                <Link to="/apikeys" on:click={close}>
                    <div class="menu-item">
                        <div class="item-title">API Key</div>
                        <div class="icon"><MdArrowForward/></div>
                    </div>
                </Link>

                {#if $hasKeys}
                    <Link to="/account" on:click={close}>
                        <div class="menu-item">
                            <div class="item-title">Account Info</div>
                            <div class="icon"><MdArrowForward/></div>
                        </div>
                    </Link>
                    <Link to="/guilds" on:click={close}>
                        <div class="menu-item">
                            <div class="item-title">Guilds</div>
                            <div class="icon"><MdArrowForward/></div>
                        </div>
                    </Link>
                    <Link to="/wallet" on:click={close}>
                        <div class="menu-item">
                            <div class="item-title">Wallet</div>
                            <div class="icon"><MdArrowForward/></div>
                        </div>
                    </Link>
                    <Link to="/pvp" on:click={close}>
                        <div class="menu-item">
                            <div class="item-title">PvP</div>
                            <div class="icon"><MdArrowForward/></div>
                        </div>
                    </Link>
                {/if}
            </div>
        {/if}
        </div>

        <div class="auth">
            {#if isAuthenticated}
                <div on:click={() => {expireCookie('jwt'); close(); navigate('/')}} class="logout">Logout</div>
            {/if}
        </div>
    </div>

</aside>
<aside id="opaque" class:opaque on:click={close}></aside>

<style>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100vh; /* Fallback */
        height: calc(var(--vh, 1vh) * 100);
    }

    .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 10px;
    }

    h3 {
        margin: 0;
    }

    aside {
        left: -100%;
        top: 0;
        z-index: 999;
        background-color: #000000;
        color: white;
        position: fixed;
        height: 100vh;
    }

    .open {
        left: 0 !important;
    }

    #sidebar {
        width: 200px;
        max-width: 50%;
        transition: left 0.3s ease-in-out;

    }

    .left, .right {
        display: flex;
        align-items: center;
    }

    .right {
        margin-right: 10px;
    }

    .right:hover {
        cursor: pointer;
    }

    .line {
        width: 3px;
        background-color: white;
        height: 1.5em;
        margin: -1px -3px 0 0;
    }

    .cross1 {
        transform: rotate(45deg);
    }

    .cross2 {
        transform: rotate(-45deg);
    }

    .menu-items {
        margin-top: 50px;
    }

    .menu-item {
        display: flex;
        height: 20px;
        object-fit: contain;
        justify-content: space-between;
        margin: 6px 20px;
        color: white;
    }

    .menu-item:hover {
        color: deepskyblue;
    }

    .icon {
        margin-right: 5px;
    }

    .auth {
        font-weight: bold;
        text-align: center;
        margin-bottom: 20px;
    }

    .white {
        color: white;
    }

    .logout:hover {
        cursor: pointer;
        color: deepskyblue;
    }

    .opaque {
        left: 0;
        width: 100%;
        background-color: rgb(0, 0, 0, 0.5) !important;
        z-index: 998;
        overflow: hidden;
    }

    #opaque {
        background-color: rgb(0 ,0 , 0, 0);
        transition: background-color 0.3s ease-in-out;
    }

</style>