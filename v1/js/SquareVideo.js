function SquareVideo(){
    this.canvas, this.ctx;
    this.lineWidth = 1.0;
    this.hue = Math.random()*360;
    this.offset = 100;
    this.saturation = 100;
    this.lightness = 50;
    this.alpha = 1.0;
    this.colors = [];
    this.init = function(){
        this.canvas = document.createElement("canvas");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerWidth;
        this.ctx = this.canvas.getContext("2d");
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }
    this.update = function(){
        this.ctx.drawImage(video, this.centerX - 640, this.centerY - 360);
    }
}