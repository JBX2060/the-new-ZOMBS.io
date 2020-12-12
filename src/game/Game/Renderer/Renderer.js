import RendererEngine from "Engine/Renderer/Renderer";

class Renderer extends RendererEngine {
  constructor() {
    super(('localStorage' in window && window.localStorage.getItem('forceCanvas') === 'true'));
  }
}

export default Renderer;
