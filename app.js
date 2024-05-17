import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();

let port = 80;
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
    port = 8080;
}

// 현재 파일의 URL에서 디렉토리 경로를 추출
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.redirect('/html/index.html');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
