export type ITask = {
  id: number;
  content: string;
  completed: boolean;
};

interface TaskListProps {
  data: ITask[];
  onCreateTask(content: string): Promise<void>;
  onToggleTaskStatus(id: number): Promise<void>;
}

export function TaskList(props: TaskListProps) {
  const { data, onCreateTask, onToggleTaskStatus } = props;
  const [inputValue, setInputValue] = useState('');

  const handleCreateTask = async () => {
    await onCreateTask(inputValue);
    setInputValue('');
  };

  return (
    <div>
      <input
        className="bg-slate-200 dark:bg-slate-800"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleCreateTask}>Create</button>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <input type="checkbox" checked={item.completed} onChange={() => onToggleTaskStatus(item.id)} />
            <span>{item.content}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
