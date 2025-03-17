import React from "react";
import Input from "./Input";
import Modal from "./Modal";

const NewProject = ({ handleStartAddProject, onAdd, onCancel }) => {
  const title = React.useRef();
  const description = React.useRef();
  const dueDate = React.useRef();

  const modal = React.useRef();

  function handleSave() {
    if (
      !title.current.value ||
      !description.current.value ||
      !dueDate.current.value
    ) {
      //show error modal
      modal.current.open();
    }
    const project = {
      title: title.current.value,
      description: description.current.value,
      dueDate: dueDate.current.value,
      id: Math.random().toString(),
    };

    onAdd(project);
  }

  const btnText = "Close";

  return (
    <div className="w-[35rem] mt-16">
      <Modal ref={modal} btnText={btnText}>
        <h2 className="text-xl font-bold text-stone-700 my-4">Invalid Input</h2>
        <p className="text-stone-600 mb-4">
          Oops... looks like you forgot to enter a value
        </p>
        <p className="text-stone-600 mb-4">
          Please make sure you provide valid input for every fields
        </p>
      </Modal>

      <menu className="flex items-center justify-end gap-4 my-4">
        <li>
          <button
            className="text-stone-800 hover:text-stone-950"
            onClick={onCancel}
          >
            Cancel
          </button>
        </li>
        <li>
          <button
            className="px-6 py-2 rounded-md bg-stone-800 text-stone-50 hover:bg-stone-950"
            onClick={handleSave}
          >
            Save
          </button>
        </li>
      </menu>

      <div>
        <Input label="Title" ref={title} />
        <Input label="Descriptioon" textarea ref={description} />
        <Input type="date" label="Due Date" ref={dueDate} />
      </div>
    </div>
  );
};

export default NewProject;
