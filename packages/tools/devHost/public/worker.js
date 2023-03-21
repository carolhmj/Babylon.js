let context;
let bitmap;
let width;
let height;
onmessage = (e) => {
    const type = e.data.type;
    if (type === "start") {
        context = e.data.canvas.getContext('2d');
        bitmap = e.data.bitmap;
        width = e.data.width;
        height = e.data.height;
    } else if (type === "draw") {
        if (!context || !bitmap) {
            console.error('context or bitmap is not initialized');
            return;
        }
        context.clearRect(0, 0, width, height);
        const positionsList = e.data.positionsList;
        for (let i = 0; i < positionsList.length; i++) {
            const [x, y] = positionsList[i];
            context.drawImage(bitmap, x, y, 25, 25);
        }
    }
    postMessage("done");
};