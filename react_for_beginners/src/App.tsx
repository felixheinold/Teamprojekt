import ListGroup from "./components/ListGroup";
import Alert from "./components/Alert";

function App() {
  let Obst = ["Apfel", "Banane", "Orange", "Ananas", "Kiwi", "Mango"];
  let Gemüse = [
    "Karotte",
    "Brokkoli",
    "Spinat",
    "Tomate",
    "Paprika",
    "Zucchini",
  ];
  // The Obst array contains a list of fruits.
  // The Gemüse array contains a list of vegetables.
  // These arrays are used to populate the ListGroup component.
  // The ListGroup component is responsible for rendering the items in a list format.

  const handleSelectItem = (item: string) => {
    console.log("Selected item:", item);
    // The handleSelectItem function is called when an item in the ListGroup is clicked.
    // It logs the selected item to the console.
  };
  return (
    <>
      <div>
        <Alert>
          Hello <span>World</span>
        </Alert>
        <ListGroup
          items={Obst}
          heading="Obst"
          onSelectItem={handleSelectItem}
        />
        <ListGroup
          items={Gemüse}
          heading="Gemüse"
          onSelectItem={handleSelectItem}
        />
        <ListGroup
          items={[]}
          heading="Leere Liste"
          onSelectItem={handleSelectItem}
        />
        <ListGroup
          items={["Erdbeere", "Himbeere", "Blaubeere"]}
          heading="Beeren"
          onSelectItem={handleSelectItem}
        />
      </div>
    </>
  );
}
export default App;
// This is the main entry point of the EduKIT application.
// It imports the Message component and renders it within a div.
// The App component serves as the root component for the application.
// The Message component displays a welcome message to the user.
