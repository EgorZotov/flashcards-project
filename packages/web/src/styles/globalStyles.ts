import { createGlobalStyle } from 'styled-components';
import RobotoRegular from 'styles/fonts/Roboto-Regular.ttf';
import RobotoBold from 'styles/fonts/Roboto-Bold.ttf';
import 'normalize.css';

export const GlobalStyles = createGlobalStyle`
    @font-face {
        font-family: 'Roboto';
        src: url(${RobotoRegular});
        font-style: normal;
        font-weight: 400;
    }
    @font-face {
        font-family: Roboto;
        src: url(${RobotoBold});
        font-weight: 700;
        font-style: normal;
    }
    body {
        font-family: 'Roboto';
        font-size: 50px;
        font-style: normal;
    }
`;
