const pieces = document.querySelectorAll('.draggable');
const dropzones = document.querySelectorAll('.dropzone');

// Obsługa przeciągania
pieces.forEach(piece => {
    piece.addEventListener('dragstart', dragStart);
    piece.addEventListener('dragend', dragEnd);
});

dropzones.forEach(zone => {
    zone.addEventListener('dragover', dragOver);
    zone.addEventListener('drop', dropPiece);
});

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
        if (validatePiece(draggedPiece, e.target)) {
            e.target.appendChild(draggedPiece);
            e.target.classList.add('correct');
        } else {
            e.target.classList.add('wrong');
            setTimeout(() => e.target.classList.remove('wrong'), 1000);
        }
    }
}

// Prosta funkcja sprawdzająca poprawność
function validatePiece(piece, dropzone) {
    // Przykład - dopasowanie ID puzzla do ID dropzone
    return piece.id === `piece${dropzone.id.charAt(dropzone.id.length - 1)}`;
}
