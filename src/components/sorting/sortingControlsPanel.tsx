import { Panel, PanelProps } from "react-resizable-panels";
import {
  SortingAlgorithm,
  isValidSortingAlgorithm,
  useSorting,
} from "../../contexts/sortingContext";

export default function SortingControlsPanel(props: PanelProps) {
  const sortingContext = useSorting();

  const onAlgorithmSelected = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (isValidSortingAlgorithm(value)) {
      sortingContext.setAlgorithm(value);
    }
  };

  return (
    <Panel {...props}>
      <div className='controls-section'>
        <select
          name='algorithms'
          id='sorting-algorithms'
          onChange={onAlgorithmSelected}
          value={sortingContext.algorithm}
        >
          {Object.values(SortingAlgorithm).map((algorithm) => {
            return (
              <option key={algorithm} value={algorithm}>
                {algorithm}
              </option>
            );
          })}
        </select>
      </div>
    </Panel>
  );
}
