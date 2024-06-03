'use client';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';

import socket from '../socket';
import { useAuthContext } from '../context/AuthContext';

const Page = () => {
  const router = useRouter();
  const { isAdmin } = useAuthContext();
  const [refinements, setRefinements] = useState<{ name: string; id: string }[]>([]);

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
                className="flex-1 border p-2 mr-2 rounded"
                id="refinement-name"
              />
              <button type="submit" className=" bg-slate-600 text-white p-2 rounded">
                Create
              </button>
            </form>
          )}
          <div className="mt-4 mb-4 grid grid-cols-3 gap-2 px-4 sm:px-0">
            {refinements.length ? (
              refinements.map((refinement, index) => (
                <div
                  key={refinement.id}
                  className={`shadow-lg hover:shadow-3xl cursor-pointer rounded-lg border p-4 hover:bg-zinc-800 ${
                    index > 1 && 'hidden md:block'
                  }`}
                  onClick={() => !!refinement.id && router.push(`/refinement/${refinement.id}`)}
                >
                  <div className="text-sm font-semibold">{refinement.name}</div>
                  <div className="text-sm text-zinc-600">Join the game and start playing!</div>
                  <div className={`text-sm text-yellow-500`}>Refinement-ID: {refinement.id}</div>
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
