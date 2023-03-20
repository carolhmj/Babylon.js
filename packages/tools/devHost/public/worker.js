let context;
let bitmap;
let width;
let height;
onmessage = (e) => {
    // console.log("Message received from main script");
    // const workerResult = `Result: ${e.data[0] * e.data[1]}`;
    // console.log("Posting message back to main script");
    // postMessage(workerResult);
    const type = e.data.type;
    if (type === "start") {
        console.log('received start message', e.data.canvas, e.data.bitmap);
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
        // console.log('received draw message', positionsList);
        for (let i = 0; i < positionsList.length; i++) {
            const [x, y] = positionsList[i];
            // console.log('positions are', x, y);
            context.drawImage(bitmap, x, y, 25, 25);
        }
    }
    postMessage("done");
};