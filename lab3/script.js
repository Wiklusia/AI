document.addEventListener("DOMContentLoaded", () => {
    let map;
    let userPosition = null;
//lepiej nie openstreetmap
    // Inicjalizacja mapy
    function initMap() {
        map = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
        }).addTo(map);
    }

    // Pobieranie lokalizacji użytkownika
    document.getElementById('getLocationBtn').addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            alert("Geolokalizacja nie jest wspierana przez Twoją przeglądarkę.");
        }
    });

    function showPosition(position) {
        userPosition = [position.coords.latitude, position.coords.longitude];
        map.setView(userPosition, 13);
        L.marker(userPosition).addTo(map)
            .bindPopup("Twoja lokalizacja: " + userPosition)
            .openPopup();
        alert("Twoja lokalizacja to: " + userPosition);
    }

    // Zgoda na wyświetlanie powiadomień
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    // Pobierz mapę i podziel na puzzle
    document.getElementById('downloadMapBtn').addEventListener('click', downloadAndSplitMap);

    function downloadAndSplitMap() {
        // Eksport mapy jako obraz
        map.once('render', function () {
            map.once('moveend', function () {
                html2canvas(document.getElementById("map")).then(canvas => {
                    splitImageIntoPuzzle(canvas.toDataURL());
                });
            });
            map.invalidateSize();
        });
    }

    function splitImageIntoPuzzle(dataUrl) {
        const puzzleContainer = document.getElementById('puzzle-container');
        const piecesContainer = document.getElementById('pieces-container');
        puzzleContainer.innerHTML = '';
        piecesContainer.innerHTML = '';

        let pieces = [];
        for (let i = 0; i < 16; i++) {
            const piece = document.createElement('img');
            piece.src = dataUrl;
            piece.classList.add('draggable');
            piece.id = 'piece' + i;
            piece.draggable = true;
            piece.style.clipPath = `polygon(${(i % 4) * 25}% ${(Math.floor(i / 4)) * 25}%, ${(i % 4) * 25 + 25}% ${(Math.floor(i / 4)) * 25}%, ${(i % 4) * 25 + 25}% ${(Math.floor(i / 4)) * 25 + 25}%, ${(i % 4) * 25}% ${(Math.floor(i / 4)) * 25 + 25}%)`;

            pieces.push(piece);
        }

        pieces = pieces.sort(() => Math.random() - 0.5); // Mieszanie kawałków

        // Dodaj elementy do kontenerów
        pieces.forEach(piece => {
            const dropzone = document.createElement('div');
            dropzone.classList.add('dropzone');
            puzzleContainer.appendChild(dropzone);
            piecesContainer.appendChild(piece);
        });

        initDragAndDrop();
    }

    function initDragAndDrop() {
        const pieces = document.querySelectorAll('.draggable');
        const dropzones = document.querySelectorAll('.dropzone');

        pieces.forEach(piece => {
            piece.addEventListener('dragstart', dragStart);
            piece.addEventListener('dragend', dragEnd);
        });

        dropzones.forEach(zone => {
            zone.addEventListener('dragover', dragOver);
            zone.addEventListener('drop', dropPiece);
        });
    }

    function dragStart(e) {
        e.dataTransfer.setData('text', e.target.id);
        setTimeout(() => {
            e.target.classList.add('dragging');
        }, 0);
    }

    function dragEnd(e) {
        e.target.classList.remove('dragging');
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dropPiece(e) {
        const pieceId = e.dataTransfer.getData('text');
        const draggedPiece = document.getElementById(pieceId);

        if (e.target.classList.contains('dropzone')) {
            e.target.appendChild(draggedPiece);
        }

        checkPuzzleCompletion();
    }

    function checkPuzzleCompletion() {
        const dropzones = document.querySelectorAll('.dropzone');
        let isComplete = true;

        dropzones.forEach((zone, index) => {
            const piece = zone.querySelector('img');
            if (!piece || piece.id !== `piece${index}`) {
                isComplete = false;
            }
        });

        if (isComplete) {
            new Notification("Gratulacje! Puzzle ułożone.");
        }
    }

    // Inicjalizacja mapy po załadowaniu strony
    initMap();
});
