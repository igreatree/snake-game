import { useEffect, useState } from 'react';
import { Game } from './components/game'
import { Size } from './components/game/misc';

function App() {
    const [size, setSize] = useState<Size | null>(null);
    useEffect(() => {
        if(window) setSize({
            width: Math.floor(window.innerWidth / 2),
            height: Math.floor(window.innerHeight / 2),
        });
    }, []);

    if(!size) return;

    return <Game size={size} />
}

export default App
