import { Position } from "./misc";

type tAppleType = "default" | "gold"

export interface tApplePosition extends Position {
    type: tAppleType
}

export interface IAppleProps {
    pos: tApplePosition[],
    size: number,
}

export const Apple = ({pos, size} : IAppleProps) => ({
    x: 0, y: 0,
    draw(ctx: CanvasRenderingContext2D){
        pos.forEach((p: tApplePosition) => {
            ctx.beginPath();
            // coloring
            switch (p.type) {
                case "default":
                    ctx.fillStyle = "#cd5c76";
                    ctx.rect(p.x, p.y, size, size);
                    break;
                case "gold":
                    ctx.fillStyle = "#ffe12d";
                    ctx.rect(p.x, p.y, size*2, size*2);
                    break;
            }

            ctx.fill();
            ctx.closePath();
        })
    }
})