var app = {
    inicio: function () {
        DIAMETRO_BOLA = 50;
        dificultadBola = 170;
        dificiltadBase = 0.1;
        velocidadX = 0;
        velocidadY = 0;
        vida = 3;
        nivel = 0;

        alto = document.documentElement.clientHeight;
        ancho = document.documentElement.clientWidth;

        app.vigilaSensores();
        app.iniciaJuego();
    },

    iniciaJuego: function () {

        function preload() {
            game.physics.startSystem(Phaser.Physics.ARCADE);

            game.stage.backgroundColor = '#f27d0c';
            game.load.image('bola', 'assets/bola.png');
            game.load.image('base', 'assets/base.png');
        }

        function create() {
            vidaText = game.add.text(16, 16, "Vidas: " + vida, {fontSize: '20px', fill: '#757676'});
            levelText = game.add.text(window.innerWidth - 84, 16, "Nivel: " + nivel, {fontSize: '20px', fill: '#757676'});
            gameOverText = game.add.text(16, 46, "", {fontSize: '20px', fill: '#17676'});

            base = game.add.sprite(app.inicioX(), window.innerHeight - 26, 'base');
            bola = game.add.sprite(app.inicioX(), 4, 'bola');

            game.physics.arcade.enable(bola);
            game.physics.arcade.enable(base);

            bola.body.collideWorldBounds = true;
            bola.body.onWorldBounds = new Phaser.Signal();

            base.body.collideWorldBounds = true;
            base.body.onWorldBounds = new Phaser.Signal();
            bola.body.onWorldBounds.add(app.decrementaPuntuacion, this);
        }

        function update() {
            if (vida > 0) {

                //Dificultad del movimiento de la base
                var factorDificultadBase = (300 + (dificiltadBase * 100));

                //Velicidad de la bola
                bola.body.velocity.y = (dificultadBola);

                // Velocidad a la que se mueve la base. A mas nivel, mas velocidad
                base.body.velocity.x = (velocidadX * (-1 * factorDificultadBase));

                //Tamaño mínimo de la base
                if (base.width > 10) {
                    base.width = 200 - nivel * 18;
                }

                //Comprueba que la bola toca la base para subir el nivel
                game.physics.arcade.overlap(bola, base, app.subeNivel, null, this);
            }

        }

        var estados = {preload: preload, create: create, update: update};
        var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser', estados);
    },

    decrementaPuntuacion: function () {
        if (vida > 1) {
            vida = vida - 1;
            vidaText.text = "Vidas: " + vida;
            base.body.x = app.inicioX();
            bola.body.y = 4;
            bola.body.x = app.inicioX();
        } else {
            gameOverText.text = "Has perdido, agita y vuelve a jugar!";
            vidaText.text = "Vidas: " + 0;
            dificultadBola = 0;
            bola.body.y = 80;
        }

    },

    subeNivel: function () {
        nivel += 1;
        levelText.text = "Nivel: " + nivel;

        base.body.x = app.inicioX();
        bola.body.x = app.inicioX();
        bola.body.y = 4;

        if (nivel <= 10) {
            dificultadBola += 40;
            dificiltadBase += 0.4;
        }

        if (nivel === 11) {
            dificultadBola += 80;
        }

        if (nivel === 12) {
            dificultadBola += 100;
        }

        if (nivel === 13) {
            dificultadBola += 110;
        }


    },

    inicioX: function () {
        return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA);
    },

    inicioY: function () {
        return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA);
    },

    numeroAleatorioHasta: function (limite) {
        return Math.floor(Math.random() * limite);
    },

    vigilaSensores: function () {
        function onError() {
            console.log('onError!');
        }
        function onSuccess(datosAceleracion) {
            app.detectaAgitacion(datosAceleracion);
            app.registraDireccion(datosAceleracion);
        }
        navigator.accelerometer.watchAcceleration(onSuccess, onError, {
            frequency: 10
        });
    },

    detectaAgitacion: function (datosAceleracion) {
        agitacionX = datosAceleracion.x > 10;
        agitacionY = datosAceleracion.y > 10;
        if (agitacionX || agitacionY) {
            setTimeout(app.recomienza, 1000);
        }
    },

    recomienza: function () {
        document.location.reload(true);
    },

    registraDireccion: function (datosAceleracion) {
        velocidadX = datosAceleracion.x;
        velocidadY = datosAceleracion.y;
    }
};

if ('addEventListener'in document) {
    document.addEventListener('deviceready', function () {
        app.inicio();
    }, false);
}
