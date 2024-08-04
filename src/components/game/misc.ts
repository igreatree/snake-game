export type Position = {
    x: number,
    y: number,
    prev?: {x: number, y: number}
};

export type Size = {
    width: number,
    height: number,
};

export const generateRandomPos = (size: {width: number, height: number}, cell: number) => ({
    x: Math.floor(Math.random() * size.width - cell),
    y: Math.floor(Math.random() * size.height - cell),
});

export const checkIntersects = (a: Position, b: Position, admission: number) => {
    return (b.x - admission / 2 <= a.x && a.x <= b.x + admission / 2) && (b.y - admission / 3 <= a.y && a.y <= b.y + admission / 3)
}