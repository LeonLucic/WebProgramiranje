let sviFilmovi = [];
let listaGledanja = [];

fetch('/movies.csv')
  .then(res => res.text())
  .then(csv => {
    const rezultat = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true
    });

    sviFilmovi = rezultat.data.map(film => ({
      naslov: film.Naslov,
      zanr: film.Zanr,
      godina: Number(film.Godina),
      trajanje: Number(film.Trajanje_min),
      ocjena: Number(film.Ocjena),
      reziser: film.Rezisery,
      zemlja: film.Zemlja_porijekla
    }));

    popuniZanrove();
    prikaziFilmove(sviFilmovi);
  })
  .catch(err => console.error('Greška kod učitavanja movies.csv:', err));

function popuniZanrove() {
  const select = document.getElementById('filter-zanr');
  const zanrovi = [...new Set(sviFilmovi.map(f => f.zanr))].sort();

  zanrovi.forEach(zanr => {
    const option = document.createElement('option');
    option.value = zanr;
    option.textContent = zanr;
    select.appendChild(option);
  });
}

function prikaziFilmove(filmovi) {
  const tbody = document.querySelector('#filmovi-lv3-tablica tbody');
  tbody.innerHTML = '';

  if (filmovi.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8">Nema filmova za odabrane filtere.</td></tr>';
    return;
  }

  filmovi.forEach((film, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${film.naslov}</td>
      <td>${film.zanr}</td>
      <td>${film.godina}</td>
      <td>${film.trajanje} min</td>
      <td>${film.ocjena}</td>
      <td>${film.reziser}</td>
      <td>${film.zemlja}</td>
      <td><button onclick="dodajUListu(${index})">Dodaj</button></td>
    `;

    tbody.appendChild(row);
  });
}

function filtrirajFilmove() {
  const tekst = document.getElementById('pretraga').value.toLowerCase();
  const zanr = document.getElementById('filter-zanr').value;
  const godina = Number(document.getElementById('filter-godina').value);
  const ocjena = Number(document.getElementById('filter-ocjena').value);

  const filtrirani = sviFilmovi.filter(film => {
    const tekstMatch =
      film.naslov.toLowerCase().includes(tekst) ||
      film.reziser.toLowerCase().includes(tekst);

    const zanrMatch = !zanr || film.zanr === zanr;
    const godinaMatch = !godina || film.godina >= godina;
    const ocjenaMatch = film.ocjena >= ocjena;

    return tekstMatch && zanrMatch && godinaMatch && ocjenaMatch;
  });

  prikaziFilmove(filtrirani);
}

function dodajUListu(index) {
  const film = sviFilmovi[index];

  if (!listaGledanja.some(f => f.naslov === film.naslov)) {
    listaGledanja.push(film);
    osvjeziListu();
  } else {
    alert('Film je već u listi gledanja!');
  }
}

function osvjeziListu() {
  const lista = document.getElementById('lista-filmova');
  const broj = document.getElementById('broj-filmova');

  lista.innerHTML = '';
  broj.textContent = 'Broj filmova: ' + listaGledanja.length;

  listaGledanja.forEach((film, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${film.naslov} (${film.godina})
      <button onclick="ukloniIzListe(${index})">Ukloni</button>
    `;
    lista.appendChild(li);
  });
}

function ukloniIzListe(index) {
  listaGledanja.splice(index, 1);
  osvjeziListu();
}

document.getElementById('pretraga').addEventListener('input', filtrirajFilmove);
document.getElementById('filter-zanr').addEventListener('change', filtrirajFilmove);
document.getElementById('filter-godina').addEventListener('input', filtrirajFilmove);

document.getElementById('filter-ocjena').addEventListener('input', () => {
  document.getElementById('ocjena-vrijednost').textContent =
    document.getElementById('filter-ocjena').value;
  filtrirajFilmove();
});

document.getElementById('reset-filtera').addEventListener('click', () => {
  document.getElementById('pretraga').value = '';
  document.getElementById('filter-zanr').value = '';
  document.getElementById('filter-godina').value = '';
  document.getElementById('filter-ocjena').value = 0;
  document.getElementById('ocjena-vrijednost').textContent = '0';

  prikaziFilmove(sviFilmovi);
});

document.getElementById('potvrdi-listu').addEventListener('click', () => {
  const poruka = document.getElementById('poruka-liste');

  if (listaGledanja.length === 0) {
    poruka.textContent = 'Lista gledanja je prazna.';
  } else {
    poruka.textContent = `Lista gledanja spremljena! Broj filmova: ${listaGledanja.length}`;
    listaGledanja = [];
    osvjeziListu();
  }
});