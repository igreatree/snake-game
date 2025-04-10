export type Position = {
    x: number,
    y: number,
    prev?: { x: number, y: number }
};

export type Size = {
    width: number,
    height: number,
};

export const generateRandomPos = (size: { width: number, height: number }, cell: number) => ({
    x: Math.floor(Math.random() * size.width - cell) * (Math.random() > 0.5 ? 1 : -1),
    y: Math.floor(Math.random() * size.height - cell) * (Math.random() > 0.5 ? 1 : -1),
});

export const checkIntersects = (a: Position, b: Position, admission: number) => {
    return (b.x - admission <= a.x && a.x <= b.x + admission) && (b.y - admission <= a.y && a.y <= b.y + admission)
}

interface ISwipeControllerProps {
    up: () => void
    down: () => void,
    right: () => void,
    left: () => void,
}

export const swipeController = ({
    up,
    down,
    right,
    left
}: ISwipeControllerProps) => {
    let xDown = 0;
    let yDown = 0;

    const getTouches = (evt: TouchEvent) => {
        return evt.touches
    }

    const handleTouchStart = (evt: TouchEvent) => {
        const firstTouch = getTouches(evt)[0];
        xDown = firstTouch.clientX;
        yDown = firstTouch.clientY;
    };

    const handleTouchMove = (evt: TouchEvent) => {
        if (!xDown || !yDown) {
            return;
        }

        const xUp = evt.touches[0].clientX;
        const yUp = evt.touches[0].clientY;

        const xDiff = xDown - xUp;
        const yDiff = yDown - yUp;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff > 0) {
                left();
            } else {
                right();
            }
        } else {
            if (yDiff > 0) {
                up();
            } else {
                down();
            }
        }
        xDown = 0;
        yDown = 0;
    };
    return {
        handleTouchStart,
        handleTouchMove
    }
}