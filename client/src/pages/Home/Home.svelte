<script>
    import {expireCookie, jwtToken} from "../../stores/cookie-store";
    import Auth from "../Auth/Auth.svelte";
    import {base_url, hasKeys} from "../../stores/general-store";
    import {Link} from "svelte-navigator";

    let username = '';
    let dataLoaded = false;

    $: if ($jwtToken)
        loadData();

    async function loadData() {
        const response = await fetch(`${$base_url}/users/self`);

        if (!response.ok) {
            expireCookie('jwt');
            return;
        }

        const data = await response.json();
        if (data.username)
            username = data.username;

        dataLoaded = true;
    }

</script>
    {#if $jwtToken}
        {#if dataLoaded}
            <div class="contents">
                <h2>Welcome {username}</h2>

                <div class="quick-access">
                    <h4>Quick Access</h4>

                    <div class="links">
                        <Link to="/apikeys"><div class="link">My API keys</div></Link>
                        {#if $hasKeys}
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Link to="/account"><div class="link">Account Info</div></Link>
                        {/if}
                    </div>
                </div>

            </div>

        {/if}
    {:else}
        <Auth/>
    {/if}

<style>
    .contents {
        width: 100%;
        text-align: center;
        margin: 50px 0 0 0;
        color: white;
    }

    .quick-access {
        margin-top: 100px;
    }

    .links {
        display: flex;
        justify-content: center;
    }

    .link {
        color: deepskyblue;
    }
</style>