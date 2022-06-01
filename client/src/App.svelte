<script>
    import {Router, Route} from "svelte-navigator";
    import {swipe} from 'svelte-gestures';
    import Navbar from "./components/Navbar/Navbar.svelte";
    import Home from './pages/Home/Home.svelte'
    import Profile from "./pages/Profile/Profile.svelte";
    import Footer from "./components/Footer/Footer.svelte";
    import NotFound from "./components/NotFound/NotFound.svelte";
    import VerifyNotification from "./components/Notifications/VerifyNotification.svelte";
    import NoApiKeyNotification from "./components/Notifications/NoApiKeyNotification.svelte";
    import API from "./pages/API/API.svelte";

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
        <VerifyNotification/>
        <NoApiKeyNotification/>
        <Navbar bind:open/>
        <Route><NotFound/></Route>
        <Route path="/"><Home/></Route>
        <Route path="/apikeys"><API/></Route>
        <Route path="/profile"><Profile/></Route>
    </main>

    <Footer/>
</Router>

<style>

    main {
        min-height: calc(100vh - 100px);
    }
</style>