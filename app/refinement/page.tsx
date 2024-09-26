'use client';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';

import socket from '../socket';
import { useAuthContext } from '../context/AuthContext';
import DeletePrompt from '../components/DeletePrompt';

const Page = () => {
  const router = useRouter();
  const { isAdmin } = useAuthContext();
  const [refinements, setRefinements] = useState<{ name: string; id: string }[]>([]);
  const [deleteId, setDeleteId] = useState('');

  useEffect(() => {
    socket.emit('getRefinements');

    socket.on('initRefinements', (list) => {
      setRefinements(list);
    });

    socket.on('updateRefinements', (refinements) => {
      setRefinements(refinements);
    });

    return () => {
      socket.off('initRefinements');
      socket.off('updateRefinements');
    };
  }, []);

  const addRefinement = (name: string) => {
    if (String(name).trim()) {
      socket.emit('addRefinement', { name: String(name).trim(), id: nanoid(6) });
      if (!!document?.getElementById('refinement-name'))
        (document.getElementById('refinement-name') as HTMLInputElement).value = '';
    }
  };

  const handleDelete = () => {
    socket.emit('deleteRefinement', deleteId);
    setDeleteId('');
  };

  const handleRefinementSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addRefinement((document.getElementById('refinement-name') as HTMLInputElement).value);
  };

  return (
    <div className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
      <main className="fixed inset-x-0 w-full peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
        <div className="mx-auto sm:max-w-6xl sm:px-4 flex flex-col items-center">
          {isAdmin && (
            <form onSubmit={handleRefinementSubmit} className="flex w-1/3">
              <input
                type="text"
                placeholder="Refinement Name"
                className="shadow-md flex-1 border p-2 mr-2 rounded border-gray-200"
                autoComplete="off"
                id="refinement-name"
              />
              <button type="submit" className="shadow-md bg-yellow-500 text-black px-4 rounded">
                Create
              </button>
            </form>
          )}
          <div className="mt-4 mb-4 flex gap-2 px-4 sm:px-0 flex-wrap  justify-center">
            {refinements.length ? (
              refinements.map((refinement, index) => (
                <div
                  key={refinement.id}
                  className={`w-[30%] shadow-md hover:shadow-xl rounded-lg border border-gray-200 p-4 hover:bg-gray-100 ${
                    index > 1 && 'hidden md:block'
                  }`}
                >
                  <div
                    className="text-sm font-semibold cursor-pointer"
                    onClick={() => !!refinement.id && router.push(`/refinement/${refinement.id}`)}
                  >
                    {refinement.name}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className="py-1 text-sm text-[#fb8500] cursor-pointer"
                      onClick={() => !!refinement.id && router.push(`/refinement/${refinement.id}`)}
                    >
                      Refinement-ID: {refinement.id}
                    </span>
                    {isAdmin && (
                      <>
                        <span
                          className="text-right text-xs text-red-500 cursor-pointer"
                          onClick={() => setDeleteId(refinement.id)}
                        >
                          delete
                        </span>
                        {!!deleteId && <DeletePrompt onCancel={() => setDeleteId('')} onDelete={handleDelete} />}
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div>
                <p className="text-red-600">no refinements found!</p>
                <p className="text-yellow-500">
                  {isAdmin ? 'add a new one like: "joker, May 20"' : 'ask admin to create one'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
