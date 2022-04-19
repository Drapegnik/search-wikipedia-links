import { createRoot } from 'react-dom/client';

const WikepediaLinksView = () => <h1>Hello</h1>;

const container = document.getElementById('root');
const root = createRoot(container); 
root.render(<WikepediaLinksView />);