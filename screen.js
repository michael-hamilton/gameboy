class Screen {
  constructor(canvas) {

    this.buffer = [];
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.imageData = this.ctx.createImageData(160, 144);

    for (let i = 0; i < this.imageData.data.length; i += 4) {
      // Percentage in the x direction, times 255
      let x = (i % 400) / 400 * 255;
      // Percentage in the y direction, times 255
      let y = Math.ceil(i / 400) / 100 * 255;

      // Modify pixel data
      this.imageData[i + 0] = x;        // R value
      this.imageData[i + 1] = y;        // G value
      this.imageData[i + 2] = 255 - x;  // B value
      this.imageData[i + 3] = 255;      // A value
    }
  }

  fillBuffer(data) {
    this.buffer = data;
  }

  drawBuffer() {
    this.ctx.putImageData(this.imageData, 0, 0);
  }
}

export default Screen;
