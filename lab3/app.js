document.addEventListener("DOMContentLoaded", () => {
    const locationBtn = document.getElementById("locationBtn");
    const exportBtn = document.getElementById("exportBtn");
    const mapContainer = document.getElementById("map");
    const puzzleBoard = document.getElementById("puzzleBoard");

    let userLocationMarker;
    let map;
    let puzzlePieces = [];
    let isPuzzleCompleted = false;

    function initMap() {
        map = L.map(mapContainer).setView([51.505, -0.09], 13); 

        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 18,
            attribution: '© Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
        }).addTo(map);
    }
    initMap();

    locationBtn.addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showLocation, showError);
        } else {
            alert("Geolokalizacja nie jest wspierana przez tę przeglądarkę.");
        }
    });

    function showLocation(position) {
        const { latitude, longitude } = position.coords;
        alert(`Twoja lokalizacja to: ${latitude}, ${longitude}`);

        if (userLocationMarker) {
            map.removeLayer(userLocationMarker);
        }
        userLocationMarker = L.marker([latitude, longitude]).addTo(map);
        map.setView([latitude, longitude], 13);
    }

    function showError(error) {
        const errors = {
            1: "Prośba o lokalizację została odrzucona.",
            2: "Informacje o lokalizacji są niedostępne.",
            3: "Przekroczono czas żądania lokalizacji.",
            0: "Wystąpił nieznany błąd."
        };
        alert(errors[error.code]);
    }

    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }

    exportBtn.addEventListener("click", () => {
        if (typeof leafletImage === 'undefined') {
            console.error("Leaflet Image plugin nie został załadowany poprawnie.");
            return;
        }

        leafletImage(map, function(err, canvas) {
            if (err) {
                console.error("Błąd podczas generowania obrazu mapy:", err);
                return;
            }
            console.log("Zrobiono zrzut ekranu mapy");
            splitImageIntoPuzzle(canvas);
        });
    });

    function splitImageIntoPuzzle(canvas) {
        const pieceSize = canvas.width / 4;
        puzzlePieces = [];

        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                const piece = document.createElement("div");
                piece.classList.add("puzzle-piece");
                piece.style.backgroundImage = `url(${canvas.toDataURL()})`;
                piece.style.backgroundPosition = `-${x * pieceSize}px -${y * pieceSize}px`;
                piece.style.backgroundSize = `${canvas.width}px ${canvas.height}px`;
                
                piece.draggable = true;
                piece.dataset.x = x;
                piece.dataset.y = y;

                piece.addEventListener("dragstart", dragStart);
                piece.addEventListener("dragover", dragOver);
                piece.addEventListener("drop", drop);

                puzzlePieces.push(piece);
                puzzleBoard.appendChild(piece);
            }
        }

        shufflePuzzle(puzzlePieces);
    }

    function shufflePuzzle(pieces) {
        pieces.sort(() => Math.random() - 0.5);
        puzzleBoard.innerHTML = "";
        pieces.forEach(piece => puzzleBoard.appendChild(piece));
    }

    let draggedPiece = null;

    function dragStart(event) {
        draggedPiece = event.target;
    }

    function dragOver(event) {
        event.preventDefault();
    }

    function drop(event) {
        event.preventDefault();
        if (event.target.classList.contains("puzzle-piece")) {
            const targetPiece = event.target;
            const targetX = targetPiece.dataset.x;
            const targetY = targetPiece.dataset.y;

            const draggedX = draggedPiece.dataset.x;
            const draggedY = draggedPiece.dataset.y;

            [draggedPiece.dataset.x, draggedPiece.dataset.y] = [targetX, targetY];
            [targetPiece.dataset.x, targetPiece.dataset.y] = [draggedX, draggedY];

            const tempBgPos = draggedPiece.style.backgroundPosition;
            draggedPiece.style.backgroundPosition = targetPiece.style.backgroundPosition;
            targetPiece.style.backgroundPosition = tempBgPos;

            checkPuzzleCompletion();
        }
    }

    function checkPuzzleCompletion() {
        const isComplete = puzzlePieces.every(piece => {
            const { x, y } = piece.dataset;
            const pieceWidth = piece.offsetWidth;
            const pieceHeight = piece.offsetHeight;
    
            const expectedPosX = x * pieceWidth;
            const expectedPosY = y * pieceHeight;
    
            const currentPos = piece.getBoundingClientRect();
    
            const isCorrectPosition = 
                Math.abs(currentPos.left - expectedPosX) < 5 &&
                Math.abs(currentPos.top - expectedPosY) < 5;
    
            return isCorrectPosition;
        });
    
        if (isComplete) {
            if (typeof isPuzzleCompleted === "undefined" || !isPuzzleCompleted) {
                isPuzzleCompleted = true;
                if (Notification.permission === "granted") {
                    new Notification("Gratulacje! Puzzle są ułożone.");
                } else {
                    alert("Gratulacje! Puzzle są ułożone.");
                }
            }
        }
    }
});
