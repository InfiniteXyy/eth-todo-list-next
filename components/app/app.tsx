import { TaskList } from '~/components';
import { useAccount, useContract, useTaskList } from './app-data';

export function App() {
  const { data: account } = useAccount();
  const { data: contract } = useContract();
  const { data: tasks, mutate: refetchTasks, isValidating: isLoading } = useTaskList();
  const [isMutating, setIsMutating] = useState(false);

  if (!account) return <div>Please bind your wallet via metamask</div>;
  if (!contract) return <div>AccountId: {account}, loading contract</div>;
  if (!tasks) return <div>AccountId: {account}, loading tasksList</div>;

  const createTask = async (content: string) => {
    setIsMutating(true);
    await contract.createTask(content, { from: account });
    setIsMutating(false);
    await refetchTasks();
  };

  const toggleCompleted = async (taskId: number) => {
    setIsMutating(true);
    await contract.toggleCompleted(taskId, { from: account });
    setIsMutating(false);
    await refetchTasks();
  };

  return (
    <>
      <span id="account">{account}</span>
      <div className={`${isLoading || isMutating ? 'pointer-events-none opacity-40' : ''}`}>
        <TaskList data={tasks} onCreateTask={createTask} onToggleTaskStatus={toggleCompleted} />
      </div>
    </>
  );
}
