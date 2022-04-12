import "../styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "redux/store";
import { Provider } from "react-redux";
import AppHydration from "components/AppHydration";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AppHydration preloadedState={pageProps.preloadedState}>
        <Component {...pageProps} />
      </AppHydration>
    </Provider>
  );
}

export default MyApp;
