import { useState } from "react";

interface ListGroupProps {
  items: string[];
  heading: string;
  onSelectItem: (item: string) => void;
  // The ListGroupProps interface defines the properties that the ListGroup component expects.
  // It includes an array of strings called items and a string called heading.
}

function ListGroup({ items, heading, onSelectItem }: ListGroupProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  // The ListGroup component maintains a state variable called selectedIndex to track the currently selected item in the list.
  // The useState hook is used to initialize selectedIndex to -1, indicating that no item is selected initially.
  return (
    <>
      <h1>{heading}</h1>
      {items.length === 0 && <p>No items found</p>}
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            key={item}
            onClick={() => {
              setSelectedIndex(index);
              // The onClick handler updates the selectedIndex state when an item is clicked.
              onSelectItem(item);
              // This line calls the onSelectItem function if it is provided, passing the clicked item as an argument.
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
    // The ListGroup component renders a heading and a list of items.
    // If the items array is empty, it displays a message indicating that no items were found.
    // Each item in the list is rendered as a list item (<li>) with a click handler that updates the selectedIndex state.
    // The className of each list item is conditionally set to "active" if it is the currently selected item, allowing for visual feedback.
    // The key prop is set to the item value to ensure that each list item has a unique key for React's reconciliation process.
    // The component uses TypeScript for type checking, ensuring that the items prop is an array of strings and the heading prop is a string.
  );
}
export default ListGroup;
