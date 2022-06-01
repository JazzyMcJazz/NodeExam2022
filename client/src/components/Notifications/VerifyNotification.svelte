<script>
    import {expireCookie, jwtToken} from "../../stores/cookie-store";

    import {base_url} from "../../stores/general-store";
    import {onMount} from "svelte";

    let showNotification = false;

    onMount(async () => {
        if ($jwtToken) {
            const response = await fetch(`${$base_url}/users/isverified`);

            if (!response.ok)
                expireCookie('jwt');
            else {
                const data = await response.json();

                if (!data.verified)
                    showNotification = true;
            }
        }
    });

</script>

{#if showNotification}
    <div class="contents" class:showNotification>
        <p>A verification email has been sent to your email address. Please verify your account.</p>
        <p class="link">Send new</p>
    </div>
{/if}

<style>
    .contents {
        width: 100%;
        height: 50px;
        background-color: yellow;
        display: flex;
        align-items: center;
        justify-content: space-around;
    }

    .link {
        color: rgb(0,100,200);
    }

    .link:hover {
        cursor: pointer;
        text-decoration: underline;
    }
</style>