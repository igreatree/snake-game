import { Position } from "./misc";

export const Snake = (size: number) => ({
    data: {
        pos: [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}],
        score: 0,
    },
    x: 0, y: 0,
    draw(ctx: CanvasRenderingContext2D){
        this.data.pos.forEach((p: Position, index: number) => {
            ctx.beginPath();
            ctx.rect(p.x, p.y, size, size);
            // coloring
            index % 2 === 0 ? ctx.fillStyle = "#0fa334" : ctx.fillStyle = "#0cc339";
            if(index < 4) ctx.fillStyle = "#225c30";

            ctx.fill();
            ctx.closePath();
        })
    }
})