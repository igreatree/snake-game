export const Snake = (size: number) => ({
    data: {
        pos: [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}],
        // pos: [{x: -700, y: 0}, {x: -700, y: 0}, {x: -700, y: 0}, {x: -700, y: 0}, {x: -700, y: 0}],
        // pos: [{x: 0, y: -400}, {x: 0, y: -400}, {x: 0, y: -400}, {x: 0, y: -400}, {x: 0, y: -400}],
        score: 0,
    },
    x: 0, y: 0,
    draw(ctx: CanvasRenderingContext2D){
        for(let index = this.data.pos.length - 1; index >= 0; index--) {
            const p = this.data.pos[index];
            ctx.beginPath();
            ctx.rect(p.x, p.y, size, size);
            // coloring
            index % 2 === 0 ? ctx.fillStyle = "#0fa334" : ctx.fillStyle = "#0cc339";
            if(index === 0) ctx.fillStyle = "#225c30";

            ctx.fill();
            ctx.closePath();
        }
        // this.data.pos.forEach((p: Position, index: number) => {
        //     ctx.beginPath();
        //     ctx.rect(p.x, p.y, size, size);
        //     // coloring
        //     index % 2 === 0 ? ctx.fillStyle = "#0fa334" : ctx.fillStyle = "#0cc339";
        //     if(index < 4) ctx.fillStyle = "#225c30";

        //     ctx.fill();
        //     ctx.closePath();
        // })
    }
})