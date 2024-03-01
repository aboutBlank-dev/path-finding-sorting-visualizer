import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "./Sorting.css";
export default function Sorting() {
  return (
    <div className='page sorting-page'>
      <PanelGroup direction='horizontal'>
        <Panel>
          <div className='left'>Left</div>
        </Panel>
        <PanelResizeHandle className='resize-handle' />
        <Panel>
          <div className='right'>Right</div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
