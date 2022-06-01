<script>
    import {base_url} from "../../stores/general-store";
    import {updateJwtToken} from "../../stores/cookie-store";

    // used to display forms for username/email, password (login) or new account form
    const USERNAME = 'USERNAME', PASSWORD = 'PASSWORD', NEW = 'NEW';
    let screen = USERNAME;

    let username;
    let password;

    async function checkUsername() {
        const response = await fetch(`${$base_url}/users/userexists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
            }),
        });

        if (response.status === 302) {
            screen = PASSWORD;
        } else {
            username = '';
            screen = NEW;
        }
    }

    async function login() {
        const response = await fetch(`${$base_url}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        if (response.ok) updateJwtToken();
        else {

        }

    }

    async function signup() {
        const response = await fetch(`${$base_url}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: username,
                password: password,
            }),
        });

        if (response.ok) {
            updateJwtToken();
        }
    }

</script>

<div class="contents">
    {#if screen === USERNAME}

        <h4>Enter Username or Email</h4>
        <form on:submit|preventDefault={checkUsername}>
            <input type="text" required placeholder="Username or Email" bind:value={username}/>
            <br/>
            <button type="submit">Continue</button>
        </form>
        <div class="back" on:click={() => screen = NEW}>create new account</div>

    {:else if screen === PASSWORD}

        <h4>Enter Password</h4>
        <form on:submit|preventDefault={login}>
            <input type="text" required placeholder="Password" bind:value={password}/><br/>
            <button type="submit">Login</button>
        </form>
        <div class="back" on:click={() => screen = USERNAME}>back</div>

    {:else if screen === NEW}

        <form on:submit|preventDefault={signup}>
            <h4>Create a new account</h4>
            <input type="text" required placeholder="Email" bind:value={username}/><br/>
            <input type="text" required placeholder="Password" bind:value={password}/><br/>
            <br/>
            <button type="submit">Create Account</button>
        </form>
        <div class="back" on:click={() => screen = USERNAME}>back</div>

    {/if}
</div>

<style>
    .contents {
        margin-top: 100px;
        width: 100%;
        text-align: center;
    }

    h4 {
        color: yellowgreen;
    }

    .back {
        color: yellow;
        width: fit-content;
        margin: 0 auto;
    }

    .back:hover {
        cursor: pointer;
    }
</style>