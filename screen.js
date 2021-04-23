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
      this.imageData.data[i] = x;           // R value
      this.imageData.data[i + 1] = y;       // G value
      this.imageData.data[i + 2] = 255 - x; // B value
      this.imageData.data[i + 3] = 255;     // A value
    }
  }

  fillBuffer(buffer) {
    for (let i = 0; i < this.imageData.data.length; i += 4) {
      // Modify pixel data
      this.imageData.data[i + 0] = buffer[i];     // R value
      this.imageData.data[i + 1] = buffer[i + 1]; // G value
      this.imageData.data[i + 2] = buffer[i + 2]; // B value
      this.imageData.data[i + 3] = buffer[i + 3]; // A value
    }
  }

  drawBuffer() {
    this.ctx.putImageData(this.imageData, 0, 0);
  }
}

export default Screen;
