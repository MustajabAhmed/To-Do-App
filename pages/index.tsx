import moment, { Moment as MomentType } from 'moment';
import Head from 'next/head'
import { SyntheticEvent, useEffect, useState } from 'react';
import { v4 as uuidv4 } from "uuid";

interface Item {
  id: number;
  description: string;
  date: MomentType;
}

export default function Index() {
  const [item, setItem] = useState("");
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [currentId, setCurrentId] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const items = localStorage.getItem("todo-items");
    const currentId = localStorage.getItem("todo-current-id");

    if (items === null || items.length === 0) {
      setLoading(false);
      return;
    }
    setCurrentId(currentId !== null ? parseInt(currentId) : 0);
    setAllItems(JSON.parse(items));
    setLoading(false);
  }, []);

  const add = (e: SyntheticEvent) => {
    e.preventDefault();
    if (loading) return;
    const items = [...allItems];
    items.push({
      id: currentId + 1,
      description: item,
      date: moment()
    });

    localStorage.setItem('todo-items', JSON.stringify(items));
    localStorage.setItem('todo-current-id', `${currentId + 1}`);

    setCurrentId(currentId + 1);
    setAllItems(items);
    setItem("");
  }

  const remove = (e: SyntheticEvent, id: number) => {
    e.preventDefault();
    if (loading) return;
    const items = [...allItems];

    let index = items.findIndex(item => item.id === id);
    items.splice(index, 1);
    setAllItems(items);

    localStorage.setItem('todo-items', JSON.stringify(items));
    setItem("");
  }

  return (
    <>
      <Head>
        <title>To-do List App!</title>
      </Head>
      <div>
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mt-12" style={{ textAlign: 'center' }}>To-Do List</h1>
          <br />
          <form className='w-full md:w-1/3 m-auto' >
            <div style={{ display: 'flex' }}>

              <input
                className="w-full rounded py-1 px-2 outline-none border-2 border-blue-100 hover:border-blue-300 focus:border-blue-400 transition-colors" placeholder='add items'
                onChange={(e) => setItem(e.target.value)}
                value={item}
              />
              &nbsp;
              <button
                className="mt-1 rounded-md bg-blue-300 bg-opacity-20 px-2 py-2 text-sm font-medium text-blue-800 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-opacity-75 transition flex items-center justify-center"
                onClick={add}
                disabled={loading}
              >
                Add
              </button>
            </div>
          </form>
          <h3 className="text-xl mt-6" style={{ textAlign: 'center' }}>All Items</h3>
          <br />
          <table className='w-80 border m-auto' style={{ textAlign: 'center' }}>
            <thead className="font-bold">
              <tr>
                <td>To-Do</td>
                <td>Actions</td>
              </tr>
            </thead>
            <tbody>
              {allItems.map(item => <tr key={uuidv4()}>
                <td>{item.description}</td>
                <td>
                  <button className="rounded-md bg-red-300 bg-opacity-20 px-4 py-2 text-sm font-medium text-red-800 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-800 focus-visible:ring-opacity-75 transition" onClick={(e) => remove(e, item.id)}>Delete</button>
                </td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
