'use strict';

const port = 8888;
const folder = 'public';
const stepNames = ['mice', 'tile'];

const serve = require('./lib/serve');
serve.start(folder, port);

const students = require('./lib/students')(stepNames, folder);

let times = 0;

const promises = [];
for (let student in students) {
    let files = students[student].files;
    console.log(`${student} --- ${Object.keys(files)}`);
    for (let file in files) {
        let promise = new Promise(function (resolve, reject) {
            setTimeout(resolve, 10000 * times++);
        })
        .then(() => {
            return require(`./lib/assertions/${file}`)(`http://localhost:${port}/${student}/${file}.html`);
        })
        .then((score) => {
            files[file] = score;
            students[student].score += score;
        });

        promises.push(promise);
    }
}

console.time('solve');

Promise
.all(promises)
.then(() => {
    console.timeEnd('solve');
    console.log('\n');
    console.log(students);
})
.catch((error) => {
    console.error(`${error}\n ${error.stack}`);
})
.then(() => {
    process.exit();
});
