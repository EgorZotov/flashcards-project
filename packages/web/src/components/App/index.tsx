import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Sign from 'pages/Sign';

import { ThemeProvider } from 'styled-components';
import Themes from 'styles/themes';
import { GlobalStyles } from 'styles/globalStyles';

const App = () => {
    const [theme, setTheme] = useState<string>('dark');
    return (
        <ThemeProvider theme={Themes[theme]}>
            <GlobalStyles />
            <Switch>
                <Route path='/'>
                    <Sign />
                </Route>
            </Switch>
        </ThemeProvider>
    );
};

export default App;
