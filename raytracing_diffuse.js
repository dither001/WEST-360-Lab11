"use strict";

var canvas;
var gl;
var program;

// point array and color array
var pointsArray = [];
var colorsArray = [];

var world = [];

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    // add positions and colors of points 
    main();

    // Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // push point array and color array in buffers
        //
    //  Load shaders and initialize attribute buffers
    //
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    render();
}

function main() {
    var nx = 500;
    var ny = 500;
    world.push(new sphere(vec3(0, 0, -1), 0.5, new diffuse(vec3(0.4, 0.2, 0.1))));
    world.push(new sphere(vec3(0, -100.5, -2), 100, new diffuse(vec3(1.0, 1.0, 0.0))));
    // Your code goes here:

    var bottomLeft = vec3(-1,-1,-1); // vec3
    var horizontal = vec3(4,0,0);
    var vertical = vec3(0,2,0);
    var origin = vec3(0,0,0);

    for (var j = (ny - 1); j >= 0; j--) {
        for (var i = 0; i < nx; i++) {
            let u = (i/nx);
            let v = (j/ny);

            let r = new ray(origin, add(bottomLeft, add(scale(u, horizontal), scale(v, vertical))));
            let d = r.direction();
            let c = colors(r, world, 0);

            pointsArray.push(vec2(d[0], d[1]));
            colorsArray.push(c);
        }
    }
}

function colors(r, world, depth){
    // add your code here:
    var rec = new hit_record();
    var hit_anything = false;
    var t_max = Number.MAX_VALUE;

    for (var i = 0; i < world.length; ++i) {
        if (world[i].hit(r, 0.0, t_max, rec)) {
            hit_anything = true;
            t_max = rec.getT(); // not sure about this

            var next_ray = rec.getMaterial().get_next_ray(rec);
            if (depth < 50) {
                var m = rec.getMaterial().get_attenuation();
                var n = colors(next_ray, world, depth+1);
                // return vec3(dot(m[0],n[0]), dot(m[1],n[1]), dot(m[2],n[2]));
                return mult(m, n);
            } else {
                return vec3(0.0, 0.0, 0.0);
            }
        }
    }

    if (hit_anything == false) {
        let t = 0.5 * (r.direction()[1] + 1.0);
        return mix(vec3(1.0, 1.0, 1.0), vec3(0.5, 0.7, 1.0), t);        
    }
}

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays( gl.POINTS, 0, pointsArray.length );
}