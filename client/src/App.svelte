<script>
    import {Router, Route} from "svelte-navigator";
    import {swipe} from 'svelte-gestures';
    import Navbar from "./components/Navbar/Navbar.svelte";
    import Home from './pages/Home/Home.svelte'
    import Footer from "./components/Footer/Footer.svelte";
    import NotFound from "./components/NotFound/NotFound.svelte";
    import VerifyNotification from "./components/Notifications/VerifyNotification.svelte";
    import NoApiKeyNotification from "./components/Notifications/NoApiKeyNotification.svelte";
    import API from "./pages/AuthRequired/API.svelte";
    import Account from "./pages/AuthRequired/Account.svelte";
    import {onMount} from "svelte";
    import CookieDisclaimer from "./components/Notifications/CookieDisclaimer.svelte";
    import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy.svelte";
    import Guilds from "./pages/AuthRequired/Guilds.svelte";
    import Guild from "./pages/AuthRequired/Guild.svelte";
    import Wallet from "./pages/AuthRequired/Wallet.svelte";
    import Pvp from "./pages/AuthRequired/Pvp.svelte";

    let userCount;

    onMount( async () => {

        const socket = io();
        socket.on('count', data => userCount = data.count);
    });



    let open = false; // sidebar

    // handles opening the sidebar by swiping on mobile devices
    const swipeOptions = {timeframe: 300, minSwipeDistance: 60, touchAction: 'pan-y'};
    function handleSwipe(e) {
        if (e.detail.direction === 'left') open = false;
        else if (e.detail.direction === 'right') open = true;
    }

</script>

<Router primary={false}>
    <main use:swipe={swipeOptions} on:swipe={handleSwipe}>
        <CookieDisclaimer/>
        <VerifyNotification/>
        <NoApiKeyNotification/>
        <Navbar bind:open/>
        <Route><NotFound/></Route>
        <Route path="/"><Home/></Route>
        <Route path="/apikeys"><API/></Route>
        <Route path="/account"><Account/></Route>
        <Route path="/guilds"><Guilds/></Route>
        <Route path="/guild/:id" let:params><Guild id={params.id}/></Route>
        <Route path="/wallet"><Wallet/></Route>
        <Route path="/pvp"><Pvp/></Route>
        <Route path="/privacy-policy"><PrivacyPolicy/></Route>
    </main>

    <Footer bind:userCount/>
</Router>

<style>

    main {
        min-height: calc(100vh - 100px);
    }
</style>