onmessage = (e) => {
    console.log("Message received from main script");
    // const workerResult = `Result: ${e.data[0] * e.data[1]}`;
    // console.log("Posting message back to main script");
    // postMessage(workerResult);
    const context = e.data.canvas.getContext('2d');
    const bitmap = e.data.bitmap;
    context.drawImage(bitmap, 0, 0, 512, 512);
    postMessage("done");
};