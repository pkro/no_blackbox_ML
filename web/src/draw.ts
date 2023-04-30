const draw: any = {};
draw.path = (ctx: CanvasRenderingContext2D, path: Array<[number, number]>, color="black") => {
    ctx.strokeStyle=color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(...path[0]); // spread because the path items are arrays themselves

    for (let i = 1; i < path.length; i++) {
        ctx.lineTo(...path[i]);
    }
    ctx.stroke();

}
