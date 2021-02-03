import "bootstrap/dist/css/bootstrap.min.css";
import MyNavbar from "../components/navbar/MyNavbar";
import { CurrentUserProvider } from "../components/UserContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <CurrentUserProvider>
        <MyNavbar />
        <Component {...pageProps} />
      </CurrentUserProvider>
    </>
  );
}

export default MyApp;
