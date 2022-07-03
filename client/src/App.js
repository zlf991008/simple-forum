// routes
import Routes from './routes/Routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';

// context
import CurrentUserProvider from './context/CurrentUserProvider';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <CurrentUserProvider>
      <ThemeProvider>
        <ScrollToTop />
        <BaseOptionChartStyle />
        <Routes />
      </ThemeProvider>
    </CurrentUserProvider>
  );
}
