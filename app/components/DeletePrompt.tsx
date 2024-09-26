type Props = {
  onDelete: () => void;
  onCancel: () => void;
};

const DeletePrompt = ({ onDelete, onCancel }: Props) => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-10">
    <div className="bg-white p-8 rounded shadow-3xl ">
      <h2 className="text-2xl mb-4">Are you sure for the delete?</h2>
      <div className="flex justify-end">
        <button onClick={onCancel} className="bg-gray-300 text-black p-2 rounded">
          Cancel
        </button>
        <button onClick={onDelete} className="bg-red-500 text-white p-2 rounded ml-2">
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default DeletePrompt;
