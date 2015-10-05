function GradientShader(){
		this.uniforms = THREE.UniformsUtils.merge([
			{
				"texture"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null },

			}
		]);

		this.vertexShader = [

			"varying vec2 vUv;",
			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n");
		
		this.fragmentShader = [
			
			"uniform sampler2D texture;",
			"uniform vec2 resolution;",
			"uniform vec2 mouse;",
			"uniform float time;",
			"varying vec2 vUv;",

			"void main(){",
			"	vec2 uv = vUv;",
			"	if(mod(gl_FragCoord.x, 0.03) == 0.0){",
			"		if(mod(gl_FragCoord.y, 0.03) == 0.0){",
			// "			gl_FragColor = vec4(uv,0.5+0.5*sin(time),1.0);",
			"			gl_FragColor = texture2D(texture, uv);",
			"		}",
			"	}",
			"}"
		
		].join("\n");
}