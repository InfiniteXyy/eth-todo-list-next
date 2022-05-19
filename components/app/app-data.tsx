import * as TruffleContract from '@truffle/contract';
import useSWR from 'swr';
import Web3 from 'web3';
import { TodoListInstance } from '~/types/truffle-contracts';
import { ITask } from './task-list';

export const useAccount = () => {
  return useSWR('account', async () => {
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    return accounts[0] as string;
  });
};

export const useContract = () => {
  return useSWR('contract', async () => {
    const taskListContract = (await import('~/build/contracts/TodoList.json')).default;
    const contract: any = (TruffleContract as any)(taskListContract);
    contract.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:7545'));
    return (await contract.deployed()) as TodoListInstance;
  });
};

export const useTaskList = () => {
  const { data: contract } = useContract();
  return useSWR(['task-list', !!contract], async () => {
    if (!contract) return null;
    const taskCount = (await contract.taskCount()).toNumber();
    return await Promise.all(
      Array.from({ length: taskCount }).map((_, index) =>
        Promise.resolve().then(async () => {
          const task = await contract.tasks(index + 1);
          return { id: task[0].toNumber(), content: task[1], completed: task[2] } as ITask;
        })
      )
    );
  });
};
