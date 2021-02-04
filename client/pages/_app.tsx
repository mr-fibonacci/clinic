import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "../components/layout/Layout";
import MyNavbar from "../components/navbar/MyNavbar";
import { CurrentUserProvider } from "../components/UserContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <CurrentUserProvider>
        <MyNavbar />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CurrentUserProvider>
    </>
  );
}

export default MyApp;
