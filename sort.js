const { pipeline } = require('stream');
const fs = require('fs');

let fileName = process.argv[2];
let destPath = process.argv[3];

let fileArray = fileName.split('.');

const readable = fs.createReadStream(fileName);

fs.stat(fileName, (err, stats) => {
    this.fileSize = stats.size;
    this.counter = 1;
    fileArray = fileName.split('.');

    try {
        this.duplicate = destPath.split('.')[0] + "/" + fileArray[0] + '_sortedCopy.' + fileArray[1];
    } catch (e) {
        console.exception('File name is invalid! please pass the proper one');
    }
    const writeable = fs.createWriteStream(this.duplicate || 'output');




    readable.on('error', (e) => {
        console.log("Some error occurred: ", e);
    });

    writeable.on('finish', () => {
        process.stdout.clearLine(); // очистить текущий текст
        process.stdout.cursorTo(0);
    });



    pipeline(
        readable.on('data', (chunk) => {
            let percentageCopied = ((chunk.length * this.counter) / this.fileSize) * 100;
            process.stdout.clearLine(); // очистить текущий текст
            process.stdout.cursorTo(0);
            process.stdout.write(`${Math.round(percentageCopied)}%`);
            this.counter += 1;
        }),
        writeable.on('data', (data) => {
            console.log(data);
        }),
        (err) => {
            err && console.error(err);
        });
});

setTimeout(() => {
    fs.readFile(destPath.split('.')[0] + "/" + fileArray[0] + '_sortedCopy.' + fileArray[1], "utf-8", function(err, data) {
        if (err) return console.log(err);

        let sortedData = data.split('\r\n').sort().join('\r\n');

        fs.writeFileSync(destPath.split('.')[0] + "/" + fileArray[0] + '_sortedCopy.' + fileArray[1], sortedData);
        process.stdout.write("Successfully created the file copy!");

    });
}, 500);