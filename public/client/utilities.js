/**
 * Various Utilities
 */


/**
 * Simple parameter adjustment GUI
 * uses p5.gui
 * > https://github.com/bitcraftlab/p5.gui
 * which wraps the quicksettings library which you can access
 * through .prototype for extra functionality
 * > https://github.com/bit101/quicksettings
 */
let _paramGui;
function createParamGui(params, callback) {

  // settings gui
  _paramGui = createGui('Settings');
  // settingsGui.prototype.addButton("Save", function () { storeItem("params", settings) });
  _paramGui.addObject(params)
  if (callback)
    _paramGui.prototype.setGlobalChangeHandler(callback)
  // settingsGui.prototype.addRange('size', 1, 64, 32, 1, function(v) { print("size changed", v) } )


  _paramGui.setPosition(width + 10, 10);
  // the 'S' key hides or shows the GUI
  _paramGui.prototype.setKey("s");

}


fps = 0

function drawFps() {
  let a = 0.01
  fps = a * frameRate() + (1 - a) * fps
  stroke(255)
  strokeWeight(0.5)
  fill(0)
  textAlign(LEFT, TOP)
  textSize(20.0)
  text(this.fps.toFixed(1), 10, 10)
}

/*
 * Simple debugging to HTML textarea
 */
let _debugTextArea

function debug(s) {
  if (typeof _debugTextArea !== 'undefined')
    _debugTextArea.html(s + '\n', true); 
}

function debugClear() {
  if (typeof _debugTextArea !== 'undefined')  
    _debugTextArea.html('')
}

function createDebugWindow() {
  _debugTextArea = createElement('textarea')
  _debugTextArea.style('min-width: 700px; height: 400px; padding: 20px; margin: 20px;')
  debug('** debug window created **')
}



