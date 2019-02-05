function Missile(p) {

    var self = this;

    this.vx = 0;
    this.vy = 0;
    this.vr = 0;
    this.sw = 1;
    this.sh = 1;
    this.px = p.px;
    this.py = p.py;
    this.pr = p.pr;
    this.va = 9.00;
    this.vf = 0.90;

    this.owner = null;
    this.miss = false;
    this.shot = false;

    this.img = new Image();
    this.img.src = 'missile.png';
    this.enemies = p.enemies || [];
    this.initial = { px: p.px, py: p.py, pr: p.pr };

    this.keys = { u: false, d: false, l: false, r: false, m: false };

    this.img.onload = function (e) { self.sw = e.path[0].width; self.sh = e.path[0].width; };

    this.move = function () {

        this.vx *= this.vf;
        this.vy *= this.vf;
        this.vr *= this.vf;

        this.vx = Math.cos(this.pr * Math.PI / 180) * this.va;
        this.vy = Math.sin(this.pr * Math.PI / 180) * this.va;

        this.px += this.vx;
        this.py += this.vy;
        this.pr += this.vr;

        if (Calc.offscreen(this, Game.display.w, Game.display.h)) {

            var target = this.enemies.length ? this.enemies[0] : { px: 0, py: 0, pr: 0 };

            this.miss = true;
            this.owner.miss(this, target);
            Game.destroy(this, Game.objects.missiles);

        } else {

            for (var i in this.enemies) {

                var dist = Calc.dist(this, this.enemies[i]);

                if (dist.t < 20) {

                    console.log(dist);

                    var obj = this.enemies[i];
                    var init = this.initial;
                    this.miss = false;

                    Game.destroy(this, Game.objects.missiles);
                    this.owner.hit(init, { px: obj.px, py: obj.py, pr: obj.pr });

                }

            }

        }

    };

}