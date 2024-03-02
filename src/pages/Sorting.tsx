import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "./Sorting.css";
import Canvas from "../components/sorting/canvas";
export default function Sorting() {
  return (
    <div className='page sorting-page'>
      <PanelGroup direction='horizontal'>
        <Panel>
          <div className='left'>Left</div>
        </Panel>
        <PanelResizeHandle className='resize-handle' />
        <Panel>
          <div className='right'>
            <h1>Sorting</h1>
            <Canvas className='canvas-1' />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
