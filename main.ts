/** Aleix Rodriguez Muñoz Daw2
 * EL CONVERSOR RURAL - ALCUBILLA DE AVELLANEDA
 */

// --- Constants d'equivalències ---
const PREU_GALLINA = 6;
const PREU_PATATA = 1.33;
const PREU_CABRA = 5;
const PREU_OU = 0.25;
const PREU_CAVALL = 12;

let jugador: Sprite = null;
let mercader: Sprite = null;

function arrodonir_resultat(n: number): number {
    return Math.round(n * 100) / 100;
}

function es_un_animal(id: number): boolean {
    return id === 1 || id === 3 || id === 5;
}

function fer_conversio_rural(id_producte: number, es_producte_a_llenya: boolean) {
    let quantitat = game.askForNumber("Quanta quantitat vols?", 3);

    if (quantitat < 0) {
        game.showLongText("Error: No pots introduir valors negatius.", DialogLayout.Bottom);
        return;
    }

    if (es_un_animal(id_producte) && quantitat % 1 !== 0) {
        game.showLongText("Error: Els animals han de ser sencers.", DialogLayout.Bottom);
        return;
    }

    let preu_base = 0;
    if (id_producte == 1) preu_base = PREU_GALLINA;
    else if (id_producte == 2) preu_base = PREU_PATATA;
    else if (id_producte == 3) preu_base = PREU_CABRA;
    else if (id_producte == 4) preu_base = PREU_OU;
    else if (id_producte == 5) preu_base = PREU_CAVALL;

    if (es_producte_a_llenya) {
        let llenya_total = arrodonir_resultat(quantitat * preu_base);
        game.showLongText("Necessites " + llenya_total + " kg de llenya.", DialogLayout.Center);
    } else {
        let resultat = quantitat / preu_base;
        if (es_un_animal(id_producte)) {
            game.showLongText("Obtens " + Math.floor(resultat) + " animals vius.", DialogLayout.Center);
        } else {
            game.showLongText("Obtens " + arrodonir_resultat(resultat) + " unitats/kg.", DialogLayout.Center);
        }
    }
}

/**
 * Inicialització de l'entorn amb correcció de posició i controls
 */
function inicialitzar_entorn_rural() {
    scene.setBackgroundImage(assets.image`fondo`);

    // 1. Gos groc: Ajustem la Y per posar-lo a la zona taronja del terra
    jugador = sprites.create(assets.image`gos_1`, SpriteKind.Player);
    jugador.y = 105; // Baixa el personatge al terra

    // Animació del gos
    animation.runImageAnimation(jugador, [assets.image`gos_1`, assets.image`gos_2`, assets.image`gos_3`], 200, true);

    // 2. CORRECCIÓ DE CONTROLS: Invertim els valors vx i vy (-100 en lloc de 100)
    // Això farà que si anava al revés, ara vagi correctament
    controller.moveSprite(jugador, -100, -100);

    scene.cameraFollowSprite(jugador);

    // 3. Mercader (Snake): També el baixem al terra
    mercader = sprites.create(assets.image`snake_1`, SpriteKind.Food);
    mercader.y = 105;
    mercader.x = 130;
    animation.runImageAnimation(mercader, [assets.image`snake_1`, assets.image`snake_2`], 400, true);

    game.showLongText("Benvingut a Alcubilla! Camina fins el gos per negociar.", DialogLayout.Top);
}

// Interacció
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    jugador.x -= 25;
    let mode = game.askForNumber("1: Producte a Llenya | 2: Llenya a Producte", 1);
    game.showLongText("1:Gallina, 2:Patata, 3:Cabra, 4:Ous, 5:Cavall", DialogLayout.Bottom);
    let tria = game.askForNumber("Tria producte (1-5):", 1);

    if (tria >= 1 && tria <= 5) {
        fer_conversio_rural(tria, mode == 1);
    }
});

inicialitzar_entorn_rural();