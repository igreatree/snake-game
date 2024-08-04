import { Position } from "./misc";

export const MotionController = (direction: Position, speed: number) => {
    const onKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
            case "ArrowUp":
            case "w":
                if(direction.y === speed) return
                direction = {x: 0, y: -speed};
                break;
            case "ArrowDown":
            case "s":
                if(direction.y === -speed) return
                direction = {x: 0, y: speed};
                break;
            case "ArrowLeft":
            case "a":
                if(direction.x === speed) return
                direction = {x: -speed, y: 0};
                break;
            case "ArrowRight":
            case "d":
                if(direction.x === -speed) return
                direction = {x: speed, y: 0};
                break;
        }
    }

    return {direction, onKeyDown}
}