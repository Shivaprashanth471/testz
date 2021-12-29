import React from 'react';
import ReactDOM from 'react-dom';
import './assets/scss/main.scss';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { Colors } from "./constants";
import { Provider } from "react-redux";
import store from "./store";

const theme = createTheme({
    palette: {
        primary: Colors.primaryPack,
        secondary: Colors.accentPack,
        type: 'light'
    },


    typography: { fontFamily: 'Rubik', allVariants: { color: Colors.accent } },

});

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <App />
            </Provider>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
