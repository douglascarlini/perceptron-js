(function () {

    var self = function () {

        this.epocas = 10000;
        this.apredizado = 0.5;
        this.entradas = [{ x: [0, 0], y: 0 }];
        this.ativar = (u) => { return (1 / (1 + Math.exp(-u))); };
        this.pesos = [...this.entradas[0].x.map(i => Math.random())];
        this.ajustar = function (e, x) { x.map((v, i) => { this.pesos[i] += this.apredizado * e * x[i] }); };
        this.testar = function (x) { var u = 0; x.map((v, i) => { u += this.pesos[i] * x[i] }); return this.ativar(u + 1); };

        this.treinar = function (x) {
            for (let epoca = 1; epoca < this.epocas; epoca++) {
                x.map((v, i) => {
                    var valor = this.testar(x[i].x);
                    if (valor != x[i].y) {
                        var erro = x[i].y - valor;
                        this.ajustar(erro, x[i].x);
                    }
                });
            }
        };

    };

    window.Perceptron = self;

})();
