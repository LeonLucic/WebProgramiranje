const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/grafikon', (req, res) => {
    res.render('grafikon');
});

app.get('/slike', (req, res) => {
    const folderPath = path.join(__dirname, 'public', 'images');
    let localImages = [];

    if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath);
        const extensions = ['.jpg', '.jpeg', '.png', '.svg', '.webp'];

        localImages = files.filter(function(file) {
            const lower = file.toLowerCase();
            return extensions.some(function(ext) { return lower.endsWith(ext); });
        });
    }

    let images;

    if (localImages.length > 0) {
        images = localImages.map(function(file, index) {
            return {
                url: '/images/' + file,
                id: 'slika' + (index + 1),
                title: 'Slika ' + (index + 1)
            };
        });
    } else {
        const dataPath = path.join(__dirname, 'images.json');
        try {
            const rawData = fs.readFileSync(dataPath, 'utf8');
            images = JSON.parse(rawData);
        } catch (err) {
            console.error("Greška pri čitanju images.json:", err);
            images = []; 
        }
    }

    res.render('slike', { images: images });
});

app.listen(PORT, function() {
    console.log('Server pokrenut na portu: ' + PORT);
});
