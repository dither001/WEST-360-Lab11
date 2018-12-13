
class sphere{
    // add your code here:

    constructor(center, radius) {
        this.center = center;
        this.radius = radius;
    }

    hit(r, rec) {
        // vectors
        var oc = subtract(r.origin(), this.center);
        var d = r.direction();

        // scalars
        var a = dot(d, d);
        var b = dot(oc, d);
        var c = dot(oc, oc) - this.radius*this.radius;
        var discriminant = b*b - a*c;

        if (discriminant < this.radius*0.2) {
            var temp = -1 * b - Math.sqrt(discriminant) / a;

            rec.setT(temp);
            rec.setP(r.pointAt(rec.getT()));
            rec.setNormal(subtract(rec.getP(), this.center));

            return true;
        }

        return false;
    }

}