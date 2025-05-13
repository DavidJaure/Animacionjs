const { Application, Assets, Graphics, SCALE_MODES, Sprite, Text } = PIXI;

(async () => {
    // Crear la aplicación
    const app = new Application();

    // Inicializar la aplicación
    await app.init({ antialias: true, background: '#1099bb', resizeTo: window });

    // Añadir el lienzo al documento
    document.body.appendChild(app.canvas);

    const stageHeight = app.screen.height;
    const stageWidth = app.screen.width;

    // Asegurarse de que el escenario cubra toda la pantalla
    app.stage.hitArea = app.screen;

    // Crear el slider
    const sliderWidth = 320;
    const slider = new Graphics().rect(0, 0, sliderWidth, 4).fill({ color: 0x272d37 });

    slider.x = (stageWidth - sliderWidth) / 2;
    slider.y = stageHeight * 0.75;

    // Dibujar el control deslizante
    const handle = new Graphics().circle(0, 0, 8).fill({ color: 0xffffff });

    handle.y = slider.height / 2;
    handle.x = sliderWidth / 2;
    handle.eventMode = 'static';
    handle.cursor = 'pointer';

    handle.on('pointerdown', onDragStart).on('pointerup', onDragEnd).on('pointerupoutside', onDragEnd);

    app.stage.addChild(slider);
    slider.addChild(handle);

    // Cargar la imagen
    const texture = await Assets.load('./img/gato.webp');

    // Crear el sprite con la imagen cargada
    const bunny = app.stage.addChild(Sprite.from(texture));

    bunny.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
    bunny.scale.set(1);  // Empezar con la imagen más pequeña (ajustado a 1)
    bunny.anchor.set(0.5);
    bunny.x = stageWidth / 2;
    bunny.y = stageHeight / 2;

    // Título
    const title = new Text({
        text: 'Arrastre el controlador para cambiar la escala de la imagen..',
        style: {
            fill: '#272d37',
            fontFamily: 'Roboto',
            fontSize: 20,
            align: 'center',
        },
    });

    title.roundPixels = true;
    title.x = stageWidth / 2;
    title.y = 40;
    title.anchor.set(0.5, 0);
    app.stage.addChild(title);

    // Evento de clic para permitir la reproducción del audio
    document.body.addEventListener('click', playAudio);

    let audio;

    // Función para reproducir el audio
    function playAudio() {
        if (!audio) {
            audio = new Audio('./audio/AudioGato.mp3');  // Ruta al archivo de audio en la carpeta "audio"
            audio.loop = true;  // Repetir el audio en bucle
            audio.play();  // Reproducir el audio
        }
    }

    // Manejar el inicio del arrastre
    function onDragStart() {
        app.stage.eventMode = 'static';
        app.stage.addEventListener('pointermove', onDrag);
    }

    // Detener el arrastre cuando el control es soltado
    function onDragEnd(e) {
        app.stage.eventMode = 'auto';
        app.stage.removeEventListener('pointermove', onDrag);
    }

    // Función para actualizar la escala de la imagen mientras el control se mueve
    function onDrag(e) {
        const halfHandleWidth = handle.width / 2;

        // Establecer la posición x del control deslizante para que se mueva dentro de los límites
        handle.x = Math.max(halfHandleWidth, Math.min(slider.toLocal(e.global).x, sliderWidth - halfHandleWidth));

        // Normalizar la posición del control entre -1 y 1
        const t = 2 * (handle.x / sliderWidth - 0.5);

        // Ajustar la escala de la imagen con la posición del control deslizante
        bunny.scale.set(1 * (1.1 + t)); // Redefinir el factor de escala para empezar con una imagen más pequeña
    }
})();
