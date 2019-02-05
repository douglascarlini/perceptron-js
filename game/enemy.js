function Enemy(p) {

    var self = this;

    this.vx = 0;
    this.vy = 0;
    this.vr = 0;
    this.sw = 100;
    this.sh = 100;
    this.px = p.px;
    this.py = p.py;
    this.pr = p.pr;
    this.va = 1.00;
    this.vf = 0.89;

    this.miss = false;

    this.dataset = [];
    this.enemies = [];
    this.neuron = null;
    this.trained = false;
    this.img = new Image();
    this.img.src = 'enemy.png';
    this.initial = { x: p.px, y: p.py, r: p.pr };

    this.keys = { u: false, d: false, l: false, r: false, a: false };

    this.img.onload = function (e) { self.sw = e.path[0].width; self.sh = e.path[0].width; };

    this.bind = { mNum: 0, mInt: 7 };

    this.move = function () {

        this.think();

        this.vx *= this.vf;
        this.vy *= this.vf;
        this.vr *= this.vf;

        if (this.keys.u) this.vy -= this.va;
        if (this.keys.d) this.vy += this.va;
        if (this.keys.l) this.vx -= this.va;
        if (this.keys.r) this.vx += this.va;
        if (this.keys.a) (this.bind.mNum > this.bind.mInt) ? this.missile() : null;

        this.px += this.vx;
        this.py += this.vy;
        this.pr += this.vr;
        this.bind.mNum++;

    };

    this.hit = function (params, target) {
        var d = Calc.dist(params, target);
        this.dataset.push({ inputs: [d.x, d.y], output: 1 });
    };

    this.miss = function (params, target) {
        var d = Calc.dist(params, target);
        this.dataset.push({ inputs: [d.x, d.y], output: 0 });
    };

    this.missile = function () {
        var missile = new Missile({ px: this.px, py: this.py, pr: this.pr, enemies: this.enemies });
        Game.objects.missiles.push(missile);
        missile.owner = this;
        this.bind.mNum = 0;
    };

    this.train = function () {

        if (!this.trained && this.dataset.length > 9) {

            if (!this.neuron) {
                this.neuron = new Perceptron();
                this.neuron.init(0.5, 1000);
            }

            this.neuron.train(this.dataset);
            this.trained = true;

        }

        setTimeout(() => { self.train(); }, 3000);

    };

    this.think = function () {

        if (this.trained) {
            for (let i in this.enemies) {
                var d = Calc.dist(this, this.enemies[i]);
                this.neuron.run([d.x * -1, d.y * -1], (o) => { self.keys.a = (o == 1) ? true : false });
            }
        }

    };

}