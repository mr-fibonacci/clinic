import "bootstrap/dist/css/bootstrap.min.css";
import MyNavbar from "../components/navbar/MyNavbar";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <MyNavbar />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
